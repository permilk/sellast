'use client';

// ============================================
// ADMIN - COMPRAS
// ============================================

import { useState } from 'react';

interface Compra {
    id: string;
    proveedor: string;
    fecha: string;
    fechaVencimiento: string;
    productos: number;
    subtotal: number;
    iva: number;
    total: number;
    estado: 'pendiente' | 'pagada' | 'parcial' | 'vencida';
    metodoPago: string;
}

const comprasMock: Compra[] = [
    { id: 'OC-2026-0045', proveedor: 'Coca-Cola FEMSA', fecha: '2026-01-20', fechaVencimiento: '2026-02-20', productos: 12, subtotal: 38793.10, iva: 6206.90, total: 45000, estado: 'pendiente', metodoPago: 'Crédito 30 días' },
    { id: 'OC-2026-0044', proveedor: 'Grupo Modelo', fecha: '2026-01-15', fechaVencimiento: '2026-02-15', productos: 8, subtotal: 24568.97, iva: 3931.03, total: 28500, estado: 'parcial', metodoPago: 'Crédito 30 días' },
    { id: 'OC-2026-0043', proveedor: 'Distribuidora Gloria', fecha: '2026-01-10', fechaVencimiento: '2026-01-25', productos: 5, subtotal: 11034.48, iva: 1765.52, total: 12800, estado: 'vencida', metodoPago: 'Crédito 15 días' },
    { id: 'OC-2026-0042', proveedor: 'Sabritas PepsiCo', fecha: '2026-01-08', fechaVencimiento: '2026-01-23', productos: 15, subtotal: 8620.69, iva: 1379.31, total: 10000, estado: 'pagada', metodoPago: 'Contado' },
    { id: 'OC-2026-0041', proveedor: 'Licores del Bajío', fecha: '2026-01-05', fechaVencimiento: '2026-02-05', productos: 20, subtotal: 25862.07, iva: 4137.93, total: 30000, estado: 'pagada', metodoPago: 'Transferencia' },
];

const estadoStyles: Record<string, { bg: string; color: string; label: string }> = {
    pendiente: { bg: '#FEF3C7', color: '#D97706', label: 'Pendiente' },
    pagada: { bg: '#D1FAE5', color: '#10B981', label: 'Pagada' },
    parcial: { bg: '#DBEAFE', color: '#3B82F6', label: 'Pago Parcial' },
    vencida: { bg: '#FEE2E2', color: '#EF4444', label: 'Vencida' },
};

export default function ComprasPage() {
    const [compras] = useState<Compra[]>(comprasMock);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('todos');

    const filteredCompras = compras.filter(c => {
        const matchSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchEstado = estadoFilter === 'todos' || c.estado === estadoFilter;
        return matchSearch && matchEstado;
    });

    const totalCompras = compras.reduce((sum, c) => sum + c.total, 0);
    const pendientesPago = compras.filter(c => c.estado === 'pendiente' || c.estado === 'parcial' || c.estado === 'vencida').reduce((sum, c) => sum + c.total, 0);
    const comprasVencidas = compras.filter(c => c.estado === 'vencida').length;

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Órdenes de Compra
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Gestiona compras a proveedores</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={() => alert('Exportando compras...')}
                        style={{ padding: '0.75rem 1rem', background: '#06B6D4', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Exportar
                    </button>
                    <button
                        onClick={() => alert('Abrir modal nueva orden de compra')}
                        style={{ padding: '0.75rem 1rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Nueva Compra
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #7C3AED' }}>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Compras (Mes)</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937' }}>$ {totalCompras.toLocaleString()}</p>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #F59E0B' }}>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Pendiente de Pago</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F59E0B' }}>$ {pendientesPago.toLocaleString()}</p>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #EF4444' }}>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Compras Vencidas</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#EF4444' }}>{comprasVencidas}</p>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #10B981' }}>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Órdenes Este Mes</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10B981' }}>{compras.length}</p>
                </div>
            </div>

            {/* Filters */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Buscar</label>
                    <input
                        type="text"
                        placeholder="# Orden o proveedor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                </div>
                <div style={{ minWidth: '180px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Estado</label>
                    <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem' }}>
                        <option value="todos">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="pagada">Pagada</option>
                        <option value="parcial">Pago Parcial</option>
                        <option value="vencida">Vencida</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Orden</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Proveedor</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Fecha</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Vencimiento</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Subtotal</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>IVA 16%</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Total</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Estado</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCompras.map(compra => (
                                <tr key={compra.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#7C3AED' }}>{compra.id}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 500, color: '#1f2937' }}>{compra.proveedor}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{compra.productos} productos • {compra.metodoPago}</div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: '#374151' }}>{compra.fecha}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: compra.estado === 'vencida' ? '#EF4444' : '#374151', fontWeight: compra.estado === 'vencida' ? 600 : 400 }}>{compra.fechaVencimiento}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontFamily: 'monospace', color: '#374151' }}>$ {compra.subtotal.toLocaleString()}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontFamily: 'monospace', color: '#6b7280' }}>$ {compra.iva.toLocaleString()}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#1f2937' }}>$ {compra.total.toLocaleString()}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{ padding: '0.25rem 0.75rem', background: estadoStyles[compra.estado].bg, color: estadoStyles[compra.estado].color, borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>{estadoStyles[compra.estado].label}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                            <button onClick={() => alert(`Ver orden: ${compra.id}`)} style={{ width: '32px', height: '32px', background: '#CFFAFE', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Ver">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            </button>
                                            {compra.estado !== 'pagada' && (
                                                <button onClick={() => alert(`Registrar pago: ${compra.id}`)} style={{ width: '32px', height: '32px', background: '#D1FAE5', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Registrar Pago">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                                </button>
                                            )}
                                            <button onClick={() => alert(`Imprimir orden: ${compra.id}`)} style={{ width: '32px', height: '32px', background: '#DBEAFE', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Imprimir">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredCompras.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                        No se encontraron órdenes de compra
                    </div>
                )}
            </div>
        </div>
    );
}
