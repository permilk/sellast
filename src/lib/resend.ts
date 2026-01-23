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

// ============================================
// TEMPLATE: TICKET DE VENTA
// ============================================
export function buildSaleTicketEmail(params: {
  customerName: string;
  folio: string;
  fecha: string;
  hora: string;
  items: { name: string; quantity: number; unitPrice: string; subtotal: string }[];
  subtotal: string;
  iva: string;
  total: string;
  metodoPago: string;
  vendedor: string;
  sucursal: string;
}): string {
  const itemsHtml = params.items.map(item => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 14px;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.unitPrice}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">${item.subtotal}</td>
        </tr>
    `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 400px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px;">🧾 Ticket de Venta</h1>
            <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Folio: ${params.folio}</p>
        </div>
        
        <!-- Info -->
        <div style="padding: 20px; border-bottom: 1px dashed #ddd;">
            <table style="width: 100%; font-size: 13px; color: #666;">
                <tr><td>Fecha:</td><td style="text-align: right; font-weight: 500;">${params.fecha}</td></tr>
                <tr><td>Hora:</td><td style="text-align: right; font-weight: 500;">${params.hora}</td></tr>
                <tr><td>Cliente:</td><td style="text-align: right; font-weight: 500;">${params.customerName}</td></tr>
                <tr><td>Vendedor:</td><td style="text-align: right; font-weight: 500;">${params.vendedor}</td></tr>
                <tr><td>Sucursal:</td><td style="text-align: right; font-weight: 500;">${params.sucursal}</td></tr>
            </table>
        </div>
        
        <!-- Items -->
        <div style="padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f9f9f9;">
                        <th style="padding: 8px; text-align: left; font-size: 12px; color: #666;">Producto</th>
                        <th style="padding: 8px; text-align: center; font-size: 12px; color: #666;">Cant.</th>
                        <th style="padding: 8px; text-align: right; font-size: 12px; color: #666;">P.Unit</th>
                        <th style="padding: 8px; text-align: right; font-size: 12px; color: #666;">Subt.</th>
                    </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>
        </div>
        
        <!-- Totals -->
        <div style="background: #f9f9f9; padding: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                <span>Subtotal:</span><span>${params.subtotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                <span>IVA (16%):</span><span>${params.iva}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; color: #7C3AED; padding-top: 10px; border-top: 2px solid #ddd;">
                <span>TOTAL:</span><span>${params.total}</span>
            </div>
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ddd; font-size: 13px; color: #666; text-align: center;">
                Método de pago: <strong>${params.metodoPago}</strong>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 15px; text-align: center; font-size: 12px; color: #999;">
            ¡Gracias por tu compra!
        </div>
    </div>
</body>
</html>
`;
}

// ============================================
// TEMPLATE: FACTURA CFDI
// ============================================
export function buildInvoiceEmail(params: {
  customerName: string;
  rfc: string;
  folio: string;
  uuid: string;
  fechaTimbrado: string;
  items: { descripcion: string; cantidad: number; valorUnitario: string; importe: string }[];
  subtotal: string;
  iva: string;
  total: string;
  usoCFDI: string;
  formaPago: string;
  metodoPago: string;
}): string {
  const itemsHtml = params.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.descripcion}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.cantidad}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.valorUnitario}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">${item.importe}</td>
        </tr>
    `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 650px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="margin: 0; font-size: 22px;">📄 Factura Electrónica CFDI 4.0</h1>
                    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Folio Fiscal: ${params.uuid}</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 24px; font-weight: 700;">${params.folio}</div>
                </div>
            </div>
        </div>
        
        <!-- Receptor -->
        <div style="padding: 25px; border-bottom: 1px solid #eee;">
            <h3 style="margin: 0 0 15px; color: #333; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Datos del Receptor</h3>
            <table style="width: 100%; font-size: 14px;">
                <tr>
                    <td style="padding: 5px 0; color: #666; width: 120px;">Nombre:</td>
                    <td style="font-weight: 500;">${params.customerName}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0; color: #666;">RFC:</td>
                    <td style="font-weight: 500; font-family: monospace;">${params.rfc}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0; color: #666;">Uso CFDI:</td>
                    <td>${params.usoCFDI}</td>
                </tr>
                <tr>
                    <td style="padding: 5px 0; color: #666;">Fecha Timbrado:</td>
                    <td>${params.fechaTimbrado}</td>
                </tr>
            </table>
        </div>
        
        <!-- Conceptos -->
        <div style="padding: 25px;">
            <h3 style="margin: 0 0 15px; color: #333; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Conceptos</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f9f9f9;">
                        <th style="padding: 12px; text-align: left; font-size: 12px; color: #666;">Descripción</th>
                        <th style="padding: 12px; text-align: center; font-size: 12px; color: #666;">Cantidad</th>
                        <th style="padding: 12px; text-align: right; font-size: 12px; color: #666;">Valor Unit.</th>
                        <th style="padding: 12px; text-align: right; font-size: 12px; color: #666;">Importe</th>
                    </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>
        </div>
        
        <!-- Totales -->
        <div style="background: #f9f9f9; padding: 25px;">
            <div style="max-width: 300px; margin-left: auto;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                    <span>Subtotal:</span><span>${params.subtotal}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                    <span>IVA Trasladado (16%):</span><span>${params.iva}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 20px; font-weight: 700; color: #1e293b; border-top: 2px solid #ddd; margin-top: 8px;">
                    <span>Total MXN:</span><span>${params.total}</span>
                </div>
            </div>
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #ccc; font-size: 13px; color: #666;">
                <strong>Forma de Pago:</strong> ${params.formaPago} &nbsp; | &nbsp;
                <strong>Método de Pago:</strong> ${params.metodoPago}
            </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px; text-align: center; font-size: 12px; color: #999; background: #fafafa;">
            <p style="margin: 0;">Este documento es una representación impresa de un CFDI.</p>
            <p style="margin: 5px 0 0;">Verifique la autenticidad en: <a href="https://verificacfdi.facturaelectronica.sat.gob.mx" style="color: #3b82f6;">verificacfdi.sat.gob.mx</a></p>
        </div>
    </div>
</body>
</html>
`;
}
