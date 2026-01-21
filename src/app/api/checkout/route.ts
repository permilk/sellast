// ============================================
// API: CHECKOUT - CREAR SESIÓN DE PAGO
// POST /api/checkout
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CheckoutSchema } from '@/lib/validations';
import { calculateShipping, getShippingCost } from '@/lib/shipping';
import { createCheckoutSession } from '@/lib/stripe';

// Simulated auth - en producción usar NextAuth o similar
async function getCurrentUser(request: NextRequest) {
    // TODO: Implementar autenticación real
    const userId = request.headers.get('x-user-id');
    if (!userId) return null;

    return prisma.user.findUnique({
        where: { id: userId },
    });
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);

        if (!user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const data = CheckoutSchema.parse(body);

        // 1. Obtener carrito del usuario
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: user.id },
            include: {
                product: {
                    include: {
                        images: {
                            where: { isPrimary: true },
                            take: 1,
                        },
                    },
                },
                variant: {
                    include: { inventory: true }
                },
            },
        });

        if (cartItems.length === 0) {
            return NextResponse.json(
                { error: 'El carrito está vacío' },
                { status: 400 }
            );
        }

        // 2. Obtener dirección
        const address = await prisma.address.findUnique({
            where: { id: data.addressId },
        });

        if (!address || address.userId !== user.id) {
            return NextResponse.json(
                { error: 'Dirección no válida' },
                { status: 400 }
            );
        }

        // 3. Calcular subtotal y validar stock
        let subtotal = 0;
        let totalWeight = 0;
        const lineItems = [];

        for (const item of cartItems) {
            const price = item.variant
                ? Number(item.variant.salePrice)
                : Number(item.product.price);

            const stock = item.variant
                ? item.variant.inventory.reduce((acc, inv) => acc + inv.quantity, 0)
                : item.product.stock;

            if (item.quantity > stock) {
                return NextResponse.json(
                    { error: `Stock insuficiente para ${item.product.name}` },
                    { status: 400 }
                );
            }

            subtotal += price * item.quantity;
            totalWeight += (Number(item.product.weight) || 0.5) * item.quantity;

            lineItems.push({
                name: item.variant
                    ? `${item.product.name} - ${item.variant.name}`
                    : item.product.name,
                amount: Math.round(price * 100), // Stripe usa centavos
                quantity: item.quantity,
                images: item.product.images[0]?.url
                    ? [item.product.images[0].url]
                    : undefined,
            });
        }

        // 4. Calcular envío
        const shippingCost = getShippingCost(
            data.shippingMethod,
            {
                street: address.street,
                extNumber: address.extNumber || '',
                colony: address.colony || '',
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country,
            },
            subtotal,
            totalWeight
        );

        // 5. Aplicar cupón si existe
        let discount = 0;
        if (data.couponCode) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: data.couponCode.toUpperCase() },
            });

            if (coupon && coupon.isActive) {
                const now = new Date();
                if (now >= coupon.validFrom && now <= coupon.validUntil) {
                    if (!coupon.minPurchase || subtotal >= Number(coupon.minPurchase)) {
                        if (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) {
                            if (coupon.type === 'PERCENTAGE') {
                                discount = subtotal * (Number(coupon.value) / 100);
                                if (coupon.maxDiscount) {
                                    discount = Math.min(discount, Number(coupon.maxDiscount));
                                }
                            } else if (coupon.type === 'FIXED_AMOUNT') {
                                discount = Number(coupon.value);
                            } else if (coupon.type === 'FREE_SHIPPING') {
                                discount = shippingCost;
                            }
                        }
                    }
                }
            }
        }

        // 6. Calcular total
        const total = subtotal - discount + shippingCost;

        // 7. Generar número de orden
        const lastOrder = await prisma.order.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        const orderCount = lastOrder
            ? parseInt(lastOrder.orderNumber.split('-')[2]) + 1
            : 1;
        const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount).padStart(5, '0')}`;

        // 8. Crear orden en estado pendiente
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: user.id,
                addressId: address.id,
                status: 'PENDING',
                paymentStatus: 'PENDING',
                subtotal,
                discount,
                shippingCost,
                total,
                shippingMethod: data.shippingMethod,
                couponCode: data.couponCode,
                customerNote: data.customerNote,
                items: {
                    create: cartItems.map((item: typeof cartItems[number]) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        name: item.variant
                            ? `${item.product.name} - ${item.variant.name}`
                            : item.product.name,
                        sku: item.variant?.sku || item.product.sku,
                        price: item.variant
                            ? item.variant.salePrice
                            : item.product.price,
                        quantity: item.quantity,
                        subtotal: (item.variant
                            ? Number(item.variant.salePrice)
                            : Number(item.product.price)) * item.quantity,
                    })),
                },
            },
        });

        // 9. Crear sesión de Stripe
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const checkoutSession = await createCheckoutSession({
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerEmail: user.email,
            lineItems,
            shippingCost: Math.round(shippingCost * 100),
            successUrl: `${baseUrl}/checkout/success`,
            cancelUrl: `${baseUrl}/checkout/cancel`,
        });

        // 10. Actualizar orden con session ID
        await prisma.order.update({
            where: { id: order.id },
            data: { stripeSessionId: checkoutSession.id },
        });

        return NextResponse.json({
            success: true,
            checkoutUrl: checkoutSession.url,
            orderId: order.id,
            orderNumber: order.orderNumber,
        });

    } catch (error) {
        console.error('Checkout error:', error);

        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Error al procesar el checkout' },
            { status: 500 }
        );
    }
}
