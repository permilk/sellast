'use client';

// ============================================
// ADMIN - DASHBOARD PRINCIPAL
// ============================================

import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p className="welcome-text">Bienvenido de nuevo, Admin 👋</p>
                </div>
                <div className="date-badge">
                    {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* KPIs */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon sales">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                    <div className="kpi-info">
                        <h3>Ventas Totales</h3>
                        <p className="kpi-value">$24,500</p>
                        <span className="kpi-trend positive">+15% vs mes ant.</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon orders">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></svg>
                    </div>
                    <div className="kpi-info">
                        <h3>Pedidos Nuevos</h3>
                        <p className="kpi-value">12</p>
                        <span className="kpi-sub">3 pendientes de envío</span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon customers">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                    <div className="kpi-info">
                        <h3>Clientes</h3>
                        <p className="kpi-value">145</p>
                        <span className="kpi-trend positive">+8 nuevos esta semana</span>
                    </div>
                </div>
            </div>

            {/* Accesos Rápidos & Actividad */}
            <div className="dashboard-grid">
                <div className="panel recent-orders">
                    <div className="panel-header">
                        <h3>📦 Últimos Pedidos</h3>
                        <Link href="/admin/pedidos" className="view-all">Ver todos</Link>
                    </div>
                    <table className="dashboard-table">
                        <thead>
                            <tr><th>Pedido</th><th>Cliente</th><th>Total</th><th>Estado</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span className="order-id">#ORD-045</span></td>
                                <td>María García</td>
                                <td className="font-mono">$178.00</td>
                                <td><span className="badge success">Pagado</span></td>
                            </tr>
                            <tr>
                                <td><span className="order-id">#ORD-044</span></td>
                                <td>Juan Pérez</td>
                                <td className="font-mono">$65.00</td>
                                <td><span className="badge warning">Pendiente</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="panel quick-actions">
                    <h3>⚡ Acciones Rápidas</h3>
                    <div className="action-buttons">
                        <Link href="/admin/productos/nuevo" className="quick-btn">
                            <span className="qb-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                            </span>
                            <span>Nuevo Producto</span>
                        </Link>
                        <Link href="/admin/pedidos" className="quick-btn">
                            <span className="qb-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2" ry="2" /><line x1="16" y1="8" x2="20" y2="8" /><line x1="16" y1="16" x2="23" y2="16" /><line x1="16" y1="12" x2="23" y2="12" /></svg>
                            </span>
                            <span>Gestionar Envíos</span>
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .admin-dashboard { max-width: 1400px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; }
                .page-header h1 { font-size: 2rem; font-weight: 800; color: #1a1a2e; line-height: 1; }
                .welcome-text { color: #64748b; margin-top: 0.5rem; }
                .date-badge { background: #fff; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; color: #64748b; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; text-transform: capitalize; }

                .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
                .kpi-card { background: #fff; padding: 1.5rem; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 1.25rem; border: 1px solid #f1f5f9; transition: transform 0.2s; }
                .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.05); }
                .kpi-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .kpi-icon.sales { background: #ecfdf5; color: #10b981; }
                .kpi-icon.orders { background: #eff6ff; color: #3b82f6; }
                .kpi-icon.customers { background: #fef2f2; color: #e94560; }
                .kpi-value { font-size: 1.75rem; font-weight: 800; color: #1a1a2e; line-height: 1.2; }
                .kpi-trend { font-size: 0.75rem; font-weight: 600; }
                .kpi-trend.positive { color: #10b981; }

                .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
                .panel { background: #fff; border-radius: 16px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
                .panel h3 { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; }
                .view-all { font-size: 0.85rem; color: #e94560; text-decoration: none; font-weight: 500; }
                
                .dashboard-table { width: 100%; border-collapse: collapse; }
                .dashboard-table th { text-align: left; font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9; }
                .dashboard-table td { padding: 1rem 0; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #334155; }
                .order-id { font-family: monospace; font-weight: 600; background: #f8fafc; padding: 0.2rem 0.5rem; border-radius: 4px; }
                .font-mono { font-family: monospace; font-weight: 600; }
                .badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
                .badge.success { background: #ecfdf5; color: #10b981; }
                .badge.warning { background: #fffbeb; color: #f59e0b; }

                .action-buttons { display: flex; flex-direction: column; gap: 1rem; }
                .quick-btn { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-decoration: none; color: #1a1a2e; font-weight: 500; transition: all 0.2s; }
                .quick-btn:hover { background: #fff; border-color: #e94560; transform: translateX(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .qb-icon { color: #64748b; }
                .quick-btn:hover .qb-icon { color: #e94560; }
            `}</style>
        </div>
    );
}
