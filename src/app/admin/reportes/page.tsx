'use client';

// ============================================
// ADMIN - REPORTES
// ============================================

import { useState } from 'react';

// Datos actualizados para coincidir con el catálogo real
const reportesData = {
    ventasSemana: [
        { dia: 'Lun', monto: 1200 },
        { dia: 'Mar', monto: 1850 },
        { dia: 'Mié', monto: 3200 },
        { dia: 'Jue', monto: 2100 },
        { dia: 'Vie', monto: 4500 },
        { dia: 'Sáb', monto: 5600 },
        { dia: 'Dom', monto: 6100 },
    ],
    // Top productos actualizados
    topProductos: [
        { nombre: 'Mariposa Monarca - DTF', ventas: 120, ingresos: 7800 },
        { nombre: 'Rosa Elegante - Bordado', ventas: 85, ingresos: 7565 },
        { nombre: 'Lettering Script - Vinil', ventas: 64, ingresos: 2880 },
        { nombre: 'Tigre Realista - DTF', ventas: 42, ingresos: 5040 },
        { nombre: 'Mandala Floral - Bordado', ventas: 30, ingresos: 4470 },
    ],
    resumen: {
        ventasMes: 24500,
        pedidosMes: 89,
        ticketPromedio: 275, // Ajustado a precios reales
        clientesNuevos: 34,
    },
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default function ReportesPage() {
    const [periodo, setPeriodo] = useState('mes');

    return (
        <div className="reportes-page">
            <div className="page-header">
                <div>
                    <h1>Reportes</h1>
                    <p>Análisis de ventas y rendimiento del catálogo</p>
                </div>
                <div className="periodo-selector">
                    <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                        <option value="semana">Últimos 7 días</option>
                        <option value="mes">Este Mes</option>
                        <option value="ano">Este Año</option>
                    </select>
                    <button className="btn-export">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Descargar PDF
                    </button>
                </div>
            </div>

            {/* Resumen Cards */}
            <div className="resumen-grid">
                <div className="resumen-card">
                    <span className="label">Ventas Totales</span>
                    <span className="value">{formatCurrency(reportesData.resumen.ventasMes)}</span>
                    <span className="trend positive">↑ 12% vs mes anterior</span>
                </div>
                <div className="resumen-card">
                    <span className="label">Pedidos</span>
                    <span className="value">{reportesData.resumen.pedidosMes}</span>
                    <span className="trend positive">↑ 5% vs mes anterior</span>
                </div>
                <div className="resumen-card">
                    <span className="label">Ticket Promedio</span>
                    <span className="value">{formatCurrency(reportesData.resumen.ticketPromedio)}</span>
                    <span className="trend negative">↓ 2% vs mes anterior</span>
                </div>
                <div className="resumen-card">
                    <span className="label">Clientes Nuevos</span>
                    <span className="value">{reportesData.resumen.clientesNuevos}</span>
                    <span className="trend positive">↑ 8% vs mes anterior</span>
                </div>
            </div>

            <div className="charts-grid">
                {/* Gráfico Barras Simple (Visual) */}
                <div className="panel chart-panel">
                    <h3>Ventas por Semana</h3>
                    <div className="chart-container">
                        <div className="bar-chart">
                            {reportesData.ventasSemana.map((d, i) => (
                                <div key={i} className="bar-group">
                                    <div className="bar" style={{ height: `${(d.monto / 7000) * 100}%` }}>
                                        <span className="tooltip">{formatCurrency(d.monto)}</span>
                                    </div>
                                    <span className="bar-label">{d.dia}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Productos */}
                <div className="panel top-products-panel">
                    <h3>Top Productos</h3>
                    <ul className="top-list">
                        {reportesData.topProductos.map((prod, i) => (
                            <li key={i} className="top-item">
                                <div className="rank">{i + 1}</div>
                                <div className="prod-details">
                                    <span className="prod-name">{prod.nombre}</span>
                                    <span className="prod-sales">{prod.ventas} ventas</span>
                                </div>
                                <div className="prod-revenue">
                                    {formatCurrency(prod.ingresos)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <style jsx>{`
                .reportes-page { max-width: 1400px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1a1a2e; }
                .periodo-selector { display: flex; gap: 1rem; }
                .periodo-selector select { padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; }
                .btn-export { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; color: #64748b; }
                
                .resumen-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
                .resumen-card { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 0.5rem; }
                .resumen-card .label { font-size: 0.85rem; color: #64748b; }
                .resumen-card .value { font-size: 1.75rem; font-weight: 800; color: #1a1a2e; }
                .trend { font-size: 0.75rem; font-weight: 600; }
                .trend.positive { color: #10b981; }
                .trend.negative { color: #ef4444; }

                .charts-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
                .panel { background: #fff; border-radius: 12px; padding: 1.5rem; border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .panel h3 { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 1.5rem; }

                .chart-container { height: 300px; display: flex; align-items: flex-end; justify-content: center; }
                .bar-chart { display: flex; align-items: flex-end; gap: 1.5rem; height: 100%; width: 100%; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
                .bar-group { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; height: 100%; justify-content: flex-end; }
                .bar { width: 100%; background: #e94560; border-radius: 6px 6px 0 0;  position: relative; min-height: 4px; transition: height 0.5s ease; }
                .bar:hover { opacity: 0.9; }
                .bar:hover .tooltip { opacity: 1; transform: translateX(-50%) translateY(-5px); }
                .tooltip { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%) translateY(0); background: #1a1a2e; color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; white-space: nowrap; opacity: 0; transition: all 0.2s; pointer-events: none; }
                .bar-label { font-size: 0.8rem; color: #64748b; }

                .top-list { list-style: none; padding: 0; }
                .top-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #f1f5f9; }
                .top-item:last-child { border-bottom: none; }
                .rank { width: 24px; height: 24px; background: #f1f5f9; color: #64748b; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
                .prod-details { flex: 1; display: flex; flex-direction: column; }
                .prod-name { font-weight: 600; font-size: 0.95rem; color: #1a1a2e; }
                .prod-sales { font-size: 0.8rem; color: #64748b; }
                .prod-revenue { font-weight: 700; color: #10b981; }

                @media (max-width: 900px) {
                    .resumen-grid { grid-template-columns: 1fr 1fr; }
                    .charts-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
