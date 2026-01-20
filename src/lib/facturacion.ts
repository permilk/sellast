// ============================================
// SERVICIO DE FACTURACIÓN - CFDI 4.0
// ============================================

import prisma from '@/lib/prisma';

// Configuración del PAC (placeholder - configurar según tu PAC)
const PAC_CONFIG = {
    // Finkok
    FINKOK_USER: process.env.FINKOK_USER || '',
    FINKOK_PASSWORD: process.env.FINKOK_PASSWORD || '',
    FINKOK_URL: process.env.NODE_ENV === 'production'
        ? 'https://facturacion.finkok.com'
        : 'https://demo-facturacion.finkok.com',

    // Datos del emisor (tu empresa)
    RFC_EMISOR: process.env.RFC_EMISOR || 'EKU9003173C9', // RFC de pruebas SAT
    RAZON_SOCIAL_EMISOR: process.env.RAZON_SOCIAL_EMISOR || 'SELLAST SA DE CV',
    REGIMEN_FISCAL_EMISOR: process.env.REGIMEN_FISCAL_EMISOR || '601',
    CP_EMISOR: process.env.CP_EMISOR || '06600',
};

export interface DatosFactura {
    orderId: string;
    rfc: string;
    razonSocial: string;
    regimenFiscal: string;
    usoCfdi: string;
    codigoPostal: string;
    email: string;
}

export interface ConceptoCFDI {
    claveProdServ: string; // Clave SAT
    claveUnidad: string; // Ej: H87 (pieza)
    cantidad: number;
    descripcion: string;
    valorUnitario: number;
    importe: number;
}

export interface ResultadoFactura {
    success: boolean;
    uuid?: string;
    xmlUrl?: string;
    pdfUrl?: string;
    error?: string;
}

// Validar formato de RFC
export function validarRFC(rfc: string): { valido: boolean; tipo: 'fisica' | 'moral' | null } {
    // RFC Persona Física: 13 caracteres
    const rfcFisica = /^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/i;
    // RFC Persona Moral: 12 caracteres
    const rfcMoral = /^[A-ZÑ&]{3}[0-9]{6}[A-Z0-9]{3}$/i;

    const rfcUpper = rfc.toUpperCase().trim();

    if (rfcFisica.test(rfcUpper)) {
        return { valido: true, tipo: 'fisica' };
    }
    if (rfcMoral.test(rfcUpper)) {
        return { valido: true, tipo: 'moral' };
    }

    return { valido: false, tipo: null };
}

// Generar estructura CFDI 4.0
export function generarCFDI(orden: {
    orderNumber: string;
    items: Array<{
        name: string;
        sku: string;
        price: number;
        quantity: number;
    }>;
    subtotal: number;
    discount: number;
    shippingCost: number;
    total: number;
}, datosReceptor: DatosFactura): string {
    const fecha = new Date().toISOString().split('.')[0];

    // Construir XML CFDI 4.0
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante 
    xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"
    Version="4.0"
    Serie="A"
    Folio="${orden.orderNumber}"
    Fecha="${fecha}"
    FormaPago="99"
    SubTotal="${orden.subtotal.toFixed(2)}"
    Descuento="${orden.discount.toFixed(2)}"
    Moneda="MXN"
    Total="${orden.total.toFixed(2)}"
    TipoDeComprobante="I"
    Exportacion="01"
    MetodoPago="PUE"
    LugarExpedicion="${PAC_CONFIG.CP_EMISOR}">
    
    <cfdi:Emisor 
        Rfc="${PAC_CONFIG.RFC_EMISOR}"
        Nombre="${PAC_CONFIG.RAZON_SOCIAL_EMISOR}"
        RegimenFiscal="${PAC_CONFIG.REGIMEN_FISCAL_EMISOR}" />
    
    <cfdi:Receptor 
        Rfc="${datosReceptor.rfc}"
        Nombre="${datosReceptor.razonSocial}"
        DomicilioFiscalReceptor="${datosReceptor.codigoPostal}"
        RegimenFiscalReceptor="${datosReceptor.regimenFiscal}"
        UsoCFDI="${datosReceptor.usoCfdi}" />
    
    <cfdi:Conceptos>
        ${orden.items.map(item => `
        <cfdi:Concepto 
            ClaveProdServ="01010101"
            ClaveUnidad="H87"
            Cantidad="${item.quantity}"
            Descripcion="${item.name}"
            ValorUnitario="${item.price.toFixed(2)}"
            Importe="${(item.price * item.quantity).toFixed(2)}"
            ObjetoImp="02">
            <cfdi:Impuestos>
                <cfdi:Traslados>
                    <cfdi:Traslado 
                        Base="${(item.price * item.quantity).toFixed(2)}"
                        Impuesto="002"
                        TipoFactor="Tasa"
                        TasaOCuota="0.160000"
                        Importe="${(item.price * item.quantity * 0.16).toFixed(2)}" />
                </cfdi:Traslados>
            </cfdi:Impuestos>
        </cfdi:Concepto>`).join('')}
        ${orden.shippingCost > 0 ? `
        <cfdi:Concepto 
            ClaveProdServ="78101800"
            ClaveUnidad="E48"
            Cantidad="1"
            Descripcion="Servicio de Envío"
            ValorUnitario="${orden.shippingCost.toFixed(2)}"
            Importe="${orden.shippingCost.toFixed(2)}"
            ObjetoImp="02">
            <cfdi:Impuestos>
                <cfdi:Traslados>
                    <cfdi:Traslado 
                        Base="${orden.shippingCost.toFixed(2)}"
                        Impuesto="002"
                        TipoFactor="Tasa"
                        TasaOCuota="0.160000"
                        Importe="${(orden.shippingCost * 0.16).toFixed(2)}" />
                </cfdi:Traslados>
            </cfdi:Impuestos>
        </cfdi:Concepto>` : ''}
    </cfdi:Conceptos>
</cfdi:Comprobante>`;

    return xml;
}

// Timbrar CFDI con el PAC
export async function timbrarCFDI(xml: string): Promise<ResultadoFactura> {
    try {
        // TODO: Implementar llamada real al PAC
        // Este es un placeholder - debes implementar según tu PAC (Finkok, Facturama, etc.)

        console.log('Timbrando CFDI con PAC...', PAC_CONFIG.FINKOK_URL);

        // Simulación para desarrollo
        if (process.env.NODE_ENV !== 'production') {
            const mockUuid = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            return {
                success: true,
                uuid: mockUuid,
                xmlUrl: `/facturas/${mockUuid}.xml`,
                pdfUrl: `/facturas/${mockUuid}.pdf`,
            };
        }

        // Aquí iría la llamada real al PAC
        // Ejemplo con Finkok:
        // const response = await fetch(`${PAC_CONFIG.FINKOK_URL}/servicios/soap/stamp.wsdl`, {
        //     method: 'POST',
        //     body: xml,
        // });

        throw new Error('PAC no configurado para producción');

    } catch (error) {
        console.error('Error timbrando CFDI:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        };
    }
}

// Crear factura completa para un pedido
export async function crearFactura(orderId: string, datosFactura: DatosFactura): Promise<ResultadoFactura> {
    try {
        // Obtener orden con items
        const orden = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: true,
                user: true,
            },
        });

        if (!orden) {
            return { success: false, error: 'Orden no encontrada' };
        }

        // Validar RFC
        const rfcValidacion = validarRFC(datosFactura.rfc);
        if (!rfcValidacion.valido) {
            return { success: false, error: 'RFC inválido' };
        }

        // Buscar o crear perfil de facturación
        let invoiceProfile = await prisma.invoiceProfile.findUnique({
            where: { rfc: datosFactura.rfc },
        });

        if (!invoiceProfile) {
            invoiceProfile = await prisma.invoiceProfile.create({
                data: {
                    userId: orden.userId,
                    rfc: datosFactura.rfc,
                    razonSocial: datosFactura.razonSocial,
                    regimenFiscal: datosFactura.regimenFiscal,
                    usoCfdi: datosFactura.usoCfdi,
                    codigoPostal: datosFactura.codigoPostal,
                    email: datosFactura.email,
                },
            });
        }

        // Generar CFDI
        const xml = generarCFDI({
            orderNumber: orden.orderNumber,
            items: orden.items.map(item => ({
                name: item.name,
                sku: item.sku,
                price: Number(item.price),
                quantity: item.quantity,
            })),
            subtotal: Number(orden.subtotal),
            discount: Number(orden.discount),
            shippingCost: Number(orden.shippingCost),
            total: Number(orden.total),
        }, datosFactura);

        // Timbrar con PAC
        const resultado = await timbrarCFDI(xml);

        if (!resultado.success) {
            return resultado;
        }

        // Generar número de factura
        const lastInvoice = await prisma.invoice.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        const invoiceCount = lastInvoice
            ? parseInt(lastInvoice.invoiceNumber.split('-')[1]) + 1
            : 1;
        const invoiceNumber = `A-${String(invoiceCount).padStart(6, '0')}`;

        // Guardar factura en BD
        await prisma.invoice.create({
            data: {
                invoiceNumber,
                orderId,
                invoiceProfileId: invoiceProfile.id,
                uuid: resultado.uuid,
                xmlUrl: resultado.xmlUrl,
                pdfUrl: resultado.pdfUrl,
                status: 'stamped',
                stampedAt: new Date(),
            },
        });

        return resultado;

    } catch (error) {
        console.error('Error creando factura:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
        };
    }
}

// Catálogo de Usos CFDI
export const USOS_CFDI = [
    { clave: 'G01', descripcion: 'Adquisición de mercancías' },
    { clave: 'G02', descripcion: 'Devoluciones, descuentos o bonificaciones' },
    { clave: 'G03', descripcion: 'Gastos en general' },
    { clave: 'I01', descripcion: 'Construcciones' },
    { clave: 'I02', descripcion: 'Mobiliario y equipo de oficina' },
    { clave: 'I03', descripcion: 'Equipo de transporte' },
    { clave: 'I04', descripcion: 'Equipo de computo' },
    { clave: 'D01', descripcion: 'Honorarios médicos' },
    { clave: 'D02', descripcion: 'Gastos médicos' },
    { clave: 'D03', descripcion: 'Gastos funerales' },
    { clave: 'D04', descripcion: 'Donativos' },
    { clave: 'P01', descripcion: 'Por definir' },
    { clave: 'S01', descripcion: 'Sin efectos fiscales' },
    { clave: 'CP01', descripcion: 'Pagos' },
];

// Catálogo de Regímenes Fiscales
export const REGIMENES_FISCALES = [
    { clave: '601', descripcion: 'General de Ley Personas Morales' },
    { clave: '603', descripcion: 'Personas Morales con Fines no Lucrativos' },
    { clave: '605', descripcion: 'Sueldos y Salarios' },
    { clave: '606', descripcion: 'Arrendamiento' },
    { clave: '607', descripcion: 'Régimen de Enajenación o Adquisición de Bienes' },
    { clave: '608', descripcion: 'Demás ingresos' },
    { clave: '610', descripcion: 'Residentes en el Extranjero sin EP' },
    { clave: '611', descripcion: 'Ingresos por Dividendos' },
    { clave: '612', descripcion: 'Personas Físicas con Actividades Empresariales' },
    { clave: '614', descripcion: 'Ingresos por intereses' },
    { clave: '615', descripcion: 'Régimen de los ingresos por obtención de premios' },
    { clave: '616', descripcion: 'Sin obligaciones fiscales' },
    { clave: '620', descripcion: 'Sociedades Cooperativas de Producción' },
    { clave: '621', descripcion: 'Incorporación Fiscal' },
    { clave: '622', descripcion: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
    { clave: '623', descripcion: 'Opcional para Grupos de Sociedades' },
    { clave: '624', descripcion: 'Coordinados' },
    { clave: '625', descripcion: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas' },
    { clave: '626', descripcion: 'Régimen Simplificado de Confianza' },
];
