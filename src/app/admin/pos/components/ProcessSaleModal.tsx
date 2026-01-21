'use client';

import { useState, useEffect } from 'react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    cantidad: number;
    lote?: string;
    vencimiento?: string;
}

interface ProcessSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    subtotal: number;
    descuento: number;
    cliente: string;
    onFinalizeSale: (saleData: SaleData) => void;
}

interface SaleData {
    tipoVenta: 'contado' | 'credito';
    tipoComprobante: 'ticket' | 'boleta' | 'factura';
    metodoPago: string;
    creditConfig?: CreditConfig;
    items: CartItem[];
    subtotal: number;
    descuento: number;
    iva: number;
    total: number;
    cliente: string;
    folio: string;
    fecha: Date;
}

interface CreditConfig {
    cuotas: number;
    interes: number;
    frecuencia: 'semanal' | 'quincenal' | 'mensual';
    primerPago: string;
    aCuenta: number;
    interesCalculado: number;
    saldoFinanciar: number;
}

export default function ProcessSaleModal({
    isOpen,
    onClose,
    cartItems,
    subtotal,
    descuento,
    cliente,
    onFinalizeSale
}: ProcessSaleModalProps) {
    const [tipoVenta, setTipoVenta] = useState<'contado' | 'credito'>('contado');
    const [tipoComprobante, setTipoComprobante] = useState<'ticket' | 'boleta' | 'factura'>('ticket');
    const [metodoPago, setMetodoPago] = useState('efectivo');

    // Credit config
    const [cuotas, setCuotas] = useState(5);
    const [interes, setInteres] = useState(0);
    const [frecuencia, setFrecuencia] = useState<'semanal' | 'quincenal' | 'mensual'>('mensual');
    const [primerPago, setPrimerPago] = useState('');
    const [aCuenta, setACuenta] = useState(0);
    const [interesCalculado, setInteresCalculado] = useState(0);
    const [saldoFinanciar, setSaldoFinanciar] = useState(0);

    const IVA_RATE = 0.16; // 16% IVA México
    const iva = (subtotal - descuento) * IVA_RATE;
    const total = subtotal - descuento + iva;

    useEffect(() => {
        // Set default first payment date
        const today = new Date();
        today.setDate(today.getDate() + 30);
        setPrimerPago(today.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        // Calculate credit
        const baseAmount = total - aCuenta;
        const calculatedInteres = baseAmount * (interes / 100);
        setInteresCalculado(calculatedInteres);
        setSaldoFinanciar(baseAmount + calculatedInteres);
    }, [total, aCuenta, interes]);

    const handleFinalize = () => {
        const folio = `V${Date.now().toString().slice(-8)}`;

        const saleData: SaleData = {
            tipoVenta,
            tipoComprobante,
            metodoPago,
            items: cartItems,
            subtotal,
            descuento,
            iva,
            total,
            cliente,
            folio,
            fecha: new Date(),
            ...(tipoVenta === 'credito' && {
                creditConfig: {
                    cuotas,
                    interes,
                    frecuencia,
                    primerPago,
                    aCuenta,
                    interesCalculado,
                    saldoFinanciar
                }
            })
        };

        onFinalizeSale(saleData);
    };

    if (!isOpen) return null;

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
        maxWidth: '650px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
    };

    const headerStyles: React.CSSProperties = {
        background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '16px 16px 0 0'
    };

    const inputStyles: React.CSSProperties = {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '0.95rem',
        color: '#374151'
    };

    const selectStyles: React.CSSProperties = {
        ...inputStyles,
        cursor: 'pointer',
        background: '#fff'
    };

    const labelStyles: React.CSSProperties = {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#374151',
        marginBottom: '0.5rem'
    };

    return (
        <div style={modalStyles} onClick={onClose}>
            <div style={contentStyles} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={headerStyles}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Procesar Venta</span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            padding: '0.25rem'
                        }}
                    >×</button>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem' }}>
                    {/* Row 1: Tipo de Venta & Tipo de Comprobante */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={labelStyles}>Tipo de Venta</label>
                            <select
                                value={tipoVenta}
                                onChange={e => setTipoVenta(e.target.value as 'contado' | 'credito')}
                                style={selectStyles}
                            >
                                <option value="contado">Contado</option>
                                <option value="credito">Crédito</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyles}>Tipo de Comprobante</label>
                            <select
                                value={tipoComprobante}
                                onChange={e => setTipoComprobante(e.target.value as 'ticket' | 'boleta' | 'factura')}
                                style={selectStyles}
                            >
                                <option value="ticket">Ticket</option>
                                <option value="boleta">Nota de Venta</option>
                                <option value="factura">Factura CFDI</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Método de Pago */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyles}>Método de Pago</label>
                        <select
                            value={metodoPago}
                            onChange={e => setMetodoPago(e.target.value)}
                            style={{ ...selectStyles, maxWidth: '300px' }}
                        >
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                            <option value="transferencia">Transferencia SPEI</option>
                            <option value="oxxo">Oxxo Pay</option>
                        </select>
                    </div>

                    {/* Credit Configuration */}
                    {tipoVenta === 'credito' && (
                        <div style={{
                            background: '#FFFBEB',
                            border: '2px solid #F59E0B',
                            borderRadius: '12px',
                            padding: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1rem',
                                color: '#B45309',
                                fontWeight: 600
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                </svg>
                                Configuración de Crédito
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={labelStyles}>Número de Cuotas</label>
                                    <input
                                        type="number"
                                        value={cuotas}
                                        onChange={e => setCuotas(Number(e.target.value))}
                                        min="1"
                                        style={inputStyles}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyles}>Interés (%)</label>
                                    <input
                                        type="number"
                                        value={interes}
                                        onChange={e => setInteres(Number(e.target.value))}
                                        min="0"
                                        step="0.1"
                                        style={inputStyles}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyles}>Frecuencia de Pago</label>
                                    <select
                                        value={frecuencia}
                                        onChange={e => setFrecuencia(e.target.value as 'semanal' | 'quincenal' | 'mensual')}
                                        style={selectStyles}
                                    >
                                        <option value="semanal">Semanal</option>
                                        <option value="quincenal">Quincenal</option>
                                        <option value="mensual">Mensual</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={labelStyles}>Primera Fecha de Pago</label>
                                    <input
                                        type="date"
                                        value={primerPago}
                                        onChange={e => setPrimerPago(e.target.value)}
                                        style={inputStyles}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyles}>A Cuenta (Inicial)</label>
                                    <input
                                        type="number"
                                        value={aCuenta}
                                        onChange={e => setACuenta(Number(e.target.value))}
                                        min="0"
                                        style={inputStyles}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyles}>Interés Calculado</label>
                                    <input
                                        type="text"
                                        value={`$ ${interesCalculado.toFixed(2)}`}
                                        readOnly
                                        style={{ ...inputStyles, background: '#f3f4f6' }}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyles}>Saldo a Financiar (con interés)</label>
                                    <input
                                        type="text"
                                        value={`$ ${saldoFinanciar.toFixed(2)}`}
                                        readOnly
                                        style={{ ...inputStyles, background: '#f3f4f6' }}
                                    />
                                </div>
                            </div>

                            <button style={{
                                marginTop: '1rem',
                                padding: '0.5rem 1rem',
                                background: '#3B82F6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <line x1="3" y1="9" x2="21" y2="9" />
                                    <line x1="9" y1="21" x2="9" y2="9" />
                                </svg>
                                Calcular Cuotas
                            </button>
                        </div>
                    )}

                    {/* Sale Summary */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.75rem' }}>
                            Resumen de Venta
                        </h4>
                        <div style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb' }}>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>PRODUCTO</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>LOTE</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>VENCE</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>CANT.</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>P. UNIT.</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>SUBT.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map(item => (
                                        <tr key={item.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '0.75rem' }}>
                                                <div style={{ fontWeight: 500 }}>{item.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Unidad</div>
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center', color: '#6b7280' }}>-</td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center', color: '#6b7280' }}>-</td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.cantidad}</td>
                                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>$ {item.price.toFixed(2)}</td>
                                            <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 500 }}>$ {(item.price * item.cantidad).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totals */}
                    <div style={{
                        background: '#f9fafb',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6b7280' }}>Subtotal:</span>
                            <span style={{ fontWeight: 500 }}>$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6b7280' }}>Descuento:</span>
                            <span style={{ fontWeight: 500, color: '#EF4444' }}>$ {descuento.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ color: '#6b7280' }}>IVA (16.00%):</span>
                            <span style={{ fontWeight: 500 }}>$ {iva.toFixed(2)}</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingTop: '0.75rem',
                            borderTop: '2px solid #e5e7eb',
                            fontSize: '1.25rem'
                        }}>
                            <span style={{ fontWeight: 700 }}>Total a Pagar:</span>
                            <span style={{ fontWeight: 700, color: '#3B82F6' }}>$ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#6B7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleFinalize}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#10B981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Finalizar Venta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
