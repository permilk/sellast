// ============================================
// ADMIN - GESTIÓN DE PEDIDOS
// ============================================

'use client';

import Link from 'next/link';
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
                <button className="btn-export">
                    📥 Exportar
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
                                    <div className="actions">
                                        <Link href={`/admin/pedidos/${pedido.id}`} className="action-btn view">
                                            👁️
                                        </Link>
                                        <button className="action-btn edit">
                                            ✏️
                                        </button>
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
