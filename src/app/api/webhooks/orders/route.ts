// ============================================
// WEBHOOK: ORDER STATUS UPDATES
// POST /api/webhooks/orders
// 
// Este endpoint se llama cuando cambia el status
// de un pedido (ej: SHIPPED, DELIVERED)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import {
    sendWhatsAppMessage,
    buildShippingNotificationMessage,
    buildDeliveryConfirmationMessage
} from '@/lib/twilio';
import { sendEmail } from '@/lib/resend';

// Schema de validación
const OrderUpdateSchema = z.object({
    orderId: z.string().cuid(),
    status: z.enum([
        'PENDING',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'RETURNED',
    ]),
    trackingNumber: z.string().optional(),
    trackingUrl: z.string().url().optional(),
    carrier: z.string().optional(),
    adminNote: z.string().optional(),
    // API Key simple para proteger el endpoint
    apiKey: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = OrderUpdateSchema.parse(body);

        // Validar API Key
        if (data.apiKey !== process.env.INTERNAL_API_KEY) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Obtener pedido actual
        const order = await prisma.order.findUnique({
            where: { id: data.orderId },
            include: {
                user: true,
                address: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        const previousStatus = order.status;

        // Actualizar pedido
        const updatedOrder = await prisma.order.update({
            where: { id: data.orderId },
            data: {
                status: data.status as any,
                trackingNumber: data.trackingNumber || order.trackingNumber,
            },
            include: {
                user: true,
            },
        });

        // Enviar notificaciones según el nuevo status
        await handleStatusNotification(updatedOrder, previousStatus, {
            trackingNumber: data.trackingNumber,
            trackingUrl: data.trackingUrl,
            carrier: data.carrier,
        });

        return NextResponse.json({
            success: true,
            order: {
                id: updatedOrder.id,
                orderNumber: updatedOrder.orderNumber,
                status: updatedOrder.status,
                previousStatus,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.issues },
                { status: 400 }
            );
        }

        console.error('Error updating order:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ============================================
// NOTIFICACIONES POR CAMBIO DE STATUS
// ============================================

interface OrderForNotification {
    id: string;
    orderNumber: string;
    status: string;
    user: {
        name: string | null;
        email: string;
        // phone: string | null; // Removed phone as it is not on User model in schema currently or might be on Address
    };
}

interface TrackingInfo {
    trackingNumber?: string;
    trackingUrl?: string;
    carrier?: string;
}

async function handleStatusNotification(
    order: any, // Using any temporarily or the proper type inferred from Prisma
    previousStatus: string,
    tracking: TrackingInfo
) {
    const { user } = order;
    if (!user || !user.email) return;

    const userName = user.name || 'Cliente';

    switch (order.status) {
        // Notificación: Pedido Enviado
        case 'SHIPPED':
            if (tracking.trackingNumber) {
                // WhatsApp
                // WhatsApp: Coming soon (User model does not have phone currently)
                /*
                if (user.phone) {
                    await sendWhatsAppMessage({
                        to: user.phone,
                        body: buildShippingNotificationMessage({
                            customerName: userName,
                            orderNumber: order.orderNumber,
                            trackingNumber: tracking.trackingNumber,
                            trackingUrl: tracking.trackingUrl,
                            carrier: tracking.carrier,
                        }),
                    });
                }
                */

                // Email
                await sendEmail({
                    to: user.email,
                    subject: `🚚 Tu pedido #${order.orderNumber} va en camino`,
                    html: `
            <h1>¡Tu pedido ha sido enviado!</h1>
            <p>Hola ${userName},</p>
            <p>Tu pedido <strong>#${order.orderNumber}</strong> está en camino.</p>
            <p><strong>Número de guía:</strong> ${tracking.trackingNumber}</p>
            ${tracking.trackingUrl ? `<p><a href="${tracking.trackingUrl}">Rastrea tu paquete aquí</a></p>` : ''}
            ${tracking.carrier ? `<p><strong>Paquetería:</strong> ${tracking.carrier}</p>` : ''}
          `,
                });
            }
            break;

        // Notificación: Pedido Entregado
        case 'DELIVERED':
            // WhatsApp
            // WhatsApp: Coming soon
            /*
            if (user.phone) {
                await sendWhatsAppMessage({
                    to: user.phone,
                    body: buildDeliveryConfirmationMessage({
                        customerName: userName,
                        orderNumber: order.orderNumber,
                    }),
                });
            }
            */

            // Email
            await sendEmail({
                to: user.email,
                subject: `✅ Pedido #${order.orderNumber} entregado`,
                html: `
          <h1>¡Tu pedido ha sido entregado!</h1>
          <p>Hola ${userName},</p>
          <p>Tu pedido <strong>#${order.orderNumber}</strong> ha sido entregado exitosamente.</p>
          <p>¿Todo bien con tu compra? Nos encantaría conocer tu opinión.</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/pedidos/${order.id}/review">Dejar una reseña</a></p>
        `,
            });
            break;

        // Notificación: Pedido Cancelado
        case 'CANCELLED':
            await sendEmail({
                to: user.email,
                subject: `❌ Pedido #${order.orderNumber} cancelado`,
                html: `
          <h1>Pedido Cancelado</h1>
          <p>Hola ${userName},</p>
          <p>Tu pedido <strong>#${order.orderNumber}</strong> ha sido cancelado.</p>
          <p>Si tienes preguntas, contáctanos respondiendo a este correo.</p>
        `,
            });
            break;
    }
}
