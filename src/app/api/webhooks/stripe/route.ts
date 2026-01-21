// ============================================
// WEBHOOK: STRIPE PAYMENT EVENTS
// POST /api/webhooks/stripe
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { constructWebhookEvent } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import {
    sendWhatsAppMessage,
    buildOrderConfirmationMessage
} from '@/lib/twilio';
import {
    sendEmail,
    buildOrderConfirmationEmail
} from '@/lib/resend';
import Stripe from 'stripe';

// Deshabilitar body parsing para webhooks
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'No signature provided' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = constructWebhookEvent(body, signature);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        );
    }

    // Manejar eventos de Stripe
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutCompleted(session);
            break;
        }

        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log('Payment succeeded:', paymentIntent.id);
            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            await handlePaymentFailed(paymentIntent);
            break;
        }

        case 'charge.refunded': {
            const charge = event.data.object as Stripe.Charge;
            await handleRefund(charge);
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

// ============================================
// HANDLERS
// ============================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
        console.error('No orderId in session metadata');
        return;
    }

    try {
        // 1. Actualizar estado del pedido
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'CONFIRMED',
                paymentStatus: 'PAID',
                stripePaymentId: session.payment_intent as string,
                stripeSessionId: session.id,
            },
            include: {
                user: true,
                address: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // 2. Registrar transacción contable (Placeholder - Transaction model not yet in schema)
        /*
        await prisma.transaction.create({
            data: {
                orderId: order.id,
                type: 'SALE',
                amount: order.total,
                description: `Venta web - Pedido #${order.orderNumber}`,
                reference: session.payment_intent as string,
            },
        });
        */

        // 3. Decrementar inventario
        for (const item of order.items) {
            // Registrar movimiento de inventario (AuditLog) - Get product before decrement for previousQty
            const productBeforeUpdate = await prisma.product.findUnique({
                where: { id: item.productId },
            });

            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });

            await prisma.auditLog.create({
                data: {
                    entity: 'Product',
                    entityId: item.productId,
                    action: 'SALE_WEB',
                    userId: 'admin', // System or User ID if available
                    details: {
                        quantity: -item.quantity,
                        reason: `Venta web - Pedido #${order.orderNumber}`,
                        reference: order.id,
                        newQty: (productBeforeUpdate?.stock ?? 0) - item.quantity, // Calculate new quantity
                    },
                },
            });
        }

        // 4. Enviar notificaciones
        await sendOrderNotifications(order);

        console.log(`✅ Order ${order.orderNumber} processed successfully`);
    } catch (error) {
        console.error('Error processing checkout:', error);
        throw error;
    }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.orderId;

    if (orderId) {
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'FAILED',
            },
        });
    }
}

async function handleRefund(charge: Stripe.Charge) {
    const paymentIntentId = charge.payment_intent as string;

    const order = await prisma.order.findFirst({
        where: { stripePaymentId: paymentIntentId },
    });

    if (order) {
        await prisma.order.update({
            where: { id: order.id },
            data: {
                status: 'REFUNDED',
                paymentStatus: 'REFUNDED',
            },
        });

        /*
        await prisma.transaction.create({
            data: {
                orderId: order.id,
                type: 'REFUND',
                amount: charge.amount_refunded / 100, // Stripe usa centavos
                description: `Reembolso - Pedido #${order.orderNumber}`,
                reference: charge.id,
            },
        });
        */
    }
}

// ============================================
// NOTIFICACIONES POST-PAGO
// ============================================

interface OrderWithRelations {
    id: string;
    orderNumber: string;
    total: number | { toNumber: () => number };
    user: {
        name: string | null;
        email: string;
        // phone: string | null; // Removed phone as it is not on User model
    };
    address: {
        street: string;
        extNumber: string | null;
        colony: string | null;
        city: string;
        state: string;
        zipCode: string;
    };
    items: {
        name: string;
        quantity: number;
        price: number | { toNumber: () => number };
    }[];
}

async function sendOrderNotifications(order: OrderWithRelations) {
    const totalNum = typeof order.total === 'object'
        ? order.total.toNumber()
        : order.total;

    const formattedTotal = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(totalNum);

    // 1. Enviar WhatsApp si hay teléfono (Disabled for now)
    /*
    if (order.user.phone) {
        await sendWhatsAppMessage({
            to: order.user.phone,
            body: buildOrderConfirmationMessage({
                customerName: order.user.name || 'Cliente',
                orderNumber: order.orderNumber,
                total: formattedTotal,
            }),
        });
    }
    */

    // 2. Enviar Email
    const shippingAddress = [
        order.address.street,
        order.address.extNumber ? `#${order.address.extNumber}` : '',
        order.address.colony || '',
        `${order.address.city}, ${order.address.state}`,
        `C.P. ${order.address.zipCode}`,
    ].filter(Boolean).join('<br>');

    await sendEmail({
        to: order.user.email,
        subject: `✅ Pedido #${order.orderNumber} Confirmado`,
        html: buildOrderConfirmationEmail({
            customerName: order.user.name || 'Cliente',
            orderNumber: order.orderNumber,
            orderDate: new Date().toLocaleDateString('es-MX'),
            items: order.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                }).format(typeof item.price === 'object' ? item.price.toNumber() : item.price),
            })),
            subtotal: formattedTotal, // Simplificado
            shipping: 'Calculado',
            total: formattedTotal,
            shippingAddress,
        }),
    });
}
