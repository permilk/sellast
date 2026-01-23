'use client';

// ============================================
// CASH MOVEMENT MODAL - RETIROS/INGRESOS
// ============================================

import { useState } from 'react';

interface CashMovementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: MovementData) => void;
    type: 'retiro' | 'ingreso';
}

export interface MovementData {
    tipo: 'retiro' | 'ingreso';
    monto: number;
    concepto: string;
    referencia: string;
    metodoPago: string;
}

const conceptosRetiro = [
    'Pago a proveedor',
    'Compra de suministros',
    'Pago de servicios',
    'Retiro para depósito bancario',
    'Préstamo/Adelanto',
    'Gastos varios',
    'Otro'
];

const conceptosIngreso = [
    'Fondo inicial',
    'Reposición de caja',
    'Pago de cliente (cuenta)',
    'Devolución de préstamo',
    'Ajuste de diferencia',
    'Otro'
];

export default function CashMovementModal({ isOpen, onClose, onConfirm, type }: CashMovementModalProps) {
    const [monto, setMonto] = useState('');
    const [concepto, setConcepto] = useState('');
    const [conceptoCustom, setConceptoCustom] = useState('');
    const [referencia, setReferencia] = useState('');
    const [metodoPago, setMetodoPago] = useState('Efectivo');

    if (!isOpen) return null;

    const conceptos = type === 'retiro' ? conceptosRetiro : conceptosIngreso;
    const conceptoFinal = concepto === 'Otro' ? conceptoCustom : concepto;

    const handleSubmit = () => {
        if (!monto || parseFloat(monto) <= 0) {
            alert('Ingresa un monto válido');
            return;
        }
        if (!conceptoFinal) {
            alert('Selecciona o ingresa un concepto');
            return;
        }

        onConfirm({
            tipo: type,
            monto: parseFloat(monto),
            concepto: conceptoFinal,
            referencia,
            metodoPago
        });

        // Reset form
        setMonto('');
        setConcepto('');
        setConceptoCustom('');
        setReferencia('');
    };

    const isRetiro = type === 'retiro';
    const headerColor = isRetiro
        ? 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
        : 'linear-gradient(135deg, #10B981 0%, #059669 100%)';

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
                maxWidth: '450px',
                overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{
                    background: headerColor,
                    color: 'white',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {isRetiro ? (
                                <>
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <polyline points="19 12 12 19 5 12" />
                                </>
                            ) : (
                                <>
                                    <line x1="12" y1="19" x2="12" y2="5" />
                                    <polyline points="5 12 12 5 19 12" />
                                </>
                            )}
                        </svg>
                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                            {isRetiro ? 'Retiro de Caja' : 'Ingreso a Caja'}
                        </span>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem' }}>
                    {/* Monto */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                            Monto *
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{
                                padding: '0.75rem 1rem',
                                background: '#f8fafc',
                                border: '1px solid #e5e7eb',
                                borderRight: 'none',
                                borderRadius: '8px 0 0 8px',
                                fontWeight: 600,
                                color: '#6b7280'
                            }}>$</span>
                            <input
                                type="number"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0 8px 8px 0',
                                    fontSize: '1.1rem',
                                    textAlign: 'right'
                                }}
                            />
                        </div>
                    </div>

                    {/* Concepto */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                            Concepto *
                        </label>
                        <select
                            value={concepto}
                            onChange={(e) => setConcepto(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                color: '#374151',
                                background: 'white'
                            }}
                        >
                            <option value="">Selecciona un concepto</option>
                            {conceptos.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        {concepto === 'Otro' && (
                            <input
                                type="text"
                                value={conceptoCustom}
                                onChange={(e) => setConceptoCustom(e.target.value)}
                                placeholder="Especifica el concepto..."
                                style={{
                                    width: '100%',
                                    marginTop: '0.5rem',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                        )}
                    </div>

                    {/* Método de Pago (solo para retiros) */}
                    {isRetiro && (
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                Método
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {['Efectivo', 'Transferencia', 'Tarjeta'].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setMetodoPago(m)}
                                        style={{
                                            flex: 1,
                                            padding: '0.6rem',
                                            border: metodoPago === m ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            background: metodoPago === m ? '#eff6ff' : 'white',
                                            color: metodoPago === m ? '#3b82f6' : '#6b7280',
                                            fontWeight: metodoPago === m ? 600 : 400,
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Referencia */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                            Referencia (opcional)
                        </label>
                        <input
                            type="text"
                            value={referencia}
                            onChange={(e) => setReferencia(e.target.value)}
                            placeholder="Ej: Factura #123, Recibo de luz..."
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                            }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '0.75rem'
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
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: isRetiro ? '#dc2626' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {isRetiro ? 'Registrar Retiro' : 'Registrar Ingreso'}
                    </button>
                </div>
            </div>
        </div>
    );
}
