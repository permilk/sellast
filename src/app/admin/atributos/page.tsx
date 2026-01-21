'use client';

export default function AtributosPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Atributos</h1>
                    <p className="text-slate-400 font-light">Variables de producto (Talla, Color, Material).</p>
                </div>
                <button className="btn-primary">
                    + Nuevo Atributo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* List Card */}
                <div className="content-card">
                    <h3 className="card-header">Listado de Atributos</h3>
                    <div className="divide-y divide-slate-800">
                        {['Color', 'Talla', 'Material', 'Estilo'].map((attr, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition">
                                        #
                                    </div>
                                    <span className="text-slate-200 font-medium">{attr}</span>
                                </div>
                                <div className="text-slate-500 text-sm">
                                    {3 + i} valores
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Values Card */}
                <div className="content-card bg-slate-900/50 border-dashed">
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-50"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /><line x1="3.27" y1="6.96" x2="12" y2="12.01" /><line x1="20.73" y1="6.96" x2="12" y2="12.01" /></svg>
                        <p>Selecciona un atributo para ver sus valores</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .content-card {
                    background: var(--bg-panel);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    overflow: hidden;
                }
                .card-header {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid var(--border);
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .btn-primary {
                    background: var(--primary);
                    color: white;
                    padding: 0.6rem 1.25rem;
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .btn-primary:hover {
                    background: var(--primary-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255, 77, 109, 0.2);
                }
            `}</style>
        </div>
    );
}
