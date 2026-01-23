// ============================================
// CHECKOUT API - CREATE ORDER + MERCADOPAGO
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPaymentProvider } from '@/lib/payments';

interface CheckoutItem {
    productId: string;
    variantId?: string;
    name: string;
    quantity: number;
    price: number;
}

interface CheckoutRequest {
    items: CheckoutItem[];
    customer: {
        email: string;
        name: string;
        phone?: string;
    };
    shippingAddress?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body: CheckoutRequest = await request.json();
        const { items, customer, shippingAddress } = body;

        // Validation
        if (!items || items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No items in cart' },
                { status: 400 }
            );
        }

        if (!customer?.email || !customer?.name) {
            return NextResponse.json(
                { success: false, error: 'Customer email and name are required' },
                { status: 400 }
            );
        }

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxRate = 0.16; // IVA Mexico
        const taxTotal = subtotal * taxRate;
        const shippingCost = subtotal >= 500 ? 0 : 99; // Free shipping over $500
        const total = subtotal + taxTotal + shippingCost;

        // Find or create customer
        let dbCustomer = await prisma.customer.findFirst({
            where: { email: customer.email }
        });

        if (!dbCustomer) {
            dbCustomer = await prisma.customer.create({
                data: {
                    email: customer.email,
                    name: customer.name,
                    phone: customer.phone || null,
                }
            });
        }

        // Generate order number
        const orderCount = await prisma.order.count();
        const orderNumber = `WEB-${String(orderCount + 1).padStart(6, '0')}`;

        // Create address if provided
        let addressId: string | undefined;
        if (shippingAddress) {
            // For now, we'll store address in JSON field in Order
            // In production, create proper Address record
        }

        // Create order in PENDING status
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: dbCustomer.id,
                addressId: addressId || 'temp-address', // Handle properly
                status: 'PENDING',
                paymentStatus: 'PENDING',
                subtotal,
                discount: 0,
                shippingCost,
                total,
                shippingMethod: 'standard',
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        name: item.name,
                        sku: '',
                        price: item.price,
                        quantity: item.quantity,
                        subtotal: item.price * item.quantity
                    }))
                }
            },
            include: {
                items: true
            }
        });

        // Create MercadoPago preference
        const paymentProvider = getPaymentProvider('mercadopago');
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const paymentResult = await paymentProvider.createPayment({
            amount: total,
            currency: 'MXN',
            description: `Orden ${orderNumber}`,
            orderId: order.id,
            customerEmail: customer.email,
            items: items.map(item => ({
                title: item.name,
                quantity: item.quantity,
                unitPrice: item.price
            })),
            successUrl: `${appUrl}/checkout/success?order=${order.id}`,
            failureUrl: `${appUrl}/checkout/failure?order=${order.id}`,
            pendingUrl: `${appUrl}/checkout/pending?order=${order.id}`
        });

        if (!paymentResult.success) {
            // Delete order if payment failed
            await prisma.order.delete({ where: { id: order.id } });
            return NextResponse.json(
                { success: false, error: paymentResult.error || 'Payment creation failed' },
                { status: 500 }
            );
        }

        // Update order with payment intent ID
        await prisma.order.update({
            where: { id: order.id },
            data: {
                stripeSessionId: paymentResult.intentId // Using this field for MP preference ID
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                total,
                paymentUrl: paymentResult.redirectUrl,
                preferenceId: paymentResult.intentId
            }
        });

    } catch (error: any) {
        console.error('[Checkout] Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Checkout failed' },
            { status: 500 }
        );
    }
}
