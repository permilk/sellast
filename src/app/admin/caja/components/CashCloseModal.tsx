'use client';

// ============================================
// CASH CLOSE MODAL - CIERRE DE CAJA
// ============================================

import { useState } from 'react';

interface CashCloseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: CierreData) => void;
    cajaData: {
        saldoInicial: number;
        ingresos: number;
        egresos: number;
        efectivoEsperado: number;
        ventasEfectivo: number;
        ventasTarjeta: number;
        ventasTransferencia: number;
    };
}

export interface CierreData {
    efectivoContado: number;
    diferencia: number;
    observaciones: string;
    desglose: {
        billetes1000: number;
        billetes500: number;
        billetes200: number;
        billetes100: number;
        billetes50: number;
        billetes20: number;
        monedas20: number;
        monedas10: number;
        monedas5: number;
        monedas2: number;
        monedas1: number;
        monedas50c: number;
    };
}

export default function CashCloseModal({ isOpen, onClose, onConfirm, cajaData }: CashCloseModalProps) {
    const [efectivoContado, setEfectivoContado] = useState(0);
    const [observaciones, setObservaciones] = useState('');
    const [showDesglose, setShowDesglose] = useState(false);

    const [desglose, setDesglose] = useState({
        billetes1000: 0,
        billetes500: 0,
        billetes200: 0,
        billetes100: 0,
        billetes50: 0,
        billetes20: 0,
        monedas20: 0,
        monedas10: 0,
        monedas5: 0,
        monedas2: 0,
        monedas1: 0,
        monedas50c: 0,
    });

    if (!isOpen) return null;

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Por favor permite ventanas emergentes para imprimir');
            return;
        }

        const now = new Date();
        const dateStr = new Intl.DateTimeFormat('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(now);

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Cierre de Caja - ${dateStr}</title>
                <style>
                    @page { 
                        size: A4; 
                        margin: 15mm; 
                    }
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body { 
                        font-family: 'Segoe UI', Arial, sans-serif;
                        color: #1f2937;
                        line-height: 1.5;
                        padding: 20px;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        border-bottom: 2px solid #e5e7eb;
                        padding-bottom: 15px;
                        margin-bottom: 20px;
                    }
                    .header-left h1 {
                        font-size: 24px;
                        font-weight: 700;
                        color: #dc2626;
                    }
                    .header-left p {
                        font-size: 12px;
                        color: #6b7280;
                    }
                    .header-right {
                        text-align: right;
                        font-size: 12px;
                        color: #6b7280;
                    }
                    .section {
                        margin-bottom: 20px;
                        background: #f8fafc;
                        border-radius: 8px;
                        padding: 15px;
                    }
                    .section h3 {
                        font-size: 14px;
                        font-weight: 600;
                        color: #374151;
                        margin-bottom: 12px;
                        border-bottom: 1px solid #e5e7eb;
                        padding-bottom: 8px;
                    }
                    .row {
                        display: flex;
                        justify-content: space-between;
                        padding: 6px 0;
                        font-size: 13px;
                    }
                    .row-label { color: #6b7280; }
                    .row-value { font-weight: 600; }
                    .row-green { color: #10b981; }
                    .row-red { color: #dc2626; }
                    .row-total {
                        border-top: 1px solid #e5e7eb;
                        padding-top: 10px;
                        margin-top: 5px;
                        font-weight: 700;
                    }
                    .payment-methods {
                        display: flex;
                        gap: 20px;
                    }
                    .payment-method {
                        flex: 1;
                        text-align: center;
                        padding: 10px;
                        background: white;
                        border-radius: 6px;
                        border: 1px solid #e5e7eb;
                    }
                    .payment-method .label {
                        font-size: 11px;
                        color: #6b7280;
                    }
                    .payment-method .amount {
                        font-size: 16px;
                        font-weight: 700;
                        color: #1f2937;
                    }
                    .difference-box {
                        text-align: center;
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                    .difference-ok { background: #dcfce7; }
                    .difference-over { background: #fef3c7; }
                    .difference-under { background: #fee2e2; }
                    .difference-label {
                        font-size: 12px;
                        color: #6b7280;
                    }
                    .difference-amount {
                        font-size: 24px;
                        font-weight: 700;
                    }
                    .difference-status {
                        font-size: 12px;
                        margin-top: 5px;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 15px;
                        border-top: 1px solid #e5e7eb;
                        display: flex;
                        justify-content: space-between;
                    }
                    .signature-line {
                        width: 200px;
                        text-align: center;
                    }
                    .signature-line hr {
                        border: none;
                        border-top: 1px solid #374151;
                        margin-bottom: 5px;
                    }
                    .signature-line span {
                        font-size: 11px;
                        color: #6b7280;
                    }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="header-left">
                        <h1>Cierre de Caja</h1>
                        <p>Sellast | Sistema POS Empresarial</p>
                    </div>
                    <div class="header-right">
                        <div>${dateStr}</div>
                    </div>
                </div>

                <div class="section">
                    <h3>Resumen del Turno</h3>
                    <div class="row">
                        <span class="row-label">Saldo Inicial:</span>
                        <span class="row-value">${formatCurrency(cajaData.saldoInicial)}</span>
                    </div>
                    <div class="row">
                        <span class="row-label row-green">+ Ingresos:</span>
                        <span class="row-value row-green">${formatCurrency(cajaData.ingresos)}</span>
                    </div>
                    <div class="row">
                        <span class="row-label row-red">- Egresos:</span>
                        <span class="row-value row-red">${formatCurrency(cajaData.egresos)}</span>
                    </div>
                    <div class="row row-total">
                        <span>Efectivo Esperado:</span>
                        <span>${formatCurrency(cajaData.efectivoEsperado)}</span>
                    </div>
                </div>

                <div class="section">
                    <h3>Ventas por Método de Pago</h3>
                    <div class="payment-methods">
                        <div class="payment-method">
                            <div class="label">Efectivo</div>
                            <div class="amount">${formatCurrency(cajaData.ventasEfectivo)}</div>
                        </div>
                        <div class="payment-method">
                            <div class="label">Tarjeta</div>
                            <div class="amount">${formatCurrency(cajaData.ventasTarjeta)}</div>
                        </div>
                        <div class="payment-method">
                            <div class="label">Transferencia</div>
                            <div class="amount">${formatCurrency(cajaData.ventasTransferencia)}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>Arqueo de Caja</h3>
                    <div class="row">
                        <span class="row-label">Efectivo Contado:</span>
                        <span class="row-value">${formatCurrency(efectivoContado)}</span>
                    </div>
                    <div class="row">
                        <span class="row-label">Efectivo Esperado:</span>
                        <span class="row-value">${formatCurrency(cajaData.efectivoEsperado)}</span>
                    </div>
                </div>

                <div class="difference-box ${diferencia === 0 ? 'difference-ok' : diferencia > 0 ? 'difference-over' : 'difference-under'}">
                    <div class="difference-label">Diferencia</div>
                    <div class="difference-amount" style="color: ${diferencia === 0 ? '#10b981' : diferencia > 0 ? '#d97706' : '#dc2626'}">
                        ${diferencia > 0 ? '+' : ''}${formatCurrency(diferencia)}
                    </div>
                    <div class="difference-status">
                        ${diferencia === 0 ? '✓ Cuadre perfecto' : diferencia > 0 ? 'Sobrante' : 'Faltante'}
                    </div>
                </div>

                ${observaciones ? `
                <div class="section">
                    <h3>Observaciones</h3>
                    <p style="font-size: 13px;">${observaciones}</p>
                </div>
                ` : ''}

                <div class="footer">
                    <div class="signature-line">
                        <hr />
                        <span>Cajero Responsable</span>
                    </div>
                    <div class="signature-line">
                        <hr />
                        <span>Supervisor</span>
                    </div>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const calcularDesdeDesglose = () => {
        const total =
            desglose.billetes1000 * 1000 +
            desglose.billetes500 * 500 +
            desglose.billetes200 * 200 +
            desglose.billetes100 * 100 +
            desglose.billetes50 * 50 +
            desglose.billetes20 * 20 +
            desglose.monedas20 * 20 +
            desglose.monedas10 * 10 +
            desglose.monedas5 * 5 +
            desglose.monedas2 * 2 +
            desglose.monedas1 * 1 +
            desglose.monedas50c * 0.5;
        setEfectivoContado(total);
    };

    const diferencia = efectivoContado - cajaData.efectivoEsperado;

    const handleSubmit = () => {
        onConfirm({
            efectivoContado,
            diferencia,
            observaciones,
            desglose
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    return (
        <div style={{
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
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                    color: 'white',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Cierre de Caja</span>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {/* Resumen del Turno */}
                    <div style={{
                        background: '#f8fafc',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>
                            Resumen del Turno
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6b7280' }}>Saldo Inicial:</span>
                                <span style={{ fontWeight: 600 }}>{formatCurrency(cajaData.saldoInicial)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#10b981' }}>+ Ingresos:</span>
                                <span style={{ fontWeight: 600, color: '#10b981' }}>{formatCurrency(cajaData.ingresos)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#ef4444' }}>- Egresos:</span>
                                <span style={{ fontWeight: 600, color: '#ef4444' }}>{formatCurrency(cajaData.egresos)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem' }}>
                                <span style={{ fontWeight: 600 }}>Efectivo Esperado:</span>
                                <span style={{ fontWeight: 700, color: '#1f2937' }}>{formatCurrency(cajaData.efectivoEsperado)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ventas por Método */}
                    <div style={{
                        background: '#f0fdf4',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
                            Ventas por Método de Pago
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Efectivo</div>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(cajaData.ventasEfectivo)}</div>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Tarjeta</div>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(cajaData.ventasTarjeta)}</div>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Transferencia</div>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(cajaData.ventasTransferencia)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Arqueo de Caja */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <label style={{ fontWeight: 600, color: '#374151' }}>Efectivo Contado</label>
                            <button
                                onClick={() => setShowDesglose(!showDesglose)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#3b82f6',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                {showDesglose ? 'Ocultar desglose' : 'Desglosar billetes/monedas'}
                            </button>
                        </div>

                        {showDesglose ? (
                            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                    {[
                                        { key: 'billetes1000', label: '$1000', value: 1000 },
                                        { key: 'billetes500', label: '$500', value: 500 },
                                        { key: 'billetes200', label: '$200', value: 200 },
                                        { key: 'billetes100', label: '$100', value: 100 },
                                        { key: 'billetes50', label: '$50', value: 50 },
                                        { key: 'billetes20', label: '$20', value: 20 },
                                        { key: 'monedas20', label: '$20 (M)', value: 20 },
                                        { key: 'monedas10', label: '$10', value: 10 },
                                        { key: 'monedas5', label: '$5', value: 5 },
                                        { key: 'monedas2', label: '$2', value: 2 },
                                        { key: 'monedas1', label: '$1', value: 1 },
                                        { key: 'monedas50c', label: '$0.50', value: 0.5 },
                                    ].map((item) => (
                                        <div key={item.key}>
                                            <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.label}</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={desglose[item.key as keyof typeof desglose]}
                                                onChange={(e) => {
                                                    setDesglose({ ...desglose, [item.key]: parseInt(e.target.value) || 0 });
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '6px',
                                                    textAlign: 'center'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={calcularDesdeDesglose}
                                    style={{
                                        marginTop: '1rem',
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Calcular Total
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e5e7eb', borderRight: 'none', borderRadius: '8px 0 0 8px', fontWeight: 600 }}>$</span>
                                <input
                                    type="number"
                                    value={efectivoContado}
                                    onChange={(e) => setEfectivoContado(parseFloat(e.target.value) || 0)}
                                    step="0.01"
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem 1rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0 8px 8px 0',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        textAlign: 'right'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Diferencia */}
                    <div style={{
                        background: diferencia === 0 ? '#f0fdf4' : diferencia > 0 ? '#fef3c7' : '#fee2e2',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Diferencia</div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: diferencia === 0 ? '#10b981' : diferencia > 0 ? '#d97706' : '#dc2626'
                        }}>
                            {diferencia > 0 ? '+' : ''}{formatCurrency(diferencia)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                            {diferencia === 0 ? '✓ Cuadre perfecto' : diferencia > 0 ? 'Sobrante' : 'Faltante'}
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                            Observaciones {diferencia !== 0 && <span style={{ color: '#dc2626' }}>*</span>}
                        </label>
                        <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Notas sobre el cierre de caja..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                resize: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        Cancelar
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handlePrint}
                            style={{
                                padding: '0.75rem 1rem',
                                background: '#f8fafc',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 6 2 18 2 18 9" />
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                <rect x="6" y="14" width="12" height="8" />
                            </svg>
                            Imprimir Corte
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={diferencia !== 0 && !observaciones.trim()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: diferencia !== 0 && !observaciones.trim() ? '#cbd5e1' : '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: diferencia !== 0 && !observaciones.trim() ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                            Cerrar Caja
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
