// ============================================
// MERCADOPAGO WEBHOOK - IPN HANDLER
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MercadoPagoProvider } from '@/lib/payments/mercadopago';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('[MP Webhook] Received:', JSON.stringify(body, null, 2));

        const { type, data } = body;

        // Only handle payment events
        if (type !== 'payment') {
            return NextResponse.json({ received: true });
        }

        const paymentId = data?.id;
        if (!paymentId) {
            return NextResponse.json({ received: true });
        }

        // Get payment status from MercadoPago
        const mp = new MercadoPagoProvider();
        const paymentStatus = await mp.getPaymentStatus(paymentId);

        console.log('[MP Webhook] Payment status:', paymentStatus);

        // Find order by external_reference or stripeSessionId
        const order = await prisma.order.findFirst({
            where: {
                OR: [
                    { stripeSessionId: body.external_reference },
                    { id: body.external_reference }
                ]
            }
        });

        if (!order) {
            console.log('[MP Webhook] Order not found for reference:', body.external_reference);
            return NextResponse.json({ received: true });
        }

        // Update order based on payment status
        const statusMap: Record<string, { paymentStatus: any; orderStatus: any }> = {
            'succeeded': { paymentStatus: 'PAID', orderStatus: 'PAID' },
            'pending': { paymentStatus: 'PENDING', orderStatus: 'PENDING' },
            'processing': { paymentStatus: 'PROCESSING', orderStatus: 'PROCESSING' },
            'failed': { paymentStatus: 'FAILED', orderStatus: 'CANCELLED' }
        };

        const newStatus = statusMap[paymentStatus.status] || statusMap['pending'];

        await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: newStatus.paymentStatus,
                status: newStatus.orderStatus
            }
        });

        // If payment succeeded, update inventory
        if (paymentStatus.status === 'succeeded') {
            const orderWithItems = await prisma.order.findUnique({
                where: { id: order.id },
                include: { items: true }
            });

            if (orderWithItems) {
                for (const item of orderWithItems.items) {
                    // Decrease product stock
                    await prisma.product.updateMany({
                        where: { id: item.productId },
                        data: {
                            stock: { decrement: item.quantity }
                        }
                    });
                }
            }

            // Update customer stats
            const customer = await prisma.customer.findFirst({
                where: { id: order.userId }
            });

            if (customer) {
                await prisma.customer.update({
                    where: { id: customer.id },
                    data: {
                        // lastOrderAt: new Date(),
                        // totalPurchases: { increment: order.total }
                    }
                });
            }
        }

        console.log('[MP Webhook] Order updated:', order.id, newStatus);

        return NextResponse.json({
            received: true,
            orderId: order.id,
            status: newStatus.paymentStatus
        });

    } catch (error: any) {
        console.error('[MP Webhook] Error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// MercadoPago also sends GET requests for verification
export async function GET(request: NextRequest) {
    return NextResponse.json({ status: 'ok' });
}
