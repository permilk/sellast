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
type MenuItem = {
    key: string;
    label: string;
    icon?: ReactNode;
    href?: string;
    type?: 'link' | 'button' | 'header';
    children?: MenuItem[];
    primary?: boolean;
};

const mainNav: MenuItem[] = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        href: '/admin',
        type: 'link',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
    },
    {
        key: 'ventas',
        label: 'Ventas',
        type: 'header',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3zM12 8v8M8 12h8" /></svg>,
        children: [
            { key: 'nueva_venta', label: 'Nueva Venta', href: '/admin/pos', type: 'link', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg> },
            { key: 'historial', label: 'Historial', href: '/admin/pedidos', type: 'link', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> }
        ]
    },
    {
        key: 'productos',
        label: 'Productos',
        type: 'header',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>,
        children: [
            { key: 'listado', label: 'Productos', href: '/admin/productos', type: 'link', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> },
            { key: 'categorias', label: 'Categorías', href: '/admin/categorias', type: 'link', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> }
        ]
    },
    {
        key: 'caja',
        label: 'Caja',
        href: '/admin/caja',
        type: 'link',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
    },
    {
        key: 'finanzas',
        label: 'Finanzas',
        type: 'header',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
        children: [
            { key: 'balance', label: 'Balance', href: '/admin/finanzas', type: 'link' }
        ]
    },
    {
        key: 'usuarios',
        label: 'Usuarios',
        href: '/admin/usuarios',
        type: 'link',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    },
    {
        key: 'configuracion',
        label: 'Configuracion',
        href: '/admin/configuracion',
        type: 'link',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [cajaAbierta, setCajaAbierta] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="admin-layout">
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Enterprice Sidebar */}
            <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="flex justify-between items-center w-full">
                        <div className="logo-container">
                            {/* Replaced Icon with Typography as requested */}
                            <span className="logo-text">Sellast<span className="highlight">.</span></span>
                        </div>
                        <button
                            className="md:hidden p-1 rounded text-slate-400 hover:text-white"
                            onClick={() => setIsMobileOpen(false)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <div className="sidebar-content">
                    <nav className="nav-menu">
                        {mainNav.map((item) => (
                            <div key={item.key} className="nav-group">
                                {item.children ? (
                                    <details className="group" open>
                                        <summary className="nav-item header">
                                            <span className="nav-icon">{item.icon}</span>
                                            <span className="nav-label">{item.label}</span>
                                            <span className="nav-chevron">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                                            </span>
                                        </summary>
                                        <div className="nav-children">
                                            {item.children.map(child => (
                                                <Link
                                                    key={child.key}
                                                    href={child.href || '#'}
                                                    className={`nav-item ${child.type === 'button' ? 'btn-primary' : ''} ${pathname === child.href ? 'active' : ''}`}
                                                >
                                                    {child.icon && <span className="nav-icon-sm">{child.icon}</span>}
                                                    <span className="nav-label">{child.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </details>
                                ) : (
                                    <Link
                                        href={item.href || '#'}
                                        className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        <span className="nav-label">{item.label}</span>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
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
                    <div className="flex items-center gap-3">
                        <button
                            className="mobile-toggle"
                            onClick={() => setIsMobileOpen(true)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        </button>
                        <div className="breadcrumb">
                            <span className="hidden md:inline">Panel de Control / </span>
                            <span className="current">{pathname.split('/').pop()}</span>
                        </div>
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
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');

                :root {
                    --bg-page: #0B0F19;     /* Deep Navy */
                    --bg-panel: #111827;    /* Slate 900 */
                    --bg-hover: #1f2937;    /* Slate 800 */
                    
                    /* Primary Accent - Pink Coral */
                    --primary: #FF4D6D;     
                    --primary-hover: #fa3e5f;
                    --primary-dim: rgba(255, 77, 109, 0.15);

                    /* Text */
                    --text-main: #F8FAFC;   /* Slate 50 */
                    --text-muted: #94A3B8;  /* Slate 400 */
                    
                    /* Borders */
                    --border: #1e293b;      /* Slate 800 */
                    --border-light: #334155;
                }

                body { background: var(--bg-page); color: var(--text-main); margin: 0; font-family: 'Outfit', sans-serif; }

                /* SCROLLBAR */
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: var(--bg-page); }
                ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

                .admin-layout { display: flex; min-height: 100vh; font-family: 'Outfit', sans-serif; }
                
                /* SIDEBAR */
                .sidebar {
                    width: 240px; 
                    background: var(--bg-panel);
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    height: 100vh;
                    z-index: 50;
                    transition: all 0.3s ease;
                }
                
                .sidebar-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                }
                
                .logo-container { display: flex; align-items: center; gap: 0.75rem; }
                /* Minimalist Text Logo with Serif font for elegance */
                .logo-text { 
                    font-family: 'Playfair Display', serif; 
                    font-size: 1.5rem; 
                    font-weight: 600; 
                    color: var(--text-main);
                    letter-spacing: -0.02em;
                }
                .logo-text .highlight { color: var(--primary); }
                
                .sidebar-content { 
                    flex: 1; 
                    overflow-y: auto; 
                    padding: 1.5rem 1rem; 
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                }
                
                .nav-menu { display: flex; flex-direction: column; gap: 0.5rem; }
                .nav-group { margin-bottom: 0.5rem; }

                /* HEADER ITEM (Summary) */
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    color: var(--text-muted);
                    text-decoration: none;
                    transition: all 0.2s;
                    cursor: pointer;
                    user-select: none;
                    font-size: 0.9rem;
                    position: relative;
                    font-weight: 400;
                }
                .nav-item:hover, .nav-item.header:hover { 
                    background: var(--bg-hover); 
                    color: var(--text-main); 
                }
                .nav-item.active { 
                    background: var(--primary-dim); 
                    color: var(--primary); 
                    font-weight: 500; 
                }
                
                .nav-item.header { font-weight: 500; justify-content: space-between; color: var(--text-main); }
                .nav-item.header:hover { background: transparent; } /* Header doesn't need hover bg */

                .nav-chevron { transition: transform 0.2s; opacity: 0.6; }
                details[open] .nav-chevron { transform: rotate(180deg); }
                details > summary { list-style: none; }
                details > summary::-webkit-details-marker { display: none; }

                /* CHILDREN ITEMS */
                .nav-children {
                    padding-left: 0; /* Reset */
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    margin-top: 0.25rem;
                    position: relative;
                }
                /* Thin guide line */
                .nav-children::before {
                    content: '';
                    position: absolute;
                    left: 1.6rem; 
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: var(--border);
                }
                
                .nav-children .nav-item {
                    padding: 0.5rem 0.75rem 0.5rem 2.5rem; /* Indented text */
                    font-size: 0.85rem;
                    color: var(--text-muted);
                }
                .nav-children .nav-item:hover { color: var(--text-main); background: transparent; }
                .nav-children .nav-item.active { color: var(--primary); background: transparent; font-weight: 500; }
                .nav-children .nav-item.active::before {
                    content: '';
                    position: absolute;
                    left: 1.45rem;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: var(--primary);
                }


                /* PRIMARY BUTTON ITEM */
                .nav-item.btn-primary {
                    background: var(--primary);
                    color: white;
                    margin: 1rem 0;
                    justify-content: center;
                    font-weight: 500;
                    box-shadow: 0 4px 12px rgba(255, 77, 109, 0.3);
                    border: 1px solid var(--primary);
                }
                .nav-item.btn-primary:hover {
                    background: var(--primary-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(255, 77, 109, 0.4);
                }

                .nav-icon { min-width: 20px; display: flex; justify-content: center; opacity: 0.8; }
                .nav-label { flex: 1; }

                /* HEADER STYLES */
                .sidebar-footer { padding: 1.5rem; border-top: 1px solid var(--border); background: var(--bg-panel); }
                
                .caja-widget { 
                    background: rgba(255,255,255,0.03); 
                    padding: 1rem; 
                    border-radius: 12px; 
                    border: 1px solid var(--border); 
                    margin-bottom: 1.5rem; 
                }
                .caja-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
                .caja-title { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .caja-badge { font-size: 0.65rem; padding: 2px 8px; border-radius: 20px; font-weight: 600; text-transform: uppercase; }
                .caja-badge.active { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
                
                .caja-amount { font-size: 1.25rem; font-weight: 600; color: var(--text-main); margin-bottom: 1rem; font-family: 'Outfit', sans-serif; }
                
                .btn-close-caja { 
                    width: 100%; font-size: 0.8rem; padding: 0.5rem; 
                    background: transparent; 
                    border: 1px solid var(--border-light); 
                    border-radius: 8px; 
                    color: var(--text-muted); 
                    cursor: pointer; transition: all 0.2s; 
                }
                .btn-close-caja:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }
                
                .user-mini { display: flex; align-items: center; gap: 0.75rem; }
                .user-avatar { 
                    width: 36px; height: 36px; 
                    background: var(--primary); 
                    color: white;
                    border-radius: 50%; 
                    display: flex; align-items: center; justify-content: center; 
                    font-weight: 600; 
                    font-size: 0.8rem; 
                    box-shadow: 0 0 0 2px rgba(255, 77, 109, 0.2);
                }
                .user-info { display: flex; flex-direction: column; }
                .user-name { font-size: 0.9rem; font-weight: 500; color: var(--text-main); }
                .user-role { font-size: 0.75rem; color: var(--text-muted); }

                /* MAIN CONTENT - HYBRID LIGHT THEME OVERRIDE */
                .main-content { 
                    flex: 1; 
                    margin-left: 240px; 
                    display: flex; 
                    flex-direction: column; 
                    width: 100%; 
                    
                    /* Override Global Dark Variables locally for the Right Side */
                    --bg-page: #F8FAFC;     /* Slate 50 (Very light gray/white) */
                    --bg-panel: #FFFFFF;    /* Pure White Cards */
                    --bg-hover: #F1F5F9;    /* Slate 100 */
                    --text-main: #0F172A;   /* Slate 900 (Dark Text) */
                    --text-muted: #64748B;  /* Slate 500 */
                    --border: #E2E8F0;      /* Slate 200 */
                    --border-light: #F1F5F9;
                    
                    background: var(--bg-page); 
                    color: var(--text-main);
                }
                
                .top-bar {
                    height: 64px;
                    background: var(--bg-panel);
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2rem;
                    position: sticky;
                    top: 0;
                    z-index: 40;
                }
                
                .mobile-toggle {
                    background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 0.25rem;
                }
                .mobile-toggle:hover { color: var(--text-main); }
                
                .breadcrumb { font-size: 0.9rem; color: var(--text-muted); font-weight: 300; }
                .breadcrumb .current { color: var(--text-main); font-weight: 500; text-transform: capitalize; }
                
                .top-actions { display: flex; align-items: center; gap: 1rem; }
                
                .icon-btn { 
                    width: 40px; height: 40px; 
                    border-radius: 12px; 
                    border: 1px solid var(--border); 
                    background: var(--bg-page); /* Slight contrast on white header */
                    display: flex; align-items: center; justify-content: center; 
                    cursor: pointer; color: var(--text-muted); 
                    position: relative; transition: all 0.2s;
                }
                .icon-btn:hover { background: var(--bg-hover); color: var(--text-main); border-color: var(--border-light); }
                .dot { position: absolute; top: 10px; right: 10px; width: 6px; height: 6px; background: var(--primary); border-radius: 50%; }
                
                /* Title Overrides for Light Mode */
                .main-content h1, .main-content h2, .main-content h3 {
                    color: var(--text-main) !important;
                }
                
                .btn-store {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: rgba(255, 77, 109, 0.1);
                    border: 1px solid rgba(255, 77, 109, 0.2);
                    color: var(--primary);
                    border-radius: 10px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .btn-store:hover { background: rgba(255, 77, 109, 0.2); transform: translateY(-1px); }
                
                .page-content { padding: 2rem; flex: 1; overflow-y: auto; }

                /* MEDIA QUERIES */
                @media (min-width: 769px) {
                    .mobile-toggle { display: none; }
                }

                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
                        box-shadow: none;
                        width: 280px; 
                    }
                    .sidebar.open { transform: translateX(0); box-shadow: 10px 0 30px rgba(0,0,0,0.5); }
                    
                    .main-content { margin-left: 0; }
                    .top-bar { padding: 0 1rem; }
                    .page-content { padding: 1rem; }
                    
                    .mobile-overlay {
                        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0,0,0,0.7); 
                        backdrop-filter: blur(2px);
                        z-index: 45;
                    }
                }
            `}</style>
        </div >
    );
}
