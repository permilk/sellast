'use client';

// ============================================
// POS DASHBOARD - PREMIUM DESIGN
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CashOpenModal from '../components/CashOpenModal';
import '../pos-styles.css';

// Mock data
const mockProducts = [
    { name: 'Whisky JackDaniels', sales: 85 },
    { name: 'Vodka Absolut', sales: 65 },
    { name: 'Preparado', sales: 40 },
];

const mockCategories = [
    { name: 'Sin categoría', value: 100, color: '#3b82f6' },
];

export default function POSDashboardPage() {
    const router = useRouter();
    const [showCashModal, setShowCashModal] = useState(false);
    const [shiftActive, setShiftActive] = useState(false);

    const handleOpenShift = (data: { turnoId: string; nombre: string; montoInicial: number }) => {
        console.log('Turno abierto:', data);
        setShiftActive(true);
        setShowCashModal(false);
        // Redirect to sales view
        router.push('/admin/pos');
    };

    return (
        <div className="pos-module" style={{ padding: '0' }}>
            {/* POS Header Bar */}
            <div className="pos-header">
                <div className="pos-header-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Punto de Venta 2026
                </div>

                <div className="pos-header-nav">
                    <div className="pos-nav-item active">Dashboard</div>
                    <div className="pos-nav-item" onClick={() => router.push('/admin/pos')}>Ventas</div>
                    <div className="pos-nav-item">Pedidos</div>
                    <div className="pos-nav-item">Productos</div>
                    <div className="pos-nav-item">Inventario</div>
                    <div className="pos-nav-item">Complementos</div>
                    <div className="pos-nav-item">Vencimientos</div>
                    <div className="pos-nav-item">Clientes</div>
                    <div className="pos-nav-item">Compras</div>
                    <div className="pos-nav-item">Proveedores</div>
                    <div className="pos-nav-item">Reportes</div>
                    <div className="pos-nav-item">Configuración</div>
                </div>

                <div className="pos-header-user">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    Administrador ▾
                </div>
            </div>

            {/* Main Content */}
            <div style={{ padding: '1.5rem', background: '#f1f5f9', minHeight: 'calc(100vh - 60px)' }}>
                {/* Page Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Dashboard</h1>
                    </div>

                    <button
                        className="btn-pos btn-pos-cyan btn-pos-lg"
                        onClick={() => setShowCashModal(true)}
                        style={{ boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Abrir... 30 Nov
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="kpi-grid">
                    <div className="kpi-card gradient-magenta">
                        <span className="kpi-card-label">Ventas Hoy</span>
                        <span className="kpi-card-value">S/ 0.00</span>
                        <span className="kpi-card-sublabel">Total del día</span>
                    </div>
                    <div className="kpi-card gradient-cyan">
                        <span className="kpi-card-label">Pedidos</span>
                        <span className="kpi-card-value">8</span>
                        <span className="kpi-card-sublabel">Pendientes</span>
                    </div>
                    <div className="kpi-card gradient-orange">
                        <span className="kpi-card-label">Stock Bajo</span>
                        <span className="kpi-card-value">0</span>
                        <span className="kpi-card-sublabel">Productos alertados</span>
                    </div>
                    <div className="kpi-card gradient-blue">
                        <span className="kpi-card-label">Clientes</span>
                        <span className="kpi-card-value">3</span>
                        <span className="kpi-card-sublabel">Registrados hoy</span>
                    </div>
                </div>

                {/* Charts */}
                <div className="chart-grid">
                    {/* Bar Chart - Products */}
                    <div className="chart-card">
                        <div className="chart-card-header">
                            <div className="chart-card-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="20" x2="18" y2="10" />
                                    <line x1="12" y1="20" x2="12" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="14" />
                                </svg>
                            </div>
                            <span className="chart-card-title">Productos Más Vendidos</span>
                        </div>
                        <div className="bar-chart">
                            {mockProducts.map((prod, idx) => (
                                <div className="bar-item" key={idx}>
                                    <div
                                        className="bar"
                                        style={{ height: `${(prod.sales / 100) * 150}px` }}
                                    />
                                    <span className="bar-label">{prod.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Donut Chart - Categories */}
                    <div className="chart-card">
                        <div className="chart-card-header">
                            <div className="chart-card-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #22c55e)' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 2a10 10 0 0 1 10 10" />
                                </svg>
                            </div>
                            <span className="chart-card-title">Ventas por Categoría</span>
                        </div>
                        <div className="donut-container">
                            {/* SVG Donut */}
                            <div className="donut-chart">
                                <svg viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="20"
                                        strokeDasharray="251.2"
                                        strokeDashoffset="0"
                                        transform="rotate(-90 50 50)"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="30"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                            <div className="donut-legend">
                                {mockCategories.map((cat, idx) => (
                                    <div className="legend-item" key={idx}>
                                        <div className="legend-dot" style={{ background: cat.color }} />
                                        <span>{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cash Open Modal */}
            <CashOpenModal
                isOpen={showCashModal}
                onClose={() => setShowCashModal(false)}
                onConfirm={handleOpenShift}
            />
        </div>
    );
}
