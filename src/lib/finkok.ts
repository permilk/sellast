// ============================================
// FINKOK PAC INTEGRATION
// ============================================
// Integración con Finkok para timbrado CFDI 4.0
// Documentación: https://wiki.finkok.com/

import { CFDIRequest, CFDIResponse, CancelacionRequest, CancelacionResponse } from './pac';

// URLs de Finkok
const FINKOK_URLS = {
    sandbox: {
        stamp: 'https://demo-facturacion.finkok.com/servicios/soap/stamp.wsdl',
        cancel: 'https://demo-facturacion.finkok.com/servicios/soap/cancel.wsdl',
        utilities: 'https://demo-facturacion.finkok.com/servicios/soap/utilities.wsdl'
    },
    production: {
        stamp: 'https://facturacion.finkok.com/servicios/soap/stamp.wsdl',
        cancel: 'https://facturacion.finkok.com/servicios/soap/cancel.wsdl',
        utilities: 'https://facturacion.finkok.com/servicios/soap/utilities.wsdl'
    }
};

interface FinkokConfig {
    username: string;
    password: string;
    mode: 'sandbox' | 'production';
}

// ============================================
// GENERAR XML CFDI 4.0
// ============================================
export function generateCFDI40XML(request: CFDIRequest): string {
    const conceptosXML = request.conceptos.map(c => {
        let impuestosXML = '';
        if (c.impuestos?.traslados) {
            const trasladosXML = c.impuestos.traslados.map(t =>
                `<cfdi:Traslado Base="${t.base.toFixed(2)}" Impuesto="${t.impuesto}" TipoFactor="${t.tipoFactor}" TasaOCuota="${t.tasaOCuota.toFixed(6)}" Importe="${t.importe.toFixed(2)}"/>`
            ).join('');
            impuestosXML = `<cfdi:Impuestos><cfdi:Traslados>${trasladosXML}</cfdi:Traslados></cfdi:Impuestos>`;
        }

        return `<cfdi:Concepto ClaveProdServ="${c.claveProdServ}" NoIdentificacion="" Cantidad="${c.cantidad}" ClaveUnidad="${c.claveUnidad}" Unidad="Pieza" Descripcion="${escapeXML(c.descripcion)}" ValorUnitario="${c.valorUnitario.toFixed(2)}" Importe="${c.importe.toFixed(2)}" Descuento="0.00" ObjetoImp="${c.objetoImp}">${impuestosXML}</cfdi:Concepto>`;
    }).join('\n');

    // Calculate IVA totals
    const ivaTotal = request.conceptos.reduce((sum, c) => {
        if (c.impuestos?.traslados) {
            return sum + c.impuestos.traslados.reduce((s, t) => s + t.importe, 0);
        }
        return sum;
    }, 0);

    const impuestosComprobante = ivaTotal > 0 ? `
    <cfdi:Impuestos TotalImpuestosTrasladados="${ivaTotal.toFixed(2)}">
        <cfdi:Traslados>
            <cfdi:Traslado Base="${request.subtotal.toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${ivaTotal.toFixed(2)}"/>
        </cfdi:Traslados>
    </cfdi:Impuestos>` : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"
    Version="4.0"
    Serie="${request.serie}"
    Folio="${request.folio}"
    Fecha="${request.fecha}"
    FormaPago="${request.formaPago}"
    NoCertificado=""
    CondicionesDePago="Contado"
    SubTotal="${request.subtotal.toFixed(2)}"
    Descuento="0.00"
    Moneda="${request.moneda}"
    ${request.tipoCambio ? `TipoCambio="${request.tipoCambio}"` : ''}
    Total="${request.total.toFixed(2)}"
    TipoDeComprobante="${request.tipoDeComprobante}"
    Exportacion="${request.exportacion}"
    MetodoPago="${request.metodoPago}"
    LugarExpedicion="${request.emisor.domicilioFiscal}"
    Sello=""
    Certificado="">
    <cfdi:Emisor Rfc="${request.emisor.rfc}" Nombre="${escapeXML(request.emisor.nombre)}" RegimenFiscal="${request.emisor.regimenFiscal}"/>
    <cfdi:Receptor Rfc="${request.receptor.rfc}" Nombre="${escapeXML(request.receptor.nombre)}" DomicilioFiscalReceptor="${request.receptor.domicilioFiscalReceptor}" RegimenFiscalReceptor="${request.receptor.regimenFiscalReceptor}" UsoCFDI="${request.receptor.usoCFDI}"/>
    <cfdi:Conceptos>
        ${conceptosXML}
    </cfdi:Conceptos>
    ${impuestosComprobante}
</cfdi:Comprobante>`;
}

function escapeXML(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// ============================================
// TIMBRAR CON FINKOK
// ============================================
export async function timbrarFinkok(
    request: CFDIRequest,
    config: FinkokConfig
): Promise<CFDIResponse> {
    const urls = FINKOK_URLS[config.mode];
    const xml = generateCFDI40XML(request);

    console.log(`[Finkok ${config.mode}] Timbrado CFDI - Serie: ${request.serie}, Folio: ${request.folio}`);

    // Build SOAP envelope
    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stam="http://facturacion.finkok.com/stamp">
    <soapenv:Header/>
    <soapenv:Body>
        <stam:stamp>
            <stam:xml><![CDATA[${xml}]]></stam:xml>
            <stam:username>${config.username}</stam:username>
            <stam:password>${config.password}</stam:password>
        </stam:stamp>
    </soapenv:Body>
</soapenv:Envelope>`;

    try {
        const response = await fetch(urls.stamp.replace('.wsdl', ''), {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'stamp'
            },
            body: soapEnvelope
        });

        const responseText = await response.text();

        // Parse SOAP response
        const uuidMatch = responseText.match(/<UUID>([^<]+)<\/UUID>/);
        const fechaMatch = responseText.match(/<Fecha>([^<]+)<\/Fecha>/);
        const selloSATMatch = responseText.match(/<SelloSAT>([^<]+)<\/SelloSAT>/);
        const noCertSATMatch = responseText.match(/<NoCertificadoSAT>([^<]+)<\/NoCertificadoSAT>/);
        const xmlTimbradoMatch = responseText.match(/<xml>([^<]*)<\/xml>/);
        const errorMatch = responseText.match(/<CodEstatus>([^<]+)<\/CodEstatus>/);

        if (uuidMatch && uuidMatch[1]) {
            return {
                success: true,
                uuid: uuidMatch[1],
                fechaTimbrado: fechaMatch?.[1] || new Date().toISOString(),
                selloSAT: selloSATMatch?.[1],
                noCertificadoSAT: noCertSATMatch?.[1],
                xmlTimbrado: xmlTimbradoMatch?.[1] ? decodeXMLEntities(xmlTimbradoMatch[1]) : undefined
            };
        } else {
            // Extract error message
            const errorDescMatch = responseText.match(/<message>([^<]+)<\/message>/);
            return {
                success: false,
                error: errorDescMatch?.[1] || errorMatch?.[1] || 'Error desconocido de Finkok',
                codigoError: errorMatch?.[1]
            };
        }
    } catch (error) {
        console.error('[Finkok] Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error de conexión con Finkok'
        };
    }
}

// ============================================
// CANCELAR CON FINKOK
// ============================================
export async function cancelarFinkok(
    request: CancelacionRequest,
    config: FinkokConfig
): Promise<CancelacionResponse> {
    const urls = FINKOK_URLS[config.mode];

    console.log(`[Finkok ${config.mode}] Cancelación CFDI - UUID: ${request.uuid}`);

    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:can="http://facturacion.finkok.com/cancel">
    <soapenv:Header/>
    <soapenv:Body>
        <can:cancel>
            <can:UUIDS>
                <can:uuids>
                    <can:uuid>${request.uuid}</can:uuid>
                </can:uuids>
            </can:UUIDS>
            <can:username>${config.username}</can:username>
            <can:password>${config.password}</can:password>
            <can:taxpayer_id>${request.rfcEmisor}</can:taxpayer_id>
            <can:motivo>${request.motivo}</can:motivo>
            ${request.folioSustitucion ? `<can:folioSustitucion>${request.folioSustitucion}</can:folioSustitucion>` : ''}
        </can:cancel>
    </soapenv:Body>
</soapenv:Envelope>`;

    try {
        const response = await fetch(urls.cancel.replace('.wsdl', ''), {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'cancel'
            },
            body: soapEnvelope
        });

        const responseText = await response.text();

        const statusMatch = responseText.match(/<EstatusUUID>([^<]+)<\/EstatusUUID>/);
        const acuseMatch = responseText.match(/<Acuse>([^<]*)<\/Acuse>/);

        if (statusMatch?.[1] === '201' || statusMatch?.[1] === '202') {
            return {
                success: true,
                acuse: acuseMatch?.[1] ? decodeXMLEntities(acuseMatch[1]) : undefined,
                fechaCancelacion: new Date().toISOString()
            };
        } else {
            return {
                success: false,
                error: `Estatus: ${statusMatch?.[1] || 'Desconocido'}`
            };
        }
    } catch (error) {
        console.error('[Finkok] Error cancelación:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error de conexión con Finkok'
        };
    }
}

// ============================================
// CONSULTAR ESTATUS
// ============================================
export async function consultarEstatusFinkok(
    uuid: string,
    rfcEmisor: string,
    rfcReceptor: string,
    total: number,
    config: FinkokConfig
): Promise<{ success: boolean; estado?: string; esCancelable?: string; error?: string }> {
    const urls = FINKOK_URLS[config.mode];

    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:util="http://facturacion.finkok.com/utilities">
    <soapenv:Header/>
    <soapenv:Body>
        <util:get_sat_status>
            <util:taxpayer_id>${rfcEmisor}</util:taxpayer_id>
            <util:rtaxpayer_id>${rfcReceptor}</util:rtaxpayer_id>
            <util:uuid>${uuid}</util:uuid>
            <util:total>${total.toFixed(2)}</util:total>
            <util:username>${config.username}</util:username>
            <util:password>${config.password}</util:password>
        </util:get_sat_status>
    </soapenv:Body>
</soapenv:Envelope>`;

    try {
        const response = await fetch(urls.utilities.replace('.wsdl', ''), {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'get_sat_status'
            },
            body: soapEnvelope
        });

        const responseText = await response.text();

        const estadoMatch = responseText.match(/<Estado>([^<]+)<\/Estado>/);
        const cancelableMatch = responseText.match(/<EsCancelable>([^<]+)<\/EsCancelable>/);

        return {
            success: true,
            estado: estadoMatch?.[1],
            esCancelable: cancelableMatch?.[1]
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error de conexión'
        };
    }
}

function decodeXMLEntities(str: string): string {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
}

// ============================================
// OBTENER TIMBRES DISPONIBLES
// ============================================
export async function getTimbresDisponibles(config: FinkokConfig): Promise<{ success: boolean; timbres?: number; error?: string }> {
    const urls = FINKOK_URLS[config.mode];

    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:util="http://facturacion.finkok.com/utilities">
    <soapenv:Header/>
    <soapenv:Body>
        <util:client>
            <util:username>${config.username}</util:username>
            <util:password>${config.password}</util:password>
        </util:client>
    </soapenv:Body>
</soapenv:Envelope>`;

    try {
        const response = await fetch(urls.utilities.replace('.wsdl', ''), {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'client'
            },
            body: soapEnvelope
        });

        const responseText = await response.text();
        const timbresMatch = responseText.match(/<credit>([^<]+)<\/credit>/);

        return {
            success: true,
            timbres: timbresMatch ? parseInt(timbresMatch[1]) : 0
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error de conexión'
        };
    }
}
