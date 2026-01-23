'use client';

// ============================================
// ADMIN - COMPRAS
// ============================================

import { useState } from 'react';
import { exportToExcel } from '@/utils/exportExcel';
import { KPISummary } from '@/components/admin/KPISummary';

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
    const [compras, setCompras] = useState<Compra[]>(comprasMock);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('todos');
    const [showModal, setShowModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [showPagoModal, setShowPagoModal] = useState(false);
    const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);
    const [montoPago, setMontoPago] = useState(0);
    const [nuevaCompra, setNuevaCompra] = useState({ proveedor: '', productos: 1, subtotal: 0 });

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
                        onClick={() => exportToExcel(
                            filteredCompras.map(c => ({
                                Orden: c.id,
                                Proveedor: c.proveedor,
                                Fecha: c.fecha,
                                Vencimiento: c.fechaVencimiento,
                                Productos: c.productos,
                                Subtotal: `$${c.subtotal.toLocaleString()}`,
                                IVA: `$${c.iva.toLocaleString()}`,
                                Total: `$${c.total.toLocaleString()}`,
                                Estado: c.estado,
                                'Método Pago': c.metodoPago
                            })),
                            'Compras_Sellast',
                            'Ordenes_Compra'
                        )}
                        style={{ padding: '0.75rem 1rem', background: 'white', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Exportar
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{ padding: '0.75rem 1rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Nueva Compra
                    </button>
                </div>
            </div>

            {/* KPI Summary */}
            <KPISummary cards={[
                { label: 'Total Compras (Mes)', value: totalCompras.toLocaleString(), color: 'purple', prefix: '$ ' },
                { label: 'Pendiente de Pago', value: pendientesPago.toLocaleString(), color: 'amber', prefix: '$ ' },
                { label: 'Compras Vencidas', value: comprasVencidas, color: 'red' },
                { label: 'Órdenes Este Mes', value: compras.length, color: 'green' }
            ]} />

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
                                            <button onClick={() => { setSelectedCompra(compra); setShowDetalleModal(true); }} style={{ width: '32px', height: '32px', background: '#CFFAFE', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Ver">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            </button>
                                            {compra.estado !== 'pagada' && (
                                                <button onClick={() => { setSelectedCompra(compra); setMontoPago(compra.total); setShowPagoModal(true); }} style={{ width: '32px', height: '32px', background: '#D1FAE5', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Registrar Pago">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                                </button>
                                            )}
                                            <button onClick={() => { setSelectedCompra(compra); setShowDetalleModal(true); setTimeout(() => window.print(), 100); }} style={{ width: '32px', height: '32px', background: '#DBEAFE', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Imprimir">
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

            {/* Modal Nueva Compra */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Nueva Orden de Compra</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Proveedor *</label>
                                <select value={nuevaCompra.proveedor} onChange={e => setNuevaCompra({ ...nuevaCompra, proveedor: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <option value="">Seleccionar proveedor...</option>
                                    <option value="Coca-Cola FEMSA">Coca-Cola FEMSA</option>
                                    <option value="Grupo Modelo">Grupo Modelo</option>
                                    <option value="Distribuidora Gloria">Distribuidora Gloria</option>
                                    <option value="Sabritas PepsiCo">Sabritas PepsiCo</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Productos</label>
                                    <input type="number" min="1" value={nuevaCompra.productos} onChange={e => setNuevaCompra({ ...nuevaCompra, productos: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Subtotal</label>
                                    <input type="number" min="0" value={nuevaCompra.subtotal} onChange={e => setNuevaCompra({ ...nuevaCompra, subtotal: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} placeholder="0.00" />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={() => {
                                if (!nuevaCompra.proveedor) { alert('Selecciona un proveedor'); return; }
                                const iva = nuevaCompra.subtotal * 0.16;
                                const newCompra: Compra = {
                                    id: `OC-2026-00${46 + compras.length}`,
                                    proveedor: nuevaCompra.proveedor,
                                    fecha: new Date().toISOString().split('T')[0],
                                    fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                    productos: nuevaCompra.productos,
                                    subtotal: nuevaCompra.subtotal,
                                    iva: iva,
                                    total: nuevaCompra.subtotal + iva,
                                    estado: 'pendiente',
                                    metodoPago: 'Crédito 30 días'
                                };
                                setCompras([newCompra, ...compras]);
                                setNuevaCompra({ proveedor: '', productos: 1, subtotal: 0 });
                                setShowModal(false);
                                alert(`Orden ${newCompra.id} creada exitosamente`);
                            }} style={{ padding: '0.75rem 1.5rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Crear Orden</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detalle de Compra */}
            {showDetalleModal && selectedCompra && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div id="print-order" style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '550px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#7C3AED', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            Orden {selectedCompra.id}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', gridColumn: '1 / -1' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>PROVEEDOR</p>
                                <p style={{ fontWeight: 700, margin: 0, fontSize: '1.1rem' }}>{selectedCompra.proveedor}</p>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>FECHA</p>
                                <p style={{ fontWeight: 500, margin: 0 }}>{selectedCompra.fecha}</p>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>VENCIMIENTO</p>
                                <p style={{ fontWeight: 500, margin: 0, color: selectedCompra.estado === 'vencida' ? '#EF4444' : '#111827' }}>{selectedCompra.fechaVencimiento}</p>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>SUBTOTAL</p>
                                <p style={{ fontWeight: 600, margin: 0, fontFamily: 'monospace' }}>$ {selectedCompra.subtotal.toLocaleString()}</p>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>IVA 16%</p>
                                <p style={{ fontWeight: 600, margin: 0, fontFamily: 'monospace' }}>$ {selectedCompra.iva.toLocaleString()}</p>
                            </div>
                            <div style={{ background: '#7C3AED', padding: '1rem', borderRadius: '8px', gridColumn: '1 / -1' }}>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem' }}>TOTAL</p>
                                <p style={{ fontWeight: 700, margin: 0, fontSize: '1.5rem', color: 'white', fontFamily: 'monospace' }}>$ {selectedCompra.total.toLocaleString()}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button onClick={() => { setShowDetalleModal(false); setSelectedCompra(null); }}
                                style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cerrar</button>
                            {selectedCompra.estado !== 'pagada' && (
                                <button onClick={() => { setShowDetalleModal(false); setMontoPago(selectedCompra.total); setShowPagoModal(true); }}
                                    style={{ padding: '0.75rem 1.5rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Registrar Pago</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Registrar Pago */}
            {showPagoModal && selectedCompra && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#10B981' }}>Registrar Pago - {selectedCompra.id}</h2>
                        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>Proveedor: <strong style={{ color: '#111827' }}>{selectedCompra.proveedor}</strong></p>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#6b7280' }}>Total a pagar: <strong style={{ color: '#10B981', fontSize: '1.1rem' }}>$ {selectedCompra.total.toLocaleString()}</strong></p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Monto a pagar *</label>
                                <input type="number" value={montoPago} onChange={e => setMontoPago(Number(e.target.value))}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600 }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Método de Pago</label>
                                <select style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <option>Transferencia</option>
                                    <option>Efectivo</option>
                                    <option>Cheque</option>
                                    <option>Tarjeta</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => { setShowPagoModal(false); setSelectedCompra(null); }}
                                style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={() => {
                                const newEstado = montoPago >= selectedCompra.total ? 'pagada' : 'parcial';
                                setCompras(prev => prev.map(c => c.id === selectedCompra.id ? { ...c, estado: newEstado as Compra['estado'] } : c));
                                setShowPagoModal(false);
                                setSelectedCompra(null);
                            }} style={{ padding: '0.75rem 1.5rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Confirmar Pago</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body > *:not([class*="modal"]) {
                        display: none !important;
                    }
                    #print-order {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        margin: 0 !important;
                        padding: 2rem !important;
                    }
                    #print-order button {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
