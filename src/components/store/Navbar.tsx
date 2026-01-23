'use client';

// ============================================
// STORE NAVBAR - GLASSMORPHISM HEADER
// ============================================

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';

export default function StoreNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const cartCount = useCartStore((state) => state.items.length);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-inner">
                {/* Logo */}
                <Link href="/" className="logo">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M2 10h20" />
                        <path d="M6 16h4" />
                    </svg>
                    <span>Sellast</span>
                </Link>

                {/* Navigation */}
                <nav className="nav">
                    <Link href="/productos">Catálogo</Link>
                    <Link href="/productos?cat=bordados">Bordados</Link>
                    <Link href="/productos?cat=dtf">DTF</Link>
                    <Link href="/productos?cat=vinil">Vinil</Link>
                </nav>

                {/* Actions */}
                <div className="actions">
                    <button className="icon-btn" aria-label="Buscar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>

                    <Link href="/carrito" className="icon-btn cart">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </Link>

                    <Link href="/auth" className="icon-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </Link>

                    <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {menuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mobile-nav">
                    <Link href="/productos" onClick={() => setMenuOpen(false)}>Catálogo</Link>
                    <Link href="/productos?cat=bordados" onClick={() => setMenuOpen(false)}>Bordados</Link>
                    <Link href="/productos?cat=dtf" onClick={() => setMenuOpen(false)}>DTF</Link>
                    <Link href="/productos?cat=vinil" onClick={() => setMenuOpen(false)}>Vinil</Link>
                </div>
            )}

            <style jsx>{`
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    padding: 0 2rem;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                }
                
                .navbar.scrolled {
                    background: rgba(250, 250, 250, 0.8);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                }
                
                .navbar-inner {
                    max-width: 1200px;
                    width: 100%;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-decoration: none;
                    color: #1D1D1F;
                }
                
                .logo svg {
                    color: #1D1D1F;
                }
                
                .logo span {
                    font-size: 1.25rem;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                }
                
                .nav {
                    display: flex;
                    gap: 2.5rem;
                }
                
                .nav a {
                    color: #6E6E73;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 400;
                    transition: color 0.2s;
                }
                
                .nav a:hover {
                    color: #1D1D1F;
                }
                
                .actions {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                
                .icon-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: transparent;
                    border: none;
                    color: #1D1D1F;
                    cursor: pointer;
                    transition: background 0.2s;
                    text-decoration: none;
                    position: relative;
                }
                
                .icon-btn:hover {
                    background: rgba(0, 0, 0, 0.05);
                }
                
                .cart .badge {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    min-width: 18px;
                    height: 18px;
                    background: #0071E3;
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 600;
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 5px;
                }
                
                .mobile-menu {
                    display: none;
                    background: none;
                    border: none;
                    color: #1D1D1F;
                    cursor: pointer;
                    padding: 0.5rem;
                }
                
                .mobile-nav {
                    position: absolute;
                    top: 64px;
                    left: 0;
                    right: 0;
                    background: rgba(250, 250, 250, 0.98);
                    backdrop-filter: blur(20px);
                    padding: 1.5rem 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                }
                
                .mobile-nav a {
                    color: #1D1D1F;
                    text-decoration: none;
                    font-size: 1rem;
                    font-weight: 500;
                    padding: 0.5rem 0;
                }
                
                @media (max-width: 768px) {
                    .nav { display: none; }
                    .mobile-menu { display: block; }
                    .navbar { padding: 0 1rem; }
                }
            `}</style>
        </header>
    );
}
