'use client';

import { useState } from 'react';
import { exportToExcel } from '@/utils/exportExcel';
import { KPISummary } from '@/components/admin/KPISummary';

export default function FinanzasPage() {
    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#1f2937',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                            <line x1="12" y1="20" x2="12" y2="10" />
                            <line x1="18" y1="20" x2="18" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="16" />
                        </svg>
                        Finanzas
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Reportes financieros y análisis de ventas
                    </p>
                </div>
                <button
                    onClick={() => exportToExcel(
                        [
                            { Concepto: 'Ventas Hoy', Monto: '$12,450.00' },
                            { Concepto: 'Gastos Hoy', Monto: '$3,200.00' },
                            { Concepto: 'Utilidad Neta', Monto: '$9,250.00' }
                        ],
                        'Reporte_Financiero_Sellast',
                        'Finanzas'
                    )}
                    style={{
                        padding: '0.75rem 1rem',
                        background: 'white',
                        color: '#374151',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Exportar
                </button>
            </div>

            {/* KPI Summary */}
            <KPISummary cards={[
                { label: 'Ingresos (Mes)', value: '45,231.80', color: 'green', prefix: '$ ' },
                { label: 'Pedidos Completados', value: 142, color: 'blue' },
                { label: 'Ticket Promedio', value: '318.50', color: 'purple', prefix: '$ ' },
                { label: 'Gastos (Mes)', value: '12,450.00', color: 'red', prefix: '$ ' }
            ]} />

            {/* Annual Sales Chart */}
            {(() => {
                const ventasMensuales = [
                    { mes: 'Ene', monto: 32500 },
                    { mes: 'Feb', monto: 28400 },
                    { mes: 'Mar', monto: 35600 },
                    { mes: 'Abr', monto: 42100 },
                    { mes: 'May', monto: 38700 },
                    { mes: 'Jun', monto: 45200 },
                    { mes: 'Jul', monto: 52800 },
                    { mes: 'Ago', monto: 48900 },
                    { mes: 'Sep', monto: 41300 },
                    { mes: 'Oct', monto: 44600 },
                    { mes: 'Nov', monto: 51200 },
                    { mes: 'Dic', monto: 58400 }
                ];
                const maxVenta = Math.max(...ventasMensuales.map(v => v.monto));
                const totalAnual = ventasMensuales.reduce((acc, v) => acc + v.monto, 0);

                return (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', color: '#1f2937', fontWeight: 600 }}>Resumen de Ventas Anual 2026</h3>
                            <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Total: <strong style={{ color: '#10B981' }}>${totalAnual.toLocaleString()}</strong></span>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: '0.5rem',
                            height: '200px',
                            padding: '1rem 0',
                            borderBottom: '2px solid #E5E7EB'
                        }}>
                            {ventasMensuales.map((item, index) => {
                                const height = (item.monto / maxVenta) * 160;
                                return (
                                    <div
                                        key={item.mes}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                maxWidth: '40px',
                                                background: `linear-gradient(180deg, #7C3AED 0%, #A78BFA 100%)`,
                                                borderRadius: '4px 4px 0 0',
                                                height: `${height}px`,
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}
                                            title={`${item.mes}: $${item.monto.toLocaleString()}`}
                                            onMouseEnter={(e) => {
                                                (e.target as HTMLElement).style.transform = 'scaleY(1.05)';
                                                (e.target as HTMLElement).style.opacity = '0.9';
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.target as HTMLElement).style.transform = 'scaleY(1)';
                                                (e.target as HTMLElement).style.opacity = '1';
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginTop: '0.5rem'
                        }}>
                            {ventasMensuales.map((item) => (
                                <div
                                    key={`label-${item.mes}`}
                                    style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        fontSize: '0.75rem',
                                        color: '#6B7280',
                                        fontWeight: 500
                                    }}
                                >
                                    {item.mes}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* Transactions Table */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937' }}>Últimas Transacciones</h2>
                    <button style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                        Ver Todo
                    </button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>ID Transacción</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Fecha</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Cliente</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Estado</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <tr key={item} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: '#6b7280' }}>#TR-{202400 + item}</td>
                                <td style={{ padding: '1rem' }}>2{item} Ene, 2024</td>
                                <td style={{ padding: '1rem', fontWeight: 500, color: '#1f2937' }}>Cliente Ejemplo {item}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: '#D1FAE5',
                                        color: '#059669'
                                    }}>Completado</span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600 }}>$ {item * 150}.00</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
