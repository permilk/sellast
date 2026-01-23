// ============================================
// ADMIN - GESTIÓN DE PEDIDOS
// ============================================

'use client';

import { useState } from 'react';
import { exportToExcel } from '@/utils/exportExcel';
import { KPISummary } from '@/components/admin/KPISummary';

// Datos de ejemplo
const pedidos = [
    { id: 'ORD-2026-00045', cliente: 'María García', email: 'maria@email.com', total: 2450, status: 'CONFIRMED', fecha: '2026-01-20', items: 3, factura: true },
    { id: 'ORD-2026-00044', cliente: 'Carlos López', email: 'carlos@email.com', total: 1890, status: 'PROCESSING', fecha: '2026-01-20', items: 2, factura: false },
    { id: 'ORD-2026-00043', cliente: 'Ana Martínez', email: 'ana@email.com', total: 3200, status: 'SHIPPED', fecha: '2026-01-19', items: 4, factura: true },
    { id: 'ORD-2026-00042', cliente: 'Pedro Sánchez', email: 'pedro@email.com', total: 950, status: 'DELIVERED', fecha: '2026-01-19', items: 1, factura: false },
    { id: 'ORD-2026-00041', cliente: 'Laura Díaz', email: 'laura@email.com', total: 1650, status: 'PENDING', fecha: '2026-01-19', items: 2, factura: true },
    { id: 'ORD-2026-00040', cliente: 'Roberto Ruiz', email: 'roberto@email.com', total: 4500, status: 'DELIVERED', fecha: '2026-01-18', items: 5, factura: false },
    { id: 'ORD-2026-00039', cliente: 'Carmen Flores', email: 'carmen@email.com', total: 2100, status: 'CANCELLED', fecha: '2026-01-18', items: 2, factura: false },
];

const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'CONFIRMED', label: 'Confirmado' },
    { value: 'PROCESSING', label: 'Preparando' },
    { value: 'SHIPPED', label: 'Enviado' },
    { value: 'DELIVERED', label: 'Entregado' },
    { value: 'CANCELLED', label: 'Cancelado' },
];

const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pendiente', color: '#f59e0b' },
    CONFIRMED: { label: 'Confirmado', color: '#3b82f6' },
    PROCESSING: { label: 'Preparando', color: '#8b5cf6' },
    SHIPPED: { label: 'Enviado', color: '#06b6d4' },
    DELIVERED: { label: 'Entregado', color: '#10b981' },
    CANCELLED: { label: 'Cancelado', color: '#ef4444' },
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(amount);
}

export default function PedidosPage() {
    const [filtroStatus, setFiltroStatus] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState<typeof pedidos[0] | null>(null);

    const pedidosFiltrados = pedidos.filter(pedido => {
        const matchStatus = !filtroStatus || pedido.status === filtroStatus;
        const matchBusqueda = !busqueda ||
            pedido.id.toLowerCase().includes(busqueda.toLowerCase()) ||
            pedido.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
            pedido.email.toLowerCase().includes(busqueda.toLowerCase());
        return matchStatus && matchBusqueda;
    });

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
                            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                            <rect x="9" y="3" width="6" height="4" rx="2" />
                            <line x1="9" y1="12" x2="15" y2="12" />
                            <line x1="9" y1="16" x2="13" y2="16" />
                        </svg>
                        Pedidos
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Gestiona todos los pedidos de la tienda</p>
                </div>
                <button
                    className="btn-export"
                    onClick={() => exportToExcel(
                        pedidosFiltrados.map(p => ({
                            'Número': p.id,
                            Fecha: p.fecha,
                            Cliente: p.cliente,
                            Email: p.email,
                            Total: `$${p.total.toFixed(2)}`,
                            Estado: statusLabels[p.status].label
                        })),
                        'Pedidos_Sellast',
                        'Pedidos'
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
                    }}
                >
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
                { label: 'Total Pedidos', value: pedidos.length, color: 'blue' },
                { label: 'Pendientes', value: pedidos.filter(p => p.status === 'PENDING').length, color: 'amber' },
                { label: 'Entregados', value: pedidos.filter(p => p.status === 'DELIVERED').length, color: 'green' },
                { label: 'Cancelados', value: pedidos.filter(p => p.status === 'CANCELLED').length, color: 'red' }
            ]} />

            {/* Filtros */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'flex-end'
            }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Buscar</label>
                    <input
                        type="text"
                        placeholder="# pedido, cliente o email..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
                <div style={{ minWidth: '180px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Estado</label>
                    <select
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        style={{
                            padding: '0.6rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            minWidth: '160px',
                            background: 'white'
                        }}
                    >
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabla de Pedidos */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Factura</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidosFiltrados.map((pedido) => (
                            <tr key={pedido.id}>
                                <td className="cell-id">{pedido.id}</td>
                                <td>
                                    <div className="cell-cliente">
                                        <span className="cliente-nombre">{pedido.cliente}</span>
                                        <span className="cliente-email">{pedido.email}</span>
                                    </div>
                                </td>
                                <td className="cell-center">{pedido.items}</td>
                                <td className="cell-total">{formatCurrency(pedido.total)}</td>
                                <td>
                                    <span
                                        className="status-badge"
                                        style={{
                                            background: `${statusLabels[pedido.status].color}20`,
                                            color: statusLabels[pedido.status].color
                                        }}
                                    >
                                        {statusLabels[pedido.status].label}
                                    </span>
                                </td>
                                <td className="cell-center">
                                    {pedido.factura ? (
                                        <span className="factura-badge si">🧾 Sí</span>
                                    ) : (
                                        <span className="factura-badge no">—</span>
                                    )}
                                </td>
                                <td className="cell-date">{pedido.fecha}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {/* Ver Pedido */}
                                        <button
                                            onClick={() => { setSelectedPedido(pedido); setShowDetalleModal(true); }}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#CFFAFE',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title="Ver pedido"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>
                                        {/* Editar Pedido */}
                                        <button
                                            onClick={() => { setSelectedPedido(pedido); alert('Funcionalidad de edición en desarrollo'); }}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#FEF3C7',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title="Editar pedido"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                        {/* Cancelar Pedido - solo si no está entregado o cancelado */}
                                        {pedido.status !== 'DELIVERED' && pedido.status !== 'CANCELLED' && (
                                            <button
                                                onClick={() => { if (confirm(`¿Está seguro que desea cancelar el pedido ${pedido.id}?`)) { alert('Pedido cancelado'); } }}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: '#FEE2E2',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title="Cancelar pedido"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="15" y1="9" x2="9" y2="15" />
                                                    <line x1="9" y1="9" x2="15" y2="15" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {pedidosFiltrados.length === 0 && (
                    <div className="empty-state">
                        <p>No se encontraron pedidos con los filtros aplicados.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .pedidos-page {
                    max-width: 1400px;
                }
                
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                }
                
                .page-header h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin-bottom: 0.25rem;
                }
                
                .page-header p {
                    color: #64748b;
                }
                
                .btn-export {
                    padding: 0.75rem 1.5rem;
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .btn-export:hover {
                    background: #f8fafc;
                    border-color: #e94560;
                }
                
                .filters-bar {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                
                .search-input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 0.95rem;
                }
                
                .search-input:focus {
                    outline: none;
                    border-color: #e94560;
                }
                
                .filter-select {
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    min-width: 200px;
                    cursor: pointer;
                }
                
                .table-container {
                    background: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .data-table th,
                .data-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                .data-table th {
                    background: #f8fafc;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #64748b;
                    font-weight: 600;
                }
                
                .cell-id {
                    font-family: monospace;
                    font-weight: 600;
                    color: #1a1a2e;
                }
                
                .cell-cliente {
                    display: flex;
                    flex-direction: column;
                }
                
                .cliente-nombre {
                    font-weight: 500;
                    color: #1a1a2e;
                }
                
                .cliente-email {
                    font-size: 0.8rem;
                    color: #64748b;
                }
                
                .cell-center {
                    text-align: center;
                }
                
                .cell-total {
                    font-family: monospace;
                    font-weight: 600;
                }
                
                .cell-date {
                    color: #64748b;
                }
                
                .status-badge {
                    padding: 0.35rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                
                .factura-badge {
                    font-size: 0.8rem;
                }
                
                .factura-badge.si {
                    color: #10b981;
                }
                
                .factura-badge.no {
                    color: #94a3b8;
                }
                
                .actions {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .action-btn {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f1f5f9;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                
                .action-btn:hover {
                    background: #e94560;
                }
                
                .empty-state {
                    padding: 3rem;
                    text-align: center;
                    color: #64748b;
                }
            `}</style>

            {/* Modal Detalle de Pedido */}
            {showDetalleModal && selectedPedido && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Detalle del Pedido</h3>
                            <button
                                onClick={() => { setShowDetalleModal(false); setSelectedPedido(null); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
                            >×</button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>ID Pedido</label>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{selectedPedido.id}</p>
                                </div>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Fecha</label>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{selectedPedido.fecha}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Cliente</label>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{selectedPedido.cliente}</p>
                                </div>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Estado</label>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: selectedPedido.status === 'DELIVERED' ? '#DCFCE7' :
                                            selectedPedido.status === 'SHIPPED' ? '#DBEAFE' :
                                                selectedPedido.status === 'PROCESSING' ? '#FEF3C7' :
                                                    selectedPedido.status === 'CANCELLED' ? '#FEE2E2' : '#F1F5F9',
                                        color: selectedPedido.status === 'DELIVERED' ? '#166534' :
                                            selectedPedido.status === 'SHIPPED' ? '#1E40AF' :
                                                selectedPedido.status === 'PROCESSING' ? '#92400E' :
                                                    selectedPedido.status === 'CANCELLED' ? '#DC2626' : '#475569'
                                    }}>
                                        {selectedPedido.status === 'DELIVERED' ? 'Entregado' :
                                            selectedPedido.status === 'SHIPPED' ? 'Enviado' :
                                                selectedPedido.status === 'PROCESSING' ? 'En Proceso' :
                                                    selectedPedido.status === 'CANCELLED' ? 'Cancelado' : selectedPedido.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Artículos</label>
                                <p style={{ margin: 0, fontWeight: 500 }}>{selectedPedido.items} artículo(s)</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Total</label>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1.25rem', color: '#059669' }}>{selectedPedido.total}</p>
                                </div>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Factura</label>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{selectedPedido.factura ? 'Sí' : 'No'}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => { setShowDetalleModal(false); setSelectedPedido(null); }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#F1F5F9',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >Cerrar</button>
                            <button
                                onClick={() => window.print()}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#2563EB',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >Imprimir</button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}
