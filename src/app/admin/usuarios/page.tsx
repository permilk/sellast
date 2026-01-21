'use client';

export default function UsuariosPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Usuarios</h1>
                    <p className="text-slate-400 font-light">Gestión de acceso y roles del sistema.</p>
                </div>
                <button className="btn-primary">
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
                                        <button className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                                        </button>
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
