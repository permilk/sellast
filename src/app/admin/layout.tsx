'use client';

// ============================================
// ADMIN LAYOUT - SIDEBAR + HEADER
// ============================================

import Link from 'next/link';
import { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

const navItems = [
    { href: '/admin', icon: '📊', label: 'Dashboard' },
    { href: '/admin/pedidos', icon: '📦', label: 'Pedidos' },
    { href: '/admin/productos', icon: '🛍️', label: 'Productos' },
    { href: '/admin/clientes', icon: '👥', label: 'Clientes' },
    { href: '/admin/inventario', icon: '📋', label: 'Inventario' },
    { href: '/admin/facturas', icon: '🧾', label: 'Facturas' },
    { href: '/admin/reportes', icon: '📈', label: 'Reportes' },
    { href: '/admin/configuracion', icon: '⚙️', label: 'Configuración' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <Link href="/admin">
                        Sell<span>ast</span>
                    </Link>
                    <span className="admin-badge">Admin</span>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="admin-nav-item"
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            <span className="admin-nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <Link href="/" className="admin-nav-item">
                        <span className="admin-nav-icon">🏪</span>
                        <span className="admin-nav-label">Ver Tienda</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="admin-search">
                        <input
                            type="search"
                            placeholder="Buscar pedidos, productos, clientes..."
                        />
                    </div>
                    <div className="admin-header-actions">
                        <button className="admin-notification-btn">
                            🔔
                            <span className="notification-badge">3</span>
                        </button>
                        <div className="admin-user">
                            <span className="admin-user-avatar">👤</span>
                            <span className="admin-user-name">Admin</span>
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    {children}
                </div>
            </main>

            <style jsx global>{`
                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #f1f5f9;
                }
                
                .admin-sidebar {
                    width: 260px;
                    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    z-index: 100;
                }
                
                .admin-logo {
                    padding: 1.5rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .admin-logo span {
                    color: #e94560;
                }
                
                .admin-badge {
                    font-size: 0.65rem;
                    background: rgba(233, 69, 96, 0.2);
                    color: #e94560;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .admin-nav {
                    flex: 1;
                    padding: 1rem 0;
                    overflow-y: auto;
                }
                
                .admin-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.875rem 1.5rem;
                    color: rgba(255,255,255,0.7);
                    text-decoration: none;
                    transition: all 0.2s;
                    border-left: 3px solid transparent;
                }
                
                .admin-nav-item:hover {
                    background: rgba(255,255,255,0.05);
                    color: #fff;
                    border-left-color: #e94560;
                }
                
                .admin-nav-icon {
                    font-size: 1.1rem;
                }
                
                .admin-nav-label {
                    font-size: 0.95rem;
                }
                
                .admin-sidebar-footer {
                    padding: 1rem 0;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                
                .admin-main {
                    flex: 1;
                    margin-left: 260px;
                    display: flex;
                    flex-direction: column;
                }
                
                .admin-header {
                    background: #fff;
                    padding: 1rem 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #e2e8f0;
                    position: sticky;
                    top: 0;
                    z-index: 50;
                }
                
                .admin-search input {
                    width: 400px;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    background: #f8fafc;
                }
                
                .admin-search input:focus {
                    outline: none;
                    border-color: #e94560;
                    background: #fff;
                }
                
                .admin-header-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                
                .admin-notification-btn {
                    position: relative;
                    background: none;
                    border: none;
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0.5rem;
                }
                
                .notification-badge {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: #e94560;
                    color: #fff;
                    font-size: 0.65rem;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .admin-user {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 1rem;
                    background: #f8fafc;
                    border-radius: 8px;
                }
                
                .admin-user-avatar {
                    font-size: 1.25rem;
                }
                
                .admin-user-name {
                    font-weight: 500;
                    color: #1a1a2e;
                }
                
                .admin-content {
                    flex: 1;
                    padding: 2rem;
                }
            `}</style>
        </div>
    );
}
