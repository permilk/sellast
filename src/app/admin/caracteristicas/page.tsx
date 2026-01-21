'use client';

export default function CaracteristicasPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Características</h1>
                    <p className="text-slate-400 font-light">Especificaciones técnicas globales (ej. Cuidados de lavado).</p>
                </div>
                <button className="btn-primary">
                    + Nueva Característica
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Cuidados de Lavado', 'Origen', 'Garantía', 'Sostenibilidad'].map((char, i) => (
                    <div key={i} className="content-card hover:border-slate-600 transition-colors cursor-pointer group">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-pink-400 group-hover:bg-slate-700/50 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                </div>
                                <button className="text-slate-600 hover:text-white">•••</button>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">{char}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {i === 0 ? "Instrucciones de lavado, secado y planchado para etiquetas." : "Información técnica estandarizada para fichas de producto."}
                            </p>
                        </div>
                        <div className="px-6 py-3 bg-slate-900/30 border-t border-slate-800/50 flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-mono">ID: {100 + i}</span>
                            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Activo</span>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .content-card {
                    background: var(--bg-panel);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .btn-primary {
                    background: var(--primary);
                    color: white;
                    padding: 0.6rem 1.25rem;
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .btn-primary:hover {
                    background: var(--primary-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255, 77, 109, 0.25);
                }
            `}</style>
        </div>
    );
}
