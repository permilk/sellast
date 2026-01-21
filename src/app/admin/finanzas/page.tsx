'use client';

export default function FinanzasPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif text-white mb-6">Finanzas</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="kpi-card">
                    <h3 className="kpi-title">Ingresos Totales (Mes)</h3>
                    <div className="kpi-value text-emerald-400">$ 45,231.80</div>
                    <div className="kpi-trend positive">
                        <span>↑ 12.5%</span> vs mes anterior
                    </div>
                </div>
                <div className="kpi-card">
                    <h3 className="kpi-title">Pedidos Completados</h3>
                    <div className="kpi-value text-blue-400">142</div>
                    <div className="kpi-trend positive">
                        <span>↑ 8.2%</span> vs mes anterior
                    </div>
                </div>
                <div className="kpi-card">
                    <h3 className="kpi-title">Ticket Promedio</h3>
                    <div className="kpi-value text-pink-400">$ 318.50</div>
                    <div className="kpi-trend negative">
                        <span>↓ 2.1%</span> vs mes anterior
                    </div>
                </div>
            </div>

            {/* Main Chart Area Placeholder */}
            <div className="content-card h-80 flex items-center justify-center bg-opacity-50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="text-center">
                    <h3 className="text-xl font-light text-slate-400 mb-2">Resumen de Ventas Anual</h3>
                    <p className="text-sm text-slate-500">Visualización gráfica en desarrollo</p>

                    {/* Mock Bars */}
                    <div className="flex items-end gap-2 mt-8 h-32 opacity-50">
                        <div className="w-8 bg-pink-500/80 rounded-t-sm h-12"></div>
                        <div className="w-8 bg-pink-500/60 rounded-t-sm h-20"></div>
                        <div className="w-8 bg-pink-500/90 rounded-t-sm h-16"></div>
                        <div className="w-8 bg-pink-500/40 rounded-t-sm h-24"></div>
                        <div className="w-8 bg-pink-500/70 rounded-t-sm h-14"></div>
                        <div className="w-8 bg-pink-500/50 rounded-t-sm h-28"></div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="content-card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-serif text-white">Últimas Transacciones</h2>
                    <button className="text-sm text-pink-500 hover:text-pink-400 transition-colors">Ver Todo</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800/60 text-xs uppercase text-slate-500">
                                <th className="py-3 font-semibold tracking-wider">ID Transacción</th>
                                <th className="py-3 font-semibold tracking-wider">Fecha</th>
                                <th className="py-3 font-semibold tracking-wider">Cliente</th>
                                <th className="py-3 font-semibold tracking-wider">Estado</th>
                                <th className="py-3 font-semibold tracking-wider text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} className="border-b border-slate-800/30 hover:bg-white/5 transition-colors">
                                    <td className="py-4 font-mono text-slate-500">#TR-{202400 + item}</td>
                                    <td className="py-4">2{item} Ene, 2024</td>
                                    <td className="py-4 font-medium text-white">Cliente Ejemplo {item}</td>
                                    <td className="py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            Completado
                                        </span>
                                    </td>
                                    <td className="py-4 text-right font-medium">$ {item * 150}.00</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .kpi-card {
                    background: var(--bg-panel);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 1.5rem;
                    position: relative;
                    overflow: hidden;
                }
                .kpi-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 4px; height: 100%;
                    background: var(--border-light);
                    opacity: 0.5;
                }
                .kpi-title { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
                .kpi-value { font-size: 2rem; font-weight: 700; font-family: 'Outfit', sans-serif; margin-bottom: 0.25rem; }
                .kpi-trend { font-size: 0.8rem; color: var(--text-muted); }
                .kpi-trend.positive span { color: #34d399; font-weight: 600; }
                .kpi-trend.negative span { color: #f87171; font-weight: 600; }

                .content-card {
                    background: var(--bg-panel);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 1.5rem;
                }
            `}</style>
        </div>
    );
}
