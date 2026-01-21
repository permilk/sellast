'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutProps { children: ReactNode; }

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg> },
    { href: '/admin/pedidos', label: 'Pedidos', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></svg> },
    { href: '/admin/productos', label: 'Productos', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></svg> },
    { href: '/admin/clientes', label: 'Clientes', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
    { href: '/admin/inventario', label: 'Inventario', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /><path d="M8 7h6M8 11h8" /></svg> },
    { href: '/admin/facturas', label: 'Facturas', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg> },
    { href: '/admin/reportes', label: 'Reportes', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M18 17V9M13 17V5M8 17v-3" /></svg> },
    { href: '/admin/configuracion', label: 'Configuración', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo"><Link href="/admin">Sell<span>ast</span></Link><span className="admin-badge">Admin</span></div>
                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}>
                            <span className="admin-nav-icon">{item.icon}</span>
                            <span className="admin-nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="admin-sidebar-footer">
                    <Link href="/productos" className="admin-nav-item">
                        <span className="admin-nav-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg></span>
                        <span className="admin-nav-label">Ver Tienda</span>
                    </Link>
                </div>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <div className="admin-search">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                        <input type="search" placeholder="Buscar pedidos, productos, clientes..." />
                    </div>
                    <div className="admin-header-actions">
                        <button className="admin-notification-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                            <span className="notification-badge">3</span>
                        </button>
                        <div className="admin-user">
                            <div className="admin-user-avatar">A</div>
                            <span className="admin-user-name">Admin</span>
                        </div>
                    </div>
                </header>
                <div className="admin-content">{children}</div>
            </main>
            <style jsx global>{`
                .admin-layout{display:flex;min-height:100vh;background:#f1f5f9}
                .admin-sidebar{width:260px;background:linear-gradient(180deg,#1a1a2e 0%,#16213e 100%);color:#fff;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100}
                .admin-logo{padding:1.5rem;font-size:1.5rem;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;gap:0.75rem}
                .admin-logo a{color:#fff;text-decoration:none}
                .admin-logo span{color:#e94560}
                .admin-badge{font-size:0.65rem;background:rgba(233,69,96,0.2);color:#e94560;padding:0.25rem 0.5rem;border-radius:4px;text-transform:uppercase;letter-spacing:1px}
                .admin-nav{flex:1;padding:1rem 0;overflow-y:auto}
                .admin-nav-item{display:flex;align-items:center;gap:0.75rem;padding:0.875rem 1.5rem;color:rgba(255,255,255,0.7);text-decoration:none;transition:all 0.2s;border-left:3px solid transparent}
                .admin-nav-item:hover,.admin-nav-item.active{background:rgba(255,255,255,0.05);color:#fff;border-left-color:#e94560}
                .admin-nav-icon{display:flex;align-items:center}
                .admin-nav-label{font-size:0.95rem}
                .admin-sidebar-footer{padding:1rem 0;border-top:1px solid rgba(255,255,255,0.1)}
                .admin-main{flex:1;margin-left:260px;display:flex;flex-direction:column}
                .admin-header{background:#fff;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e2e8f0;position:sticky;top:0;z-index:50}
                .admin-search{display:flex;align-items:center;gap:0.75rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:0 1rem}
                .admin-search input{width:350px;padding:0.75rem 0;border:none;background:none;font-size:0.95rem}
                .admin-search input:focus{outline:none}
                .admin-header-actions{display:flex;align-items:center;gap:1.5rem}
                .admin-notification-btn{position:relative;background:none;border:none;cursor:pointer;padding:0.5rem;color:#64748b}
                .notification-badge{position:absolute;top:0;right:0;background:#e94560;color:#fff;font-size:0.65rem;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center}
                .admin-user{display:flex;align-items:center;gap:0.75rem;padding:0.5rem 1rem;background:#f8fafc;border-radius:8px}
                .admin-user-avatar{width:32px;height:32px;background:linear-gradient(135deg,#e94560,#ff6b6b);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:0.875rem}
                .admin-user-name{font-weight:500;color:#1a1a2e}
                .admin-content{flex:1;padding:2rem}
            `}</style>
        </div>
    );
}
