// ============================================
// TWILIO WHATSAPP SERVICE
// ============================================

import twilio from 'twilio';

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('Twilio credentials not configured. WhatsApp messages will be logged only.');
}

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

export interface WhatsAppMessage {
    to: string; // Número con código de país: +521234567890
    body: string;
}

/**
 * Envía un mensaje de WhatsApp vía Twilio
 */
export async function sendWhatsAppMessage(
    message: WhatsAppMessage
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const formattedTo = message.to.startsWith('whatsapp:')
        ? message.to
        : `whatsapp:${message.to}`;

    // Si no hay cliente configurado, solo loguear
    if (!client) {
        console.log('[WhatsApp Mock] To:', formattedTo);
        console.log('[WhatsApp Mock] Message:', message.body);
        return { success: true, messageId: 'mock-message-id' };
    }

    try {
        const response = await client.messages.create({
            from: WHATSAPP_FROM,
            to: formattedTo,
            body: message.body,
        });

        return {
            success: true,
            messageId: response.sid,
        };
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ============================================
// TEMPLATES DE MENSAJES
// ============================================

export function buildOrderConfirmationMessage(params: {
    customerName: string;
    orderNumber: string;
    total: string;
}): string {
    return `🛍️ *¡Pedido Confirmado!*

Hola ${params.customerName},

Tu pedido *#${params.orderNumber}* ha sido confirmado.

💰 Total: ${params.total}

Te notificaremos cuando sea enviado con tu número de guía.

Gracias por tu compra! 🙏`;
}

export function buildShippingNotificationMessage(params: {
    customerName: string;
    orderNumber: string;
    trackingNumber: string;
    trackingUrl?: string;
    carrier?: string;
}): string {
    const trackingLink = params.trackingUrl
        ? `\n📦 Rastrea aquí: ${params.trackingUrl}`
        : '';

    return `🚚 *¡Tu pedido va en camino!*

Hola ${params.customerName},

Tu pedido *#${params.orderNumber}* ha sido enviado.

🔢 Guía: ${params.trackingNumber}
${params.carrier ? `📮 Paquetería: ${params.carrier}` : ''}${trackingLink}

¡Gracias por tu preferencia! 🎉`;
}

export function buildDeliveryConfirmationMessage(params: {
    customerName: string;
    orderNumber: string;
}): string {
    return `✅ *¡Pedido Entregado!*

Hola ${params.customerName},

Tu pedido *#${params.orderNumber}* ha sido entregado.

¿Todo bien? Cuéntanos tu experiencia dejando una reseña.

¡Gracias por confiar en nosotros! 💚`;
}
