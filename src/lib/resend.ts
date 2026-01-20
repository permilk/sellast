// ============================================
// RESEND EMAIL SERVICE
// ============================================

import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured. Emails will be logged only.');
}

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export interface EmailParams {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}

/**
 * Envía un email vía Resend
 */
export async function sendEmail(
    params: EmailParams
): Promise<{ success: boolean; id?: string; error?: string }> {
    // Si no hay cliente configurado, solo loguear
    if (!resend) {
        console.log('[Email Mock] To:', params.to);
        console.log('[Email Mock] Subject:', params.subject);
        return { success: true, id: 'mock-email-id' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: params.to,
            subject: params.subject,
            html: params.html,
            text: params.text,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, id: data?.id };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ============================================
// TEMPLATES DE EMAIL
// ============================================

export function buildOrderConfirmationEmail(params: {
    customerName: string;
    orderNumber: string;
    orderDate: string;
    items: { name: string; quantity: number; price: string }[];
    subtotal: string;
    shipping: string;
    total: string;
    shippingAddress: string;
}): string {
    const itemsHtml = params.items
        .map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price}</td>
      </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">✅ Pedido Confirmado</h1>
      <p style="margin: 10px 0 0; opacity: 0.9;">Pedido #${params.orderNumber}</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333;">
        Hola <strong>${params.customerName}</strong>,
      </p>
      <p style="color: #666; line-height: 1.6;">
        ¡Gracias por tu compra! Tu pedido ha sido recibido y está siendo procesado.
      </p>
      
      <!-- Order Details -->
      <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px; color: #333;">Resumen del Pedido</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #eee;">
              <th style="padding: 12px; text-align: left;">Producto</th>
              <th style="padding: 12px; text-align: center;">Cantidad</th>
              <th style="padding: 12px; text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #ddd;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span>${params.subtotal}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Envío:</span>
            <span>${params.shipping}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #1a1a2e;">
            <span>Total:</span>
            <span>${params.total}</span>
          </div>
        </div>
      </div>
      
      <!-- Shipping Address -->
      <div style="background: #f0f7ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px; color: #333;">📍 Dirección de Envío</h4>
        <p style="margin: 0; color: #666; line-height: 1.6;">${params.shippingAddress}</p>
      </div>
      
      <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
        Te notificaremos cuando tu pedido sea enviado.<br>
        ¿Preguntas? Contáctanos respondiendo a este email.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999;">
      <p style="margin: 0;">© ${new Date().getFullYear()} Tu Tienda. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
`;
}
