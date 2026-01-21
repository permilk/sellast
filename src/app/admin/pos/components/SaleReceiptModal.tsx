'use client';

import { useRef } from 'react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    cantidad: number;
}

interface SaleData {
    tipoVenta: 'contado' | 'credito';
    tipoComprobante: 'ticket' | 'boleta' | 'factura';
    metodoPago: string;
    items: CartItem[];
    subtotal: number;
    descuento: number;
    iva: number;
    total: number;
    cliente: string;
    folio: string;
    fecha: Date;
}

interface SaleReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    saleData: SaleData | null;
    companyInfo?: {
        name: string;
        rfc: string;
        address: string;
        phone: string;
        logo?: string;
    };
}

export default function SaleReceiptModal({
    isOpen,
    onClose,
    saleData,
    companyInfo = {
        name: 'Mi Empresa',
        rfc: 'XAXX010101000',
        address: 'Av. Principal 123, CDMX',
        phone: '55 1234 5678'
    }
}: SaleReceiptModalProps) {
    const ticketRef = useRef<HTMLDivElement>(null);

    if (!isOpen || !saleData) return null;

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    const getComprobanteLabel = () => {
        switch (saleData.tipoComprobante) {
            case 'factura': return 'FACTURA CFDI';
            case 'boleta': return 'NOTA DE VENTA';
            default: return 'TICKET DE VENTA';
        }
    };

    const handleDownloadPDF = async () => {
        // In production, use html2canvas + jsPDF
        alert('Descargando PDF... (En producción se generará el archivo)');
    };

    const handlePrint = (size: '58mm' | '80mm' | 'A4') => {
        alert(`Imprimiendo en formato ${size}...`);
    };

    const modalStyles: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
    };

    const contentStyles: React.CSSProperties = {
        background: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '420px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
    };

    const headerStyles: React.CSSProperties = {
        background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    return (
        <div style={modalStyles} onClick={onClose}>
            <div style={contentStyles} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={headerStyles}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Comprobante de Venta</span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            cursor: 'pointer'
                        }}
                    >×</button>
                </div>

                {/* Ticket Preview */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', background: '#f9fafb' }}>
                    <div
                        ref={ticketRef}
                        style={{
                            background: 'white',
                            border: '2px dashed #d1d5db',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            maxWidth: '300px',
                            margin: '0 auto'
                        }}
                    >
                        {/* Company Logo & Info */}
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: '#1f2937',
                                borderRadius: '50%',
                                margin: '0 auto 0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{companyInfo.name}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>RFC: {companyInfo.rfc}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>{companyInfo.address}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Tel: {companyInfo.phone}</div>
                        </div>

                        {/* Divider */}
                        <div style={{ borderTop: '1px dashed #d1d5db', margin: '1rem 0' }}></div>

                        {/* Receipt Type & Folio */}
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <div style={{ fontWeight: 700 }}>{getComprobanteLabel()}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{saleData.folio}</div>
                        </div>

                        {/* Divider */}
                        <div style={{ borderTop: '1px dashed #d1d5db', margin: '1rem 0' }}></div>

                        {/* Sale Info */}
                        <div style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
                            <div><strong>Fecha:</strong> {formatDate(saleData.fecha)}</div>
                            <div><strong>Cajero:</strong> Administrador</div>
                            <div><strong>Cliente:</strong> {saleData.cliente === 'general' ? 'Cliente General' : saleData.cliente}</div>
                        </div>

                        {/* Items Table */}
                        <table style={{ width: '100%', fontSize: '0.75rem', marginBottom: '1rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <th style={{ textAlign: 'left', padding: '0.25rem 0' }}>Cant</th>
                                    <th style={{ textAlign: 'left', padding: '0.25rem 0' }}>Descripción</th>
                                    <th style={{ textAlign: 'right', padding: '0.25rem 0' }}>P.U.</th>
                                    <th style={{ textAlign: 'right', padding: '0.25rem 0' }}>Importe</th>
                                </tr>
                            </thead>
                            <tbody>
                                {saleData.items.map(item => (
                                    <tr key={item.id}>
                                        <td style={{ padding: '0.25rem 0' }}>{item.cantidad}</td>
                                        <td style={{ padding: '0.25rem 0' }}>{item.name}</td>
                                        <td style={{ textAlign: 'right', padding: '0.25rem 0' }}>$ {item.price.toFixed(2)}</td>
                                        <td style={{ textAlign: 'right', padding: '0.25rem 0' }}>$ {(item.price * item.cantidad).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Divider */}
                        <div style={{ borderTop: '1px dashed #d1d5db', margin: '1rem 0' }}></div>

                        {/* Totals */}
                        <div style={{ fontSize: '0.8rem', textAlign: 'right' }}>
                            <div style={{ marginBottom: '0.25rem' }}>
                                <span style={{ color: '#6b7280' }}>Op. Gravadas : </span>
                                <span>$ {saleData.subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ marginBottom: '0.25rem' }}>
                                <span style={{ color: '#6b7280' }}>Descuento : </span>
                                <span>$ {saleData.descuento.toFixed(2)}</span>
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <span style={{ color: '#6b7280' }}>IVA : </span>
                                <span>$ {saleData.iva.toFixed(2)}</span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                                Total : $ {saleData.total.toFixed(2)}
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ borderTop: '1px dashed #d1d5db', margin: '1rem 0' }}></div>

                        {/* Thank you message */}
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <div style={{ fontWeight: 500 }}>¡Gracias por su compra!</div>
                        </div>

                        {/* QR Code Placeholder */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: '#f3f4f6',
                                margin: '0 auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #e5e7eb'
                            }}>
                                {/* QR Pattern Simulation */}
                                <svg width="80" height="80" viewBox="0 0 100 100">
                                    <rect x="10" y="10" width="20" height="20" fill="#1f2937" />
                                    <rect x="35" y="10" width="10" height="10" fill="#1f2937" />
                                    <rect x="50" y="10" width="10" height="10" fill="#1f2937" />
                                    <rect x="70" y="10" width="20" height="20" fill="#1f2937" />
                                    <rect x="10" y="35" width="10" height="10" fill="#1f2937" />
                                    <rect x="45" y="35" width="10" height="10" fill="#1f2937" />
                                    <rect x="80" y="35" width="10" height="10" fill="#1f2937" />
                                    <rect x="10" y="50" width="10" height="10" fill="#1f2937" />
                                    <rect x="30" y="50" width="10" height="10" fill="#1f2937" />
                                    <rect x="60" y="50" width="10" height="10" fill="#1f2937" />
                                    <rect x="80" y="50" width="10" height="10" fill="#1f2937" />
                                    <rect x="10" y="70" width="20" height="20" fill="#1f2937" />
                                    <rect x="40" y="70" width="10" height="10" fill="#1f2937" />
                                    <rect x="60" y="70" width="10" height="10" fill="#1f2937" />
                                    <rect x="75" y="75" width="15" height="15" fill="#1f2937" />
                                </svg>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                {saleData.folio}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => handlePrint('58mm')}
                            style={{
                                padding: '0.5rem 0.75rem',
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                color: '#374151'
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 6 2 18 2 18 9" />
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                <rect x="6" y="14" width="12" height="8" />
                            </svg>
                            58mm
                        </button>
                        <button
                            onClick={() => handlePrint('80mm')}
                            style={{
                                padding: '0.5rem 0.75rem',
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                color: '#374151'
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 6 2 18 2 18 9" />
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                <rect x="6" y="14" width="12" height="8" />
                            </svg>
                            80mm
                        </button>
                        <button
                            onClick={() => handlePrint('A4')}
                            style={{
                                padding: '0.5rem 0.75rem',
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                color: '#374151'
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 6 2 18 2 18 9" />
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                <rect x="6" y="14" width="12" height="8" />
                            </svg>
                            A4
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handleDownloadPDF}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#3B82F6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Descargar PDF
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#6B7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
