// ============================================
// ADMIN DASHBOARD - PÁGINA PRINCIPAL
// ============================================

import Link from 'next/link';

// Datos de ejemplo - en producción vendrían de la BD
const stats = {
    ventasHoy: 12450,
    pedidosPendientes: 8,
    productosStockBajo: 5,
    clientesNuevos: 12,
};

const ultimosPedidos = [
    { id: 'ORD-2026-00045', cliente: 'María García', total: 2450, status: 'CONFIRMED', fecha: '2026-01-20' },
    { id: 'ORD-2026-00044', cliente: 'Carlos López', total: 1890, status: 'PROCESSING', fecha: '2026-01-20' },
    { id: 'ORD-2026-00043', cliente: 'Ana Martínez', total: 3200, status: 'SHIPPED', fecha: '2026-01-19' },
    { id: 'ORD-2026-00042', cliente: 'Pedro Sánchez', total: 950, status: 'DELIVERED', fecha: '2026-01-19' },
    { id: 'ORD-2026-00041', cliente: 'Laura Díaz', total: 1650, status: 'PENDING', fecha: '2026-01-19' },
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

export default function AdminDashboard() {
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Bienvenido al panel de administración de Sellast</p>
            </div>

            {/* KPIs */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#dcfce7' }}>💰</div>
                    <div className="stat-content">
                        <span className="stat-value">{formatCurrency(stats.ventasHoy)}</span>
                        <span className="stat-label">Ventas Hoy</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fef3c7' }}>📦</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.pedidosPendientes}</span>
                        <span className="stat-label">Pedidos Pendientes</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fee2e2' }}>⚠️</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.productosStockBajo}</span>
                        <span className="stat-label">Stock Bajo</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#dbeafe' }}>👥</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.clientesNuevos}</span>
                        <span className="stat-label">Clientes Nuevos</span>
                    </div>
                </div>
            </div>

            {/* Últimos Pedidos */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>Últimos Pedidos</h2>
                    <Link href="/admin/pedidos" className="view-all-link">
                        Ver todos →
                    </Link>
                </div>

                <div className="orders-table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Cliente</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ultimosPedidos.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td className="order-id">{pedido.id}</td>
                                    <td>{pedido.cliente}</td>
                                    <td className="order-total">{formatCurrency(pedido.total)}</td>
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
                                    <td className="order-date">{pedido.fecha}</td>
                                    <td>
                                        <Link
                                            href={`/admin/pedidos/${pedido.id}`}
                                            className="action-btn"
                                        >
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
                <h2>Acciones Rápidas</h2>
                <div className="quick-actions">
                    <Link href="/admin/productos/nuevo" className="quick-action-card">
                        <span className="quick-action-icon">➕</span>
                        <span className="quick-action-label">Nuevo Producto</span>
                    </Link>
                    <Link href="/admin/pedidos?status=PENDING" className="quick-action-card">
                        <span className="quick-action-icon">📋</span>
                        <span className="quick-action-label">Pedidos por Confirmar</span>
                    </Link>
                    <Link href="/admin/inventario" className="quick-action-card">
                        <span className="quick-action-icon">📦</span>
                        <span className="quick-action-label">Ajustar Inventario</span>
                    </Link>
                    <Link href="/admin/reportes" className="quick-action-card">
                        <span className="quick-action-icon">📊</span>
                        <span className="quick-action-label">Ver Reportes</span>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .dashboard {
                    max-width: 1400px;
                }
                
                .dashboard-header {
                    margin-bottom: 2rem;
                }
                
                .dashboard-header h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin-bottom: 0.25rem;
                }
                
                .dashboard-header p {
                    color: #64748b;
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .stat-card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .stat-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }
                
                .stat-content {
                    display: flex;
                    flex-direction: column;
                }
                
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1a1a2e;
                }
                
                .stat-label {
                    font-size: 0.875rem;
                    color: #64748b;
                }
                
                .dashboard-section {
                    background: #fff;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .section-header h2 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1a1a2e;
                }
                
                .view-all-link {
                    color: #e94560;
                    font-size: 0.875rem;
                    font-weight: 500;
                    text-decoration: none;
                }
                
                .view-all-link:hover {
                    text-decoration: underline;
                }
                
                .orders-table-wrapper {
                    overflow-x: auto;
                }
                
                .orders-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .orders-table th,
                .orders-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                .orders-table th {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #64748b;
                    font-weight: 600;
                }
                
                .order-id {
                    font-family: monospace;
                    font-weight: 600;
                    color: #1a1a2e;
                }
                
                .order-total {
                    font-family: monospace;
                    font-weight: 600;
                }
                
                .order-date {
                    color: #64748b;
                }
                
                .status-badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                
                .action-btn {
                    padding: 0.5rem 1rem;
                    background: #f1f5f9;
                    color: #1a1a2e;
                    border-radius: 6px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                
                .action-btn:hover {
                    background: #e94560;
                    color: #fff;
                }
                
                .quick-actions {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                }
                
                .quick-action-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1.5rem;
                    background: #f8fafc;
                    border-radius: 12px;
                    text-decoration: none;
                    transition: all 0.2s;
                    border: 2px solid transparent;
                }
                
                .quick-action-card:hover {
                    background: #fff;
                    border-color: #e94560;
                }
                
                .quick-action-icon {
                    font-size: 2rem;
                }
                
                .quick-action-label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #1a1a2e;
                    text-align: center;
                }
                
                @media (max-width: 1024px) {
                    .stats-grid,
                    .quick-actions {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}</style>
        </div>
    );
}
