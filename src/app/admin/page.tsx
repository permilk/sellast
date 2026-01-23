'use client';

// ============================================
// ADMIN - DASHBOARD (BRANCH-AWARE)
// ============================================

import Link from 'next/link';
import { useBranchStore } from '@/stores/branchStore';
import { getKPIsForBranch, getCajaForBranch, getBranchManager } from '@/stores/branchData';

export default function AdminDashboard() {
    const { currentBranch, currentBranchId } = useBranchStore();

    // Get branch-specific data
    const kpis = getKPIsForBranch(currentBranchId || 'branch-1');
    const caja = getCajaForBranch(currentBranchId || 'branch-1');
    const manager = getBranchManager(currentBranchId || 'branch-1');

    return (
        <div style={{ padding: '1.5rem' }}>
            <div className="dashboard-container">
                <div className="welcome-section">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="9" />
                            <rect x="14" y="3" width="7" height="5" />
                            <rect x="14" y="12" width="7" height="9" />
                            <rect x="3" y="16" width="7" height="5" />
                        </svg>
                        Panel de Control
                    </h1>
                    <p>
                        <strong style={{ color: '#6366F1' }}>{currentBranch?.name || 'Sucursal'}</strong>
                        {' '} • Gerente: {manager?.name || 'Sin asignar'}
                    </p>
                </div>

                {/* Branch Info Banner */}
                {currentBranch && (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '12px',
                        padding: '1rem 1.5rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '1.1rem' }}>
                                    {currentBranch.name}
                                    {currentBranch.isMain && (
                                        <span style={{
                                            marginLeft: '0.5rem',
                                            fontSize: '0.7rem',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            color: '#059669',
                                            padding: '2px 8px',
                                            borderRadius: '4px'
                                        }}>PRINCIPAL</span>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                                    {currentBranch.address}
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: caja.isOpen ? '#059669' : '#DC2626',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}>
                                <span style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: caja.isOpen ? '#059669' : '#DC2626'
                                }}></span>
                                Caja {caja.isOpen ? 'Abierta' : 'Cerrada'}
                            </div>
                            {caja.isOpen && (
                                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                    Cajero: {caja.cashier}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* KPI Cards - Now Dynamic */}
                <div className="kpi-grid">
                    <div className="kpi-card highlight">
                        <div className="kpi-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                        <div className="kpi-content">
                            <span className="kpi-label">Ventas Hoy</span>
                            <span className="kpi-value">${kpis.ventasHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                            <span className="kpi-trend positive">+15% vs ayer</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-icon blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                        </div>
                        <div className="kpi-content">
                            <span className="kpi-label">Productos Vendidos</span>
                            <span className="kpi-value">{kpis.productosVendidos}</span>
                            <span className="kpi-sub">En esta sucursal</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-icon purple">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                        <div className="kpi-content">
                            <span className="kpi-label">Clientes Atendidos</span>
                            <span className="kpi-value">{kpis.clientesAtendidos}</span>
                            <span className="kpi-trend positive">Hoy</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-icon orange">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                        <div className="kpi-content">
                            <span className="kpi-label">Ticket Promedio</span>
                            <span className="kpi-value">${kpis.ticketPromedio.toFixed(2)}</span>
                            <span className="kpi-sub">Por cliente</span>
                        </div>
                    </div>
                </div>

                <div className="content-grid">
                    {/* Chart Section */}
                    <div className="main-chart-panel">
                        <div className="panel-header">
                            <h3>Resumen de Ingresos - {currentBranch?.name}</h3>
                            <select className="chart-select">
                                <option>Esta Semana</option>
                                <option>Este Mes</option>
                            </select>
                        </div>
                        <div className="chart-placeholder">
                            <div className="bar-group"><div className="bar" style={{ height: '40%' }}></div><span>Lun</span></div>
                            <div className="bar-group"><div className="bar" style={{ height: '65%' }}></div><span>Mar</span></div>
                            <div className="bar-group"><div className="bar" style={{ height: '55%' }}></div><span>Mié</span></div>
                            <div className="bar-group"><div className="bar" style={{ height: '80%' }}></div><span>Jue</span></div>
                            <div className="bar-group"><div className="bar active" style={{ height: '90%' }}></div><span>Vie</span></div>
                            <div className="bar-group"><div className="bar" style={{ height: '70%' }}></div><span>Sáb</span></div>
                            <div className="bar-group"><div className="bar" style={{ height: '50%' }}></div><span>Dom</span></div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="side-panel">
                        <h3>Actividad - {currentBranch?.code}</h3>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="act-icon sale">V</div>
                                <div className="act-info">
                                    <span className="act-title">Nueva Venta POS</span>
                                    <span className="act-time">Hace 5 min</span>
                                </div>
                                <span className="act-amount">+$850</span>
                            </div>
                            <div className="activity-item">
                                <div className="act-icon order">P</div>
                                <div className="act-info">
                                    <span className="act-title">Pedido Web #2024</span>
                                    <span className="act-time">Hace 25 min</span>
                                </div>
                                <span className="act-amount">+$1,200</span>
                            </div>
                            <div className="activity-item">
                                <div className="act-icon expense">−</div>
                                <div className="act-info">
                                    <span className="act-title">Pago Proveedor</span>
                                    <span className="act-time">Hace 2 horas</span>
                                </div>
                                <span className="act-amount neg">-$5,000</span>
                            </div>
                            <Link href="/admin/caja" className="view-more">Ver todos los movimientos →</Link>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                .dashboard-container { max-width: 100%; }
                
                .welcome-section { margin-bottom: 1.5rem; }
                .welcome-section h1 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
                .welcome-section p { color: #64748b; }
                
                .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
                
                .kpi-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; display: flex; align-items: flex-start; gap: 1rem; transition: transform 0.2s; }
                .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .kpi-card.highlight { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #fff; border: none; }
                .kpi-card.highlight .kpi-label, .kpi-card.highlight .kpi-sub { color: rgba(255,255,255,0.8); }
                .kpi-card.highlight .kpi-icon { background: rgba(255,255,255,0.2); color: #fff; }
                
                .kpi-icon { width: 48px; height: 48px; border-radius: 10px; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; }
                .kpi-icon.blue { background: #eff6ff; color: #2563eb; }
                .kpi-icon.purple { background: #f3e8ff; color: #9333ea; }
                .kpi-icon.orange { background: #fff7ed; color: #ea580c; }
                
                .kpi-content { display: flex; flex-direction: column; }
                .kpi-label { font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem; font-weight: 500; }
                .kpi-value { font-size: 1.5rem; font-weight: 700; color: #1e293b; line-height: 1.2; }
                .kpi-trend { font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; }
                .kpi-trend.positive { color: #22c55e; }
                .kpi-card.highlight .kpi-trend { color: #86efac; }
                .kpi-sub { font-size: 0.75rem; color: #94a3b8; margin-top: 0.25rem; }

                .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
                
                .main-chart-panel, .side-panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .panel-header h3, .side-panel h3 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0; }
                
                .chart-select { padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px; color: #64748b; font-size: 0.85rem; }
                
                .chart-placeholder { height: 250px; display: flex; align-items: flex-end; justify-content: space-between; padding-top: 1rem; }
                .bar-group { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; width: 10%; height: 100%; justify-content: flex-end; }
                .bar { width: 100%; background: #e2e8f0; border-radius: 4px 4px 0 0; transition: height 1s ease; }
                .bar.active { background: #2563eb; }
                .bar-group span { font-size: 0.75rem; color: #94a3b8; }
                
                .activity-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
                .activity-item { display: flex; align-items: center; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9; }
                .act-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; }
                .act-icon.sale { background: #dcfce7; color: #166534; }
                .act-icon.order { background: #dbeafe; color: #1e40af; }
                .act-icon.expense { background: #fee2e2; color: #991b1b; }
                
                .act-info { flex: 1; display: flex; flex-direction: column; }
                .act-title { font-size: 0.9rem; font-weight: 500; color: #1e293b; }
                .act-time { font-size: 0.75rem; color: #94a3b8; }
                .act-amount { font-weight: 600; font-size: 0.9rem; color: #1e293b; }
                .act-amount.neg { color: #ef4444; }
                
                .view-more { display: block; text-align: center; margin-top: 1rem; color: #2563eb; text-decoration: none; font-size: 0.85rem; font-weight: 600; }

                @media (max-width: 1024px) {
                    .kpi-grid { grid-template-columns: 1fr 1fr; }
                    .content-grid { grid-template-columns: 1fr; }
                }
            `}</style>
            </div>
        </div>
    );
}
