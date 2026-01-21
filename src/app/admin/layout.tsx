'use client';

// ============================================
// ADMIN LAYOUT - ENTERPRISE STYLE
// ============================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

// Menú estructura tipo Enterprise
const menuSections = [
    {
        title: 'Principal',
        items: [
            { href: '/admin', label: 'Dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg> }
        ]
    },
    {
        title: 'Operaciones',
        items: [
            { href: '/admin/pos', label: 'Nueva Venta (POS)', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3zM12 8v8M8 12h8" /></svg> },
            { href: '/admin/pedidos', label: 'Historial Ventas', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
            { href: '/admin/caja', label: 'Caja & Movimientos', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg> },
        ]
    },
    {
        title: 'Catálogo',
        items: [
            { href: '/admin/productos', label: 'Productos', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg> },
            { href: '/admin/inventario', label: 'Inventario', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg> },
        ]
    },
    {
        title: 'Administración',
        items: [
            { href: '/admin/clientes', label: 'Clientes', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
            { href: '/admin/configuracion', label: 'Configuración', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
        ]
    }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [cajaAbierta, setCajaAbierta] = useState(true);

    return (
        <div className="admin-layout">
            {/* Enterprice Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo-icon">S</div>
                        <span className="logo-text">Sellast</span>
                    </div>
                </div>

                <div className="sidebar-content">
                    {menuSections.map((section, idx) => (
                        <div key={idx} className="menu-section">
                            <h4 className="section-title">{section.title}</h4>
                            <nav className="nav-menu">
                                {section.items.map(item => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        <span className="nav-label">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Widget Caja */}
                <div className="sidebar-footer">
                    <div className="caja-widget">
                        <div className="caja-header">
                            <span className="caja-title">Caja Abierta</span>
                            <span className={`caja-badge ${cajaAbierta ? 'active' : 'closed'}`}>
                                {cajaAbierta ? 'Activa' : 'Cerrada'}
                            </span>
                        </div>
                        <div className="caja-amount">$ 12,450.00</div>
                        <button className="btn-close-caja">Cerrar Turno</button>
                    </div>

                    <div className="user-mini">
                        <div className="user-avatar">AD</div>
                        <div className="user-info">
                            <span className="user-name">Administrador</span>
                            <span className="user-role">Super Admin</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <main className="main-content">
                <header className="top-bar">
                    <div className="breadcrumb">
                        <span>Panel de Control</span> / <span className="current">{pathname.split('/').pop()}</span>
                    </div>
                    <div className="top-actions">
                        <button className="icon-btn notification">
                            <span className="dot"></span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                        </button>
                        <Link href="/" className="btn-store">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                            Ver Tienda
                        </Link>
                    </div>
                </header>

                <div className="page-content">
                    {children}
                </div>
            </main>

            <style jsx global>{`
                :root {
                    --primary: #2563eb;
                    --primary-light: #eff6ff;
                    --text-main: #1e293b;
                    --text-secondary: #64748b;
                    --bg-body: #f1f5f9;
                    --bg-white: #ffffff;
                    --border: #e2e8f0;
                }

                body { background: var(--bg-body); color: var(--text-main); }

                .admin-layout { display: flex; min-height: 100vh; font-family: 'Inter', sans-serif; }
                
                /* SIDEBAR */
                .sidebar {
                    width: 260px;
                    background: var(--bg-white);
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    height: 100vh;
                    z-index: 50;
                }
                
                .sidebar-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                }
                
                .logo-container { display: flex; align-items: center; gap: 0.75rem; }
                .logo-icon { width: 36px; height: 36px; background: var(--primary); color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.25rem; }
                .logo-text { font-size: 1.25rem; font-weight: 700; color: var(--text-main); }
                
                .sidebar-content { flex: 1; overflow-y: auto; padding: 1.5rem 1rem; }
                .menu-section { margin-bottom: 2rem; }
                .section-title { font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 600; margin-bottom: 0.75rem; padding-left: 0.75rem; }
                
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border-radius: 8px;
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: all 0.2s;
                    margin-bottom: 0.25rem;
                }
                
                .nav-item:hover { background: var(--bg-body); color: var(--text-main); }
                .nav-item.active { background: var(--primary-light); color: var(--primary); font-weight: 600; }
                .nav-icon { color: inherit; display: flex; }
                
                .sidebar-footer { padding: 1rem; border-top: 1px solid var(--border); background: #f8fafc; }
                
                .caja-widget { background: var(--bg-white); padding: 1rem; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .caja-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
                .caja-title { font-size: 0.85rem; font-weight: 600; color: var(--text-main); }
                .caja-badge { font-size: 0.65rem; padding: 2px 8px; border-radius: 10px; font-weight: 700; text-transform: uppercase; }
                .caja-badge.active { background: #dcfce7; color: #166534; }
                .caja-amount { font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem; }
                .btn-close-caja { width: 100%; font-size: 0.8rem; padding: 0.5rem; background: var(--bg-body); border: 1px solid var(--border); border-radius: 6px; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
                .btn-close-caja:hover { background: #fee2e2; color: #991b1b; border-color: #fecaca; }
                
                .user-mini { display: flex; align-items: center; gap: 0.75rem; }
                .user-avatar { width: 36px; height: 36px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #64748b; font-size: 0.8rem; }
                .user-info { display: flex; flex-direction: column; }
                .user-name { font-size: 0.85rem; font-weight: 600; color: var(--text-main); }
                .user-role { font-size: 0.75rem; color: var(--text-secondary); }

                /* MAIN CONTENT */
                .main-content { flex: 1; margin-left: 260px; display: flex; flex-direction: column; }
                
                .top-bar {
                    height: 64px;
                    background: var(--bg-white);
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2rem;
                    position: sticky;
                    top: 0;
                    z-index: 40;
                }
                
                .breadcrumb { font-size: 0.9rem; color: var(--text-secondary); }
                .breadcrumb .current { color: var(--text-main); font-weight: 600; text-transform: capitalize; }
                
                .top-actions { display: flex; align-items: center; gap: 1rem; }
                .icon-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border); background: var(--bg-white); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); position: relative; }
                .icon-btn:hover { background: var(--bg-body); color: var(--primary); }
                .dot { position: absolute; top: 10px; right: 10px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid var(--bg-white); }
                
                .btn-store {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border: 1px solid var(--primary);
                    color: var(--primary);
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .btn-store:hover { background: var(--primary-light); }
                
                .page-content { padding: 2rem; flex: 1; overflow-y: auto; }
            `}</style>
        </div>
    );
}
