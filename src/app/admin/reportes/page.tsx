'use client';

// ============================================
// ADMIN - REPORTES
// ============================================

const reportesData = {
    ventasSemana: [
        { dia: 'Lun', monto: 4500 },
        { dia: 'Mar', monto: 6200 },
        { dia: 'Mié', monto: 3800 },
        { dia: 'Jue', monto: 7100 },
        { dia: 'Vie', monto: 8900 },
        { dia: 'Sáb', monto: 12500 },
        { dia: 'Dom', monto: 5600 },
    ],
    topProductos: [
        { nombre: 'Bolso Premium Leather', ventas: 45, ingresos: 58455 },
        { nombre: 'Reloj Clásico Dorado', ventas: 32, ingresos: 79968 },
        { nombre: 'Zapatillas Urban Style', ventas: 28, ingresos: 53172 },
        { nombre: 'Lentes de Sol Aviator', ventas: 67, ingresos: 53533 },
    ],
    resumen: {
        ventasMes: 245600,
        pedidosMes: 89,
        ticketPromedio: 2759,
        clientesNuevos: 34,
    },
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default function ReportesPage() {
    const maxVenta = Math.max(...reportesData.ventasSemana.map(d => d.monto));

    return (
        <div className="reportes-page">
            <div className="page-header">
                <div>
                    <h1>Reportes</h1>
                    <p>Análisis de ventas y rendimiento</p>
                </div>
                <div className="header-actions">
                    <select className="period-select">
                        <option>Últimos 7 días</option>
                        <option>Últimos 30 días</option>
                        <option>Este mes</option>
                        <option>Este año</option>
                    </select>
                    <button className="btn-export">📥 Exportar</button>
                </div>
            </div>

            {/* Resumen */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-value">{formatCurrency(reportesData.resumen.ventasMes)}</span>
                    <span className="stat-label">Ventas del Mes</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{reportesData.resumen.pedidosMes}</span>
                    <span className="stat-label">Pedidos</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{formatCurrency(reportesData.resumen.ticketPromedio)}</span>
                    <span className="stat-label">Ticket Promedio</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{reportesData.resumen.clientesNuevos}</span>
                    <span className="stat-label">Clientes Nuevos</span>
                </div>
            </div>

            <div className="reports-grid">
                {/* Gráfico de Ventas */}
                <div className="report-card">
                    <h3>Ventas de la Semana</h3>
                    <div className="chart-container">
                        {reportesData.ventasSemana.map((d, i) => (
                            <div key={i} className="chart-bar-container">
                                <div className="chart-bar" style={{ height: `${(d.monto / maxVenta) * 100}%` }}>
                                    <span className="bar-value">{formatCurrency(d.monto)}</span>
                                </div>
                                <span className="bar-label">{d.dia}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Productos */}
                <div className="report-card">
                    <h3>Top Productos</h3>
                    <div className="top-list">
                        {reportesData.topProductos.map((p, i) => (
                            <div key={i} className="top-item">
                                <span className="top-rank">#{i + 1}</span>
                                <div className="top-info">
                                    <span className="top-name">{p.nombre}</span>
                                    <span className="top-stats">{p.ventas} ventas</span>
                                </div>
                                <span className="top-revenue">{formatCurrency(p.ingresos)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .reportes-page { max-width: 1400px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.25rem; }
                .page-header p { color: #64748b; }
                .header-actions { display: flex; gap: 1rem; }
                .period-select { padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; }
                .btn-export { padding: 0.75rem 1.5rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
                .stat-card { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
                .stat-value { font-size: 1.75rem; font-weight: 700; color: #1a1a2e; }
                .stat-label { font-size: 0.875rem; color: #64748b; }
                .reports-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
                .report-card { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                .report-card h3 { font-size: 1.1rem; font-weight: 600; color: #1a1a2e; margin-bottom: 1.5rem; }
                .chart-container { display: flex; align-items: flex-end; justify-content: space-between; height: 200px; gap: 0.5rem; }
                .chart-bar-container { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
                .chart-bar { background: linear-gradient(to top, #e94560, #ff6b6b); border-radius: 4px 4px 0 0; width: 100%; position: relative; min-height: 20px; display: flex; align-items: flex-start; justify-content: center; }
                .bar-value { font-size: 0.65rem; color: #fff; padding-top: 4px; white-space: nowrap; }
                .bar-label { font-size: 0.75rem; color: #64748b; margin-top: 0.5rem; }
                .top-list { display: flex; flex-direction: column; gap: 1rem; }
                .top-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 8px; }
                .top-rank { font-size: 1rem; font-weight: 700; color: #e94560; width: 30px; }
                .top-info { flex: 1; display: flex; flex-direction: column; }
                .top-name { font-weight: 500; color: #1a1a2e; }
                .top-stats { font-size: 0.8rem; color: #64748b; }
                .top-revenue { font-family: monospace; font-weight: 600; color: #1a1a2e; }
            `}</style>
        </div>
    );
}
