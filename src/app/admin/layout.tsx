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
            { key: 'listado', label: 'Listado', href: '/admin/productos', type: 'link', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> },
            { key: 'nuevo_producto', label: 'Nuevo Producto', href: '/admin/productos/nuevo', type: 'button', primary: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> },
            { key: 'categorias', label: 'Categorias', href: '/admin/categorias', type: 'link', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> },
            { key: 'atributos', label: 'Atributos', href: '/admin/atributos', type: 'link', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg> },
            { key: 'caracteristicas', label: 'Caracteristicas', href: '/admin/caracteristicas', type: 'link', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
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
                            <div className="logo-icon">S</div>
                            <span className="logo-text">Sellast</span>
                        </div>
                        <button
                            className="md:hidden p-1 rounded hover:bg-slate-100"
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
                :root {
                    --primary: #2563eb;
                    --primary-light: #eff6ff;
                    --text-main: #1e293b;
                    --text-secondary: #64748b;
                    --bg-body: #f1f5f9;
                    --bg-white: #ffffff;
                    --border: #e2e8f0;
                }

                body { background: var(--bg-body); color: var(--text-main); margin: 0; }

                .admin-layout { display: flex; min-height: 100vh; font-family: 'Inter', sans-serif; }
                
                /* SIDEBAR */
                .sidebar {
                    width: 240px; /* Reduced from 260px */
                    background: var(--bg-white);
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    height: 100vh;
                    z-index: 50;
                    transition: width 0.3s;
                }
                
                .sidebar-header {
                    padding: 1.25rem;
                    border-bottom: 1px solid var(--border);
                }
                
                .logo-container { display: flex; align-items: center; gap: 0.75rem; }
                .logo-icon { width: 32px; height: 32px; background: var(--primary); color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.15rem; }
                .logo-text { font-size: 1.15rem; font-weight: 700; color: var(--text-main); }
                
                .sidebar-content { 
                    flex: 1; 
                    overflow-y: auto; 
                    padding: 1rem 0.75rem; 
                    min-height: 0; /* Crucial for nested flex scrolling */
                    display: flex;
                    flex-direction: column;
                }
                
                .nav-menu { display: flex; flex-direction: column; gap: 0.25rem; }
                .nav-group { margin-bottom: 0.25rem; }

                /* HEADER ITEM (Summary) */
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.6rem 0.75rem;
                    border-radius: 8px;
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: all 0.2s;
                    cursor: pointer;
                    user-select: none;
                    font-size: 0.85rem;
                    position: relative;
                }
                .nav-item:hover, .nav-item.header:hover { background: var(--bg-body); color: var(--text-main); }
                .nav-item.active { background: var(--primary-light); color: var(--primary); font-weight: 600; }
                
                .nav-item.header { font-weight: 600; justify-content: space-between; }
                .nav-chevron { transition: transform 0.2s; }
                details[open] .nav-chevron { transform: rotate(180deg); }
                details > summary { list-style: none; }
                details > summary::-webkit-details-marker { display: none; }

                /* CHILDREN ITEMS */
                .nav-children {
                    padding-left: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.15rem;
                    margin-top: 0.15rem;
                    border-left: 1px solid var(--border);
                    margin-left: 1.25rem;
                }
                
                .nav-children .nav-item {
                    padding: 0.45rem 0.75rem;
                    font-size: 0.8rem;
                }

                /* PRIMARY BUTTON ITEM */
                .nav-item.btn-primary {
                    background: var(--primary);
                    color: white;
                    margin: 0.5rem 0;
                    justify-content: center;
                    font-weight: 600;
                    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
                }
                .nav-item.btn-primary:hover {
                    background: #1d4ed8;
                    color: white;
                    transform: translateY(-1px);
                }

                .nav-icon { min-width: 20px; display: flex; justify-content: center; }
                .nav-icon-sm { min-width: 16px; opacity: 0.8; }
                .nav-label { flex: 1; }

                /* HEADER STYLES */
                .sidebar-footer { padding: 1rem; border-top: 1px solid var(--border); background: #f8fafc; }
                
                .caja-widget { background: var(--bg-white); padding: 0.85rem; border-radius: 10px; border: 1px solid var(--border); margin-bottom: 0.75rem; box-shadow: 0 2px 4px -1px rgba(0,0,0,0.05); }
                .caja-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
                .caja-title { font-size: 0.8rem; font-weight: 600; color: var(--text-main); }
                .caja-badge { font-size: 0.65rem; padding: 2px 6px; border-radius: 8px; font-weight: 700; text-transform: uppercase; }
                .caja-badge.active { background: #dcfce7; color: #166534; }
                .caja-amount { font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem; }
                .btn-close-caja { width: 100%; font-size: 0.75rem; padding: 0.4rem; background: var(--bg-body); border: 1px solid var(--border); border-radius: 6px; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
                .btn-close-caja:hover { background: #fee2e2; color: #991b1b; border-color: #fecaca; }
                
                .user-mini { display: flex; align-items: center; gap: 0.6rem; }
                .user-avatar { width: 32px; height: 32px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #64748b; font-size: 0.75rem; }
                .user-info { display: flex; flex-direction: column; }
                .user-name { font-size: 0.8rem; font-weight: 600; color: var(--text-main); }
                .user-role { font-size: 0.7rem; color: var(--text-secondary); }

                /* MAIN CONTENT */
                .main-content { flex: 1; margin-left: 240px; display: flex; flex-direction: column; width: 100%; }
                
                .top-bar {
                    height: 60px;
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
                
                .mobile-toggle {
                    background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 0.25rem;
                }
                .mobile-toggle:hover { color: var(--primary); }
                
                .breadcrumb { font-size: 0.85rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .breadcrumb .current { color: var(--text-main); font-weight: 600; text-transform: capitalize; }
                
                .top-actions { display: flex; align-items: center; gap: 0.75rem; }
                .icon-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); background: var(--bg-white); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); position: relative; }
                .icon-btn:hover { background: var(--bg-body); color: var(--primary); }
                .dot { position: absolute; top: 9px; right: 9px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; border: 2px solid var(--bg-white); }
                
                .btn-store {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.4rem 0.85rem;
                    border: 1px solid var(--primary);
                    color: var(--primary);
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .btn-store:hover { background: var(--primary-light); }
                
                .page-content { padding: 1.5rem; flex: 1; overflow-y: auto; }

                /* MEDIA QUERIES */
                @media (min-width: 769px) {
                    .mobile-toggle { display: none; }
                }

                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                        width: 280px; /* Wider on mobile for touch */
                    }
                    .sidebar.open { transform: translateX(0); }
                    
                    .main-content { margin-left: 0; }
                    .top-bar { padding: 0 1rem; }
                    .page-content { padding: 1rem; }
                    
                    .mobile-overlay {
                        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0,0,0,0.5); z-index: 45;
                    }
                    
                    .nav-item:hover { background: none; }
                    .nav-item:active { background: var(--bg-body); }
                }
            `}</style>
        </div >
    );
}
