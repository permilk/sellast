// ============================================
// PAC CFDI SERVICE - Timbrado y Cancelación
// ============================================
// Servicio para integración con PAC (Proveedor Autorizado de Certificación)
// Incluye integración real con Finkok

import { timbrarFinkok, cancelarFinkok, consultarEstatusFinkok, getTimbresDisponibles } from './finkok';

export interface CFDIEmisor {
    rfc: string;
    nombre: string;
    regimenFiscal: string;
    domicilioFiscal: string;
}

export interface CFDIReceptor {
    rfc: string;
    nombre: string;
    usoCFDI: string;
    domicilioFiscalReceptor: string;
    regimenFiscalReceptor: string;
}

export interface CFDIConcepto {
    claveProdServ: string;
    claveUnidad: string;
    cantidad: number;
    descripcion: string;
    valorUnitario: number;
    importe: number;
    objetoImp: string;
    impuestos?: {
        traslados?: { base: number; impuesto: string; tipoFactor: string; tasaOCuota: number; importe: number }[];
    };
}

export interface CFDIRequest {
    version: '4.0';
    serie: string;
    folio: string;
    fecha: string;
    formaPago: string;
    metodoPago: string;
    tipoDeComprobante: 'I' | 'E' | 'T' | 'N' | 'P';
    exportacion: string;
    moneda: string;
    tipoCambio?: number;
    subtotal: number;
    total: number;
    emisor: CFDIEmisor;
    receptor: CFDIReceptor;
    conceptos: CFDIConcepto[];
}

export interface CFDIResponse {
    success: boolean;
    uuid?: string;
    fechaTimbrado?: string;
    selloSAT?: string;
    selloCFD?: string;
    noCertificadoSAT?: string;
    cadenaOriginal?: string;
    xmlTimbrado?: string;
    qrCode?: string;
    error?: string;
    codigoError?: string;
}

export interface CancelacionRequest {
    uuid: string;
    rfcEmisor: string;
    rfcReceptor: string;
    total: number;
    motivo: '01' | '02' | '03' | '04'; // 01=Con errores, 02=No se llevó, 03=Operación nominativa, 04=Operación global
    folioSustitucion?: string;
}

export interface CancelacionResponse {
    success: boolean;
    acuse?: string;
    fechaCancelacion?: string;
    error?: string;
}

// ============================================
// CONFIGURACIÓN DEL PAC
// ============================================
const PAC_CONFIG = {
    mode: process.env.PAC_MODE || 'mock', // 'mock' | 'sandbox' | 'production'
    provider: process.env.PAC_PROVIDER || 'finkok', // 'finkok' | 'sw' | 'fiscalmx'
    username: process.env.PAC_USERNAME || '',
    password: process.env.PAC_PASSWORD || '',
    rfc: process.env.PAC_RFC || '',
};

// ============================================
// TIMBRADO CFDI
// ============================================
export async function timbrarCFDI(request: CFDIRequest): Promise<CFDIResponse> {
    console.log(`[PAC ${PAC_CONFIG.mode}] Timbrado CFDI - Serie: ${request.serie}, Folio: ${request.folio}`);

    // En modo mock, simular respuesta exitosa
    if (PAC_CONFIG.mode === 'mock') {
        const uuid = generateMockUUID();
        const fechaTimbrado = new Date().toISOString();

        return {
            success: true,
            uuid,
            fechaTimbrado,
            selloSAT: generateMockSello(),
            selloCFD: generateMockSello(),
            noCertificadoSAT: '00001000000512345678',
            cadenaOriginal: `||${uuid}|${fechaTimbrado}|${generateMockSello().substring(0, 50)}||`,
            xmlTimbrado: generateMockXML(request, uuid, fechaTimbrado),
            qrCode: `https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=${uuid}`
        };
    }

    // Para sandbox y producción, usar Finkok
    if (PAC_CONFIG.provider === 'finkok') {
        return await timbrarFinkok(request, {
            username: PAC_CONFIG.username,
            password: PAC_CONFIG.password,
            mode: PAC_CONFIG.mode === 'production' ? 'production' : 'sandbox'
        });
    }

    return { success: false, error: 'PAC no configurado' };
}

// ============================================
// CANCELACIÓN CFDI
// ============================================
export async function cancelarCFDI(request: CancelacionRequest): Promise<CancelacionResponse> {
    console.log(`[PAC ${PAC_CONFIG.mode}] Cancelación CFDI - UUID: ${request.uuid}`);

    if (PAC_CONFIG.mode === 'mock') {
        return {
            success: true,
            acuse: generateMockAcuse(),
            fechaCancelacion: new Date().toISOString()
        };
    }

    // Para sandbox y producción, usar Finkok
    if (PAC_CONFIG.provider === 'finkok') {
        return await cancelarFinkok(request, {
            username: PAC_CONFIG.username,
            password: PAC_CONFIG.password,
            mode: PAC_CONFIG.mode === 'production' ? 'production' : 'sandbox'
        });
    }

    return { success: false, error: 'PAC no configurado' };
}

// ============================================
// CONSULTA ESTATUS CFDI
// ============================================
export async function consultarEstatusCFDI(uuid: string, rfcEmisor: string, rfcReceptor: string, total: number): Promise<{
    success: boolean;
    estado?: 'Vigente' | 'Cancelado' | 'No encontrado';
    esCancelable?: 'Cancelable sin aceptación' | 'Cancelable con aceptación' | 'No cancelable';
    error?: string;
}> {
    console.log(`[PAC ${PAC_CONFIG.mode}] Consulta estatus CFDI - UUID: ${uuid}`);

    if (PAC_CONFIG.mode === 'mock') {
        return {
            success: true,
            estado: 'Vigente',
            esCancelable: 'Cancelable sin aceptación'
        };
    }

    // Para sandbox y producción, usar Finkok
    if (PAC_CONFIG.provider === 'finkok') {
        const result = await consultarEstatusFinkok(uuid, rfcEmisor, rfcReceptor, total, {
            username: PAC_CONFIG.username,
            password: PAC_CONFIG.password,
            mode: PAC_CONFIG.mode === 'production' ? 'production' : 'sandbox'
        });
        return result as { success: boolean; estado?: 'Vigente' | 'Cancelado' | 'No encontrado'; esCancelable?: 'Cancelable sin aceptación' | 'Cancelable con aceptación' | 'No cancelable'; error?: string };
    }

    return { success: false, error: 'PAC no configurado' };
}

// ============================================
// HELPER FUNCTIONS (Mock)
// ============================================
function generateMockUUID(): string {
    const chars = 'ABCDEF0123456789';
    const sections = [8, 4, 4, 4, 12];
    return sections.map(len =>
        Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    ).join('-');
}

function generateMockSello(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    return Array.from({ length: 344 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateMockAcuse(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Acuse xmlns="http://cancelacfd.sat.gob.mx" Fecha="${new Date().toISOString()}" RfcEmisor="${PAC_CONFIG.rfc || 'XAXX010101000'}">
    <Folios>
        <UUID>${generateMockUUID()}</UUID>
        <EstatusUUID>201</EstatusUUID>
    </Folios>
</Acuse>`;
}

function generateMockXML(request: CFDIRequest, uuid: string, fechaTimbrado: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    Version="4.0" Serie="${request.serie}" Folio="${request.folio}" Fecha="${request.fecha}"
    FormaPago="${request.formaPago}" MetodoPago="${request.metodoPago}" TipoDeComprobante="${request.tipoDeComprobante}"
    Moneda="${request.moneda}" SubTotal="${request.subtotal.toFixed(2)}" Total="${request.total.toFixed(2)}">
    <cfdi:Emisor Rfc="${request.emisor.rfc}" Nombre="${request.emisor.nombre}" RegimenFiscal="${request.emisor.regimenFiscal}"/>
    <cfdi:Receptor Rfc="${request.receptor.rfc}" Nombre="${request.receptor.nombre}" UsoCFDI="${request.receptor.usoCFDI}" 
        DomicilioFiscalReceptor="${request.receptor.domicilioFiscalReceptor}" RegimenFiscalReceptor="${request.receptor.regimenFiscalReceptor}"/>
    <cfdi:Conceptos>
        ${request.conceptos.map(c => `
        <cfdi:Concepto ClaveProdServ="${c.claveProdServ}" ClaveUnidad="${c.claveUnidad}" 
            Cantidad="${c.cantidad}" Descripcion="${c.descripcion}" 
            ValorUnitario="${c.valorUnitario.toFixed(2)}" Importe="${c.importe.toFixed(2)}" ObjetoImp="${c.objetoImp}"/>
        `).join('')}
    </cfdi:Conceptos>
    <cfdi:Complemento>
        <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1"
            UUID="${uuid}" FechaTimbrado="${fechaTimbrado}" SelloCFD="${generateMockSello().substring(0, 100)}..."
            NoCertificadoSAT="00001000000512345678" SelloSAT="${generateMockSello().substring(0, 100)}..."/>
    </cfdi:Complemento>
</cfdi:Comprobante>`;
}

// ============================================
// CATÁLOGOS SAT (Común)
// ============================================
export const FORMAS_PAGO = [
    { clave: '01', descripcion: 'Efectivo' },
    { clave: '02', descripcion: 'Cheque nominativo' },
    { clave: '03', descripcion: 'Transferencia electrónica de fondos' },
    { clave: '04', descripcion: 'Tarjeta de crédito' },
    { clave: '28', descripcion: 'Tarjeta de débito' },
    { clave: '99', descripcion: 'Por definir' }
];

export const METODOS_PAGO = [
    { clave: 'PUE', descripcion: 'Pago en una sola exhibición' },
    { clave: 'PPD', descripcion: 'Pago en parcialidades o diferido' }
];

export const USOS_CFDI = [
    { clave: 'G01', descripcion: 'Adquisición de mercancías' },
    { clave: 'G02', descripcion: 'Devoluciones, descuentos o bonificaciones' },
    { clave: 'G03', descripcion: 'Gastos en general' },
    { clave: 'I01', descripcion: 'Construcciones' },
    { clave: 'I02', descripcion: 'Mobiliario y equipo de oficina' },
    { clave: 'I03', descripcion: 'Equipo de transporte' },
    { clave: 'I04', descripcion: 'Equipo de cómputo' },
    { clave: 'I08', descripcion: 'Otra maquinaria y equipo' },
    { clave: 'S01', descripcion: 'Sin efectos fiscales' }
];

export const REGIMENES_FISCALES = [
    { clave: '601', descripcion: 'General de Ley Personas Morales' },
    { clave: '603', descripcion: 'Personas Morales con Fines no Lucrativos' },
    { clave: '605', descripcion: 'Sueldos y Salarios' },
    { clave: '606', descripcion: 'Arrendamiento' },
    { clave: '607', descripcion: 'Régimen de Enajenación' },
    { clave: '608', descripcion: 'Demás ingresos' },
    { clave: '610', descripcion: 'Residentes en el Extranjero' },
    { clave: '612', descripcion: 'Personas Físicas con Actividades Empresariales' },
    { clave: '616', descripcion: 'Sin obligaciones fiscales' },
    { clave: '620', descripcion: 'Sociedades Cooperativas de Producción' },
    { clave: '621', descripcion: 'Incorporación Fiscal' },
    { clave: '625', descripcion: 'Régimen de las Actividades Agrícolas' },
    { clave: '626', descripcion: 'Régimen Simplificado de Confianza' }
];
