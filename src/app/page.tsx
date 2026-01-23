'use client';

// ============================================
// SELLAST STORE - APPLE DARK MODE HOMEPAGE
// ============================================

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';

const featuredProducts = [
    { id: '1', slug: 'rosa-elegante', name: 'Rosa Elegante', category: 'Bordado', price: 89, originalPrice: 129, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop', isNew: true },
    { id: '2', slug: 'mariposa-monarca', name: 'Mariposa Monarca', category: 'Transfer DTF', price: 65, image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=600&h=600&fit=crop' },
    { id: '3', slug: 'mandala-floral', name: 'Mandala Floral', category: 'Bordado', price: 149, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=600&fit=crop', isBestseller: true },
    { id: '4', slug: 'tigre-realista', name: 'Tigre Realista', category: 'Transfer DTF', price: 120, image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&h=600&fit=crop' },
];

const categories = [
    { id: 'bordados', name: 'Bordados', count: 156, image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop' },
    { id: 'dtf', name: 'Transfer DTF', count: 89, image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&h=400&fit=crop' },
    { id: 'vinil', name: 'Corte Vinil', count: 64, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop' },
];

// Glassmorphism Navbar Component
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const cartCount = useCartStore((state) => state.items.length);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-inner">
                <Link href="/" className="logo">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M2 10h20" />
                        <path d="M6 16h4" />
                    </svg>
                    <span>Sellast</span>
                </Link>

                <nav className="nav">
                    <Link href="/productos">Catálogo</Link>
                    <Link href="/productos?cat=bordados">Bordados</Link>
                    <Link href="/productos?cat=dtf">DTF</Link>
                    <Link href="/productos?cat=vinil">Vinil</Link>
                </nav>

                <div className="actions">
                    <Link href="/carrito" className="cart-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </Link>
                    <Link href="/auth" className="login-btn">Acceder</Link>
                </div>
            </div>
        </header>
    );
}

// Product Card Component
function ProductCard({ id, slug, name, category, price, originalPrice, image, isNew, isBestseller }: any) {
    const addItem = useCartStore((state) => state.addItem);
    const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

    return (
        <Link href={`/productos/${slug}`} className="product-card">
            <div className="card-image">
                <img src={image} alt={name} loading="lazy" />
                {isNew && <span className="tag tag-new">Nuevo</span>}
                {isBestseller && <span className="tag tag-best">Popular</span>}
                {discount > 0 && <span className="tag tag-sale">-{discount}%</span>}
                <button
                    className="quick-add"
                    onClick={(e) => {
                        e.preventDefault();
                        addItem({ id, name, price, image, quantity: 1 });
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            </div>
            <div className="card-info">
                <span className="card-category">{category}</span>
                <h3>{name}</h3>
                <div className="card-price">
                    <span className="price">${price} MXN</span>
                    {originalPrice && <span className="original">${originalPrice}</span>}
                </div>
            </div>
        </Link>
    );
}

// Footer Component
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <div className="logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M2 10h20" />
                            <path d="M6 16h4" />
                        </svg>
                        <span>Sellast</span>
                    </div>
                    <p>Diseños digitales profesionales para bordado, DTF y vinil. México.</p>
                </div>
                <div className="footer-links">
                    <div className="footer-col">
                        <h4>Catálogo</h4>
                        <Link href="/productos">Todos</Link>
                        <Link href="/productos?cat=bordados">Bordados</Link>
                        <Link href="/productos?cat=dtf">DTF</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Cuenta</h4>
                        <Link href="/auth">Iniciar sesión</Link>
                        <Link href="/carrito">Carrito</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Empresa</h4>
                        <Link href="/auth">Portal POS</Link>
                        <Link href="/contacto">Contacto</Link>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} Sellast. Todos los derechos reservados.</span>
            </div>
        </footer>
    );
}

// Main Homepage
export default function HomePage() {
    return (
        <div className="store-dark">
            <Navbar />

            {/* HERO SECTION - Apple Dark Mode */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="hero-content">
                    <span className="hero-eyebrow">Nueva Colección 2026</span>
                    <h1 className="hero-title">
                        Diseños profesionales<br />
                        para tu negocio.
                    </h1>
                    <p className="hero-description">
                        Bordados, transfers DTF y cortes de vinil en formatos profesionales.
                        Descarga instantánea con licencia comercial.
                    </p>
                    <div className="hero-actions">
                        <Link href="/productos" className="btn-pill-white">
                            Explorar catálogo
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.5a.75.75 0 010 1.08l-5.5 5.5a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <Link href="/auth" className="btn-ghost">
                            Acceso POS
                        </Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=900&fit=crop" alt="Diseños" />
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="categories">
                <div className="container">
                    <h2 className="section-title">Explora por categoría</h2>
                    <div className="categories-grid">
                        {categories.map(cat => (
                            <Link href={`/productos?cat=${cat.id}`} key={cat.id} className="category-card">
                                <img src={cat.image} alt={cat.name} />
                                <div className="category-overlay">
                                    <h3>{cat.name}</h3>
                                    <span>{cat.count} diseños</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="featured">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Diseños destacados</h2>
                        <Link href="/productos" className="see-all">
                            Ver todos
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                    <div className="products-grid">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="features">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature">
                            <div className="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </div>
                            <h4>Descarga instantánea</h4>
                            <p>Recibe tus archivos al momento</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <h4>Múltiples formatos</h4>
                            <p>DST, PES, PNG, SVG y más</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h4>Licencia comercial</h4>
                            <p>Uso ilimitado en tus productos</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                            </div>
                            <h4>Soporte incluido</h4>
                            <p>Ayuda cuando la necesites</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta">
                <div className="cta-content">
                    <h2>¿Tienes un negocio de personalización?</h2>
                    <p>Accede al sistema POS profesional para gestionar ventas, inventario y clientes.</p>
                    <Link href="/auth" className="btn-pill-white">
                        Acceder al sistema
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                    </Link>
                </div>
            </section>

            <Footer />

            <style jsx>{`
                /* ========================================
                   APPLE DARK MODE DESIGN SYSTEM
                   ======================================== */
                
                .store-dark {
                    background: #000000;
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    color: #ffffff;
                    -webkit-font-smoothing: antialiased;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }
                
                /* NAVBAR - Glassmorphism */
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
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: saturate(180%) blur(20px);
                    -webkit-backdrop-filter: saturate(180%) blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
                    color: #ffffff;
                }
                
                .logo span {
                    font-size: 1.25rem;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                }
                
                .nav {
                    display: flex;
                    gap: 2rem;
                }
                
                .nav a {
                    color: rgba(255, 255, 255, 0.6);
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: color 0.3s;
                }
                
                .nav a:hover {
                    color: #ffffff;
                }
                
                .actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .cart-btn {
                    position: relative;
                    color: #ffffff;
                    padding: 0.5rem;
                    text-decoration: none;
                }
                
                .cart-btn .badge {
                    position: absolute;
                    top: 0;
                    right: 0;
                    min-width: 16px;
                    height: 16px;
                    background: #ffffff;
                    color: #000000;
                    font-size: 0.65rem;
                    font-weight: 600;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .login-btn {
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 980px;
                    color: #ffffff;
                    font-size: 0.875rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.3s;
                }
                
                .login-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                }
                
                /* HERO SECTION */
                .hero {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 8rem 2rem 4rem;
                    align-items: center;
                    position: relative;
                }
                
                .hero-bg {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15), transparent);
                    pointer-events: none;
                }
                
                .hero-content {
                    position: relative;
                    z-index: 1;
                }
                
                .hero-eyebrow {
                    display: inline-block;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.5);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1.5rem;
                }
                
                .hero-title {
                    font-size: clamp(2.5rem, 5.5vw, 4.5rem);
                    font-weight: 600;
                    line-height: 1.08;
                    letter-spacing: -0.03em;
                    color: #ffffff;
                    margin-bottom: 1.5rem;
                }
                
                .hero-description {
                    font-size: 1.25rem;
                    line-height: 1.5;
                    color: rgba(255, 255, 255, 0.6);
                    max-width: 480px;
                    margin-bottom: 2.5rem;
                }
                
                .hero-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                /* Apple Pill Button - White */
                .btn-pill-white {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.875rem 1.75rem;
                    background: #ffffff;
                    color: #000000;
                    border-radius: 980px;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.3s;
                }
                
                .btn-pill-white:hover {
                    background: rgba(255, 255, 255, 0.9);
                    transform: scale(1.02);
                    box-shadow: 0 8px 30px rgba(255, 255, 255, 0.15);
                }
                
                .btn-pill-white:active {
                    transform: scale(0.98);
                }
                
                .btn-pill-white svg {
                    transition: transform 0.3s;
                }
                
                .btn-pill-white:hover svg {
                    transform: translateX(3px);
                }
                
                /* Ghost Button */
                .btn-ghost {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.875rem 1.75rem;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.9375rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: color 0.3s;
                }
                
                .btn-ghost:hover {
                    color: #ffffff;
                }
                
                .hero-image {
                    position: relative;
                    height: 600px;
                    border-radius: 24px;
                    overflow: hidden;
                }
                
                .hero-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                /* CATEGORIES */
                .categories {
                    padding: 6rem 0;
                }
                
                .section-title {
                    font-size: 2rem;
                    font-weight: 600;
                    color: #ffffff;
                    margin-bottom: 2rem;
                    letter-spacing: -0.02em;
                }
                
                .categories-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }
                
                .category-card {
                    position: relative;
                    aspect-ratio: 16/10;
                    border-radius: 18px;
                    overflow: hidden;
                    text-decoration: none;
                }
                
                .category-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                
                .category-card:hover img {
                    transform: scale(1.08);
                }
                
                .category-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 1.5rem;
                }
                
                .category-overlay h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #ffffff;
                    margin-bottom: 0.25rem;
                }
                
                .category-overlay span {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.6);
                }
                
                /* FEATURED PRODUCTS */
                .featured {
                    padding: 4rem 0 6rem;
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                
                .see-all {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 500;
                    text-decoration: none;
                    transition: color 0.3s;
                }
                
                .see-all:hover {
                    color: #ffffff;
                }
                
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                }
                
                /* PRODUCT CARD */
                .product-card {
                    display: block;
                    text-decoration: none;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 18px;
                    overflow: hidden;
                    transition: all 0.4s ease;
                }
                
                .product-card:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(255, 255, 255, 0.15);
                    transform: translateY(-6px);
                }
                
                .card-image {
                    position: relative;
                    aspect-ratio: 1;
                    background: rgba(255, 255, 255, 0.02);
                    overflow: hidden;
                }
                
                .card-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                
                .product-card:hover .card-image img {
                    transform: scale(1.05);
                }
                
                .tag {
                    position: absolute;
                    top: 1rem;
                    left: 1rem;
                    padding: 0.35rem 0.75rem;
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                    border-radius: 6px;
                }
                
                .tag-new { background: rgba(255, 255, 255, 0.9); color: #000; }
                .tag-best { background: rgba(99, 102, 241, 0.9); color: #fff; }
                .tag-sale { background: rgba(239, 68, 68, 0.9); color: #fff; }
                
                .quick-add {
                    position: absolute;
                    bottom: 1rem;
                    right: 1rem;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 50%;
                    color: #000;
                    cursor: pointer;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.3s;
                }
                
                .product-card:hover .quick-add {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .quick-add:hover {
                    background: #ffffff;
                    transform: scale(1.1);
                }
                
                .card-info {
                    padding: 1.25rem;
                }
                
                .card-category {
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .card-info h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0.5rem 0;
                }
                
                .card-price {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .price {
                    font-weight: 600;
                    color: #ffffff;
                }
                
                .original {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.4);
                    text-decoration: line-through;
                }
                
                /* FEATURES */
                .features {
                    padding: 4rem 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }
                
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                }
                
                .feature {
                    text-align: center;
                }
                
                .feature-icon {
                    width: 56px;
                    height: 56px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    color: #ffffff;
                }
                
                .feature h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #ffffff;
                    margin-bottom: 0.5rem;
                }
                
                .feature p {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.5);
                }
                
                /* CTA */
                .cta {
                    padding: 6rem 2rem;
                    background: linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.08));
                }
                
                .cta-content {
                    max-width: 600px;
                    margin: 0 auto;
                    text-align: center;
                }
                
                .cta h2 {
                    font-size: 2rem;
                    font-weight: 600;
                    color: #ffffff;
                    margin-bottom: 1rem;
                }
                
                .cta p {
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 2rem;
                    font-size: 1.0625rem;
                }
                
                /* FOOTER */
                .footer {
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 4rem 2rem 2rem;
                }
                
                .footer-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    gap: 4rem;
                    margin-bottom: 3rem;
                }
                
                .footer-brand {
                    max-width: 280px;
                }
                
                .footer-brand .logo {
                    margin-bottom: 1rem;
                }
                
                .footer-brand p {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.875rem;
                    line-height: 1.6;
                }
                
                .footer-links {
                    display: flex;
                    gap: 4rem;
                }
                
                .footer-col h4 {
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: rgba(255, 255, 255, 0.5);
                    margin-bottom: 1rem;
                }
                
                .footer-col a {
                    display: block;
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    font-size: 0.875rem;
                    padding: 0.35rem 0;
                    transition: color 0.2s;
                }
                
                .footer-col a:hover {
                    color: #ffffff;
                }
                
                .footer-bottom {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    text-align: center;
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 0.8125rem;
                }
                
                /* RESPONSIVE */
                @media (max-width: 1024px) {
                    .hero { grid-template-columns: 1fr; text-align: center; min-height: auto; padding-top: 6rem; }
                    .hero-content { max-width: 600px; margin: 0 auto; }
                    .hero-description { margin-left: auto; margin-right: auto; }
                    .hero-actions { justify-content: center; }
                    .hero-image { height: 400px; order: -1; }
                    .categories-grid { grid-template-columns: 1fr; }
                    .products-grid { grid-template-columns: repeat(2, 1fr); }
                    .features-grid { grid-template-columns: repeat(2, 1fr); }
                }
                
                @media (max-width: 768px) {
                    .nav { display: none; }
                    .hero-title { font-size: 2rem; }
                    .products-grid { grid-template-columns: 1fr; }
                    .features-grid { grid-template-columns: 1fr; }
                    .footer-inner { flex-direction: column; gap: 2rem; }
                    .footer-links { flex-wrap: wrap; gap: 2rem; }
                }
            `}</style>
        </div>
    );
}
