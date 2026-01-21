// ============================================
// ADMIN - GESTIÓN DE PEDIDOS
// ============================================

'use client';

import { useState } from 'react';

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

    const pedidosFiltrados = pedidos.filter(pedido => {
        const matchStatus = !filtroStatus || pedido.status === filtroStatus;
        const matchBusqueda = !busqueda ||
            pedido.id.toLowerCase().includes(busqueda.toLowerCase()) ||
            pedido.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
            pedido.email.toLowerCase().includes(busqueda.toLowerCase());
        return matchStatus && matchBusqueda;
    });

    return (
        <div className="pedidos-page">
            <div className="page-header">
                <div>
                    <h1>Pedidos</h1>
                    <p>Gestiona todos los pedidos de la tienda</p>
                </div>
                <button
                    className="btn-export"
                    onClick={() => alert('Exportando pedidos...')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#06B6D4',
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
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Exportar
                </button>
            </div>

            {/* Filtros */}
            <div className="filters-bar">
                <input
                    type="search"
                    placeholder="Buscar por # pedido, cliente o email..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-input"
                />
                <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="filter-select"
                >
                    {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
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
                                            onClick={() => alert(`Ver detalles del pedido: ${pedido.id}`)}
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
                                            onClick={() => alert(`Editar pedido: ${pedido.id}`)}
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
                                                onClick={() => alert(`¿Cancelar pedido ${pedido.id}?`)}
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
        </div>
    );
}
