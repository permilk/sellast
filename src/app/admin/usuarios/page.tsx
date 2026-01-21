'use client';

export default function UsuariosPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Usuarios</h1>
                    <p className="text-slate-400 font-light">Gestión de acceso y roles del sistema.</p>
                </div>
                <button className="btn-primary" onClick={() => alert('Abrir modal nuevo usuario')}>
                    + Nuevo Usuario
                </button>
            </div>

            <div className="content-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700/50 text-xs uppercase text-slate-500 tracking-wider">
                                <th className="py-4 pl-6 font-medium">Usuario</th>
                                <th className="py-4 font-medium">Rol</th>
                                <th className="py-4 font-medium">Estado</th>
                                <th className="py-4 font-medium">Último Acceso</th>
                                <th className="py-4 pr-6 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {[
                                { name: "Admin Principal", email: "admin@sellast.com", role: "Super Admin", status: "active", last: "Hace 2 min" },
                                { name: "Vendedor Caja", email: "caja@sellast.com", role: "Vendedor", status: "active", last: "Hace 1 hora" },
                                { name: "Soporte Técnico", email: "soporte@sellast.com", role: "Soporte", status: "offline", last: "Ayer" },
                                { name: "Gestor Inventario", email: "stock@sellast.com", role: "Editor", status: "active", last: "Hace 3 horas" },
                            ].map((user, idx) => (
                                <tr key={idx} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors group">
                                    <td className="py-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">{user.name}</div>
                                                <div className="text-slate-500 text-xs">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`role-badge ${user.role === 'Super Admin' ? 'admin' : 'staff'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                                            <span className="text-slate-400 capitalize">{user.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-slate-400 font-light">{user.last}</td>
                                    <td className="py-4 pr-6 text-right">
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                                            <button
                                                onClick={() => alert(`Editar usuario: ${user.name}`)}
                                                style={{ width: '32px', height: '32px', background: '#FEF3C7', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                title="Editar"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => alert(`${user.status === 'active' ? 'Desactivar' : 'Activar'} usuario: ${user.name}`)}
                                                style={{ width: '32px', height: '32px', background: user.status === 'active' ? '#FEE2E2' : '#D1FAE5', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                title={user.status === 'active' ? 'Desactivar' : 'Activar'}
                                            >
                                                {user.status === 'active' ? (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                                                ) : (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .content-card {
                    background: var(--bg-panel);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    overflow: hidden;
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
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
                }
                .role-badge {
                    font-size: 0.75rem;
                    padding: 0.2rem 0.6rem;
                    border-radius: 6px;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                }
                .role-badge.admin { background: rgba(124, 58, 237, 0.15); color: #a78bfa; border: 1px solid rgba(124, 58, 237, 0.2); }
                .role-badge.staff { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }
            `}</style>
        </div>
    );
}
