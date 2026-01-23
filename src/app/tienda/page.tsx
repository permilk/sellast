'use client';

// ============================================
// SELLAST TIENDA VIRTUAL - APPLE DARK MODE
// ============================================

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';

const featuredProducts = [
    { id: '1', slug: 'rosa-elegante', name: 'Rosa Elegante', category: 'Bordado', price: 89, originalPrice: 129, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop', isNew: true },
    { id: '2', slug: 'mariposa-monarca', name: 'Mariposa Monarca', category: 'Transfer DTF', price: 65, image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=600&h=600&fit=crop' },
    { id: '3', slug: 'mandala-floral', name: 'Mandala Floral', category: 'Bordado', price: 149, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=600&fit=crop', isBestseller: true },
    { id: '4', slug: 'tigre-realista', name: 'Tigre Realista', category: 'Transfer DTF', price: 120, image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&h=600&fit=crop' },
    { id: '5', slug: 'aguila-mexicana', name: 'Águila Mexicana', category: 'Bordado', price: 189, image: 'https://images.unsplash.com/photo-1557401620-67270b61ea82?w=600&h=600&fit=crop' },
    { id: '6', slug: 'flor-acuarela', name: 'Flor Acuarela', category: 'DTF Full Color', price: 75, originalPrice: 95, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop' },
    { id: '7', slug: 'lettering-script', name: 'Lettering Script', category: 'Corte Vinil', price: 45, image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&h=600&fit=crop' },
    { id: '8', slug: 'corazon-geometrico', name: 'Corazón Geométrico', category: 'Vinil', price: 35, image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=600&fit=crop', isNew: true },
];

const categories = [
    { id: 'bordados', name: 'Bordados', count: 156, image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop', description: 'Diseños digitalizados para máquinas de bordar' },
    { id: 'dtf', name: 'Transfer DTF', count: 89, image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&h=400&fit=crop', description: 'Transfers listos para planchar en textiles' },
    { id: 'vinil', name: 'Corte Vinil', count: 64, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop', description: 'Archivos vectoriales para corte' },
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
                    <Link href="/tienda">Tienda</Link>
                    <Link href="/productos">Catálogo</Link>
                    <Link href="/productos?cat=bordados">Bordados</Link>
                    <Link href="/productos?cat=dtf">DTF</Link>
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
                    <Link href="/admin" className="login-btn">Sistema POS</Link>
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
        <div className="product-card">
            <Link href={`/productos/${slug}`} className="card-link">
                <div className="card-image">
                    <img src={image} alt={name} loading="lazy" />
                    {isNew && <span className="tag tag-new">Nuevo</span>}
                    {isBestseller && <span className="tag tag-best">Popular</span>}
                    {discount > 0 && <span className="tag tag-sale">-{discount}%</span>}
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
            <button
                className="add-to-cart-btn"
                onClick={() => addItem({ id, name, price, image, quantity: 1 })}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Agregar al carrito
            </button>
        </div>
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
                        <h4>Tienda</h4>
                        <Link href="/tienda">Todos los productos</Link>
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
                        <Link href="/admin">Portal POS</Link>
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

// Main Store Page
export default function TiendaPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredProducts = selectedCategory
        ? featuredProducts.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()))
        : featuredProducts;

    return (
        <div className="store-dark">
            <Navbar />

            {/* HERO SECTION */}
            <section className="hero-store">
                <div className="hero-bg" />
                <div className="hero-content">
                    <span className="hero-eyebrow">Tienda Virtual</span>
                    <h1 className="hero-title">
                        Explora nuestra<br />
                        colección completa.
                    </h1>
                    <p className="hero-description">
                        Encuentra diseños profesionales para bordado, DTF y vinil.
                        Descarga instantánea y licencia comercial incluida.
                    </p>
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">300+</span>
                            <span className="stat-label">Diseños</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">5</span>
                            <span className="stat-label">Formatos</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Descarga</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES SECTION */}
            <section className="categories-section">
                <div className="container">
                    <h2 className="section-title">Categorías</h2>
                    <div className="categories-grid">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-card ${selectedCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                            >
                                <img src={cat.image} alt={cat.name} />
                                <div className="category-overlay">
                                    <h3>{cat.name}</h3>
                                    <span>{cat.count} diseños</span>
                                    <p className="category-desc">{cat.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRODUCTS GRID */}
            <section className="products-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            {selectedCategory ? `Categoría: ${categories.find(c => c.id === selectedCategory)?.name}` : 'Todos los productos'}
                        </h2>
                        {selectedCategory && (
                            <button className="clear-filter" onClick={() => setSelectedCategory(null)}>
                                Ver todos
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className="productos-grid">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                    <div className="see-more">
                        <Link href="/productos" className="btn-see-all">
                            Ver catálogo completo
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
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
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                </svg>
                            </div>
                            <h4>Pago seguro</h4>
                            <p>MercadoPago y tarjetas</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx>{`
                /* ========================================
                   APPLE DARK MODE DESIGN SYSTEM - TIENDA
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
                
                /* HERO STORE */
                .hero-store {
                    min-height: 60vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 8rem 2rem 4rem;
                    position: relative;
                }
                
                .hero-bg {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.2), transparent);
                    pointer-events: none;
                }
                
                .hero-content {
                    position: relative;
                    z-index: 1;
                    max-width: 800px;
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
                    font-size: clamp(2.5rem, 5.5vw, 4rem);
                    font-weight: 600;
                    line-height: 1.1;
                    letter-spacing: -0.03em;
                    color: #ffffff;
                    margin-bottom: 1.5rem;
                }
                
                .hero-description {
                    font-size: 1.25rem;
                    line-height: 1.5;
                    color: rgba(255, 255, 255, 0.6);
                    max-width: 600px;
                    margin: 0 auto 2.5rem;
                }
                
                .hero-stats {
                    display: flex;
                    justify-content: center;
                    gap: 4rem;
                }
                
                .stat {
                    text-align: center;
                }
                
                .stat-number {
                    display: block;
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #ffffff;
                }
                
                .stat-label {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.5);
                }
                
                /* CATEGORIES */
                .categories-section {
                    padding: 4rem 0;
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
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: all 0.3s;
                    background: none;
                    padding: 0;
                }
                
                .category-card.active {
                    border-color: #ffffff;
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
                    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 1.5rem;
                    text-align: left;
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
                
                .category-desc {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin-top: 0.5rem;
                }
                
                /* PRODUCTS SECTION */
                .products-section {
                    padding: 4rem 0 6rem;
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                
                .clear-filter {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #fff;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: all 0.3s;
                }
                
                .clear-filter:hover {
                    background: rgba(255, 255, 255, 0.15);
                }
                
                .productos-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                }
                
                /* PRODUCT CARD */
                .product-card {
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
                
                .card-link {
                    display: block;
                    text-decoration: none;
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
                
                .add-to-cart-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    width: calc(100% - 1.5rem);
                    margin: 0 0.75rem 0.75rem;
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    color: #fff;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .add-to-cart-btn:hover {
                    background: #ffffff;
                    color: #000000;
                    border-color: #ffffff;
                }
                
                .see-more {
                    margin-top: 3rem;
                    text-align: center;
                }
                
                .btn-see-all {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem 2rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 980px;
                    color: #ffffff;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.3s;
                }
                
                .btn-see-all:hover {
                    background: rgba(255, 255, 255, 0.15);
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
                
                /* FOOTER */
                .footer {
                    padding: 4rem 0 2rem;
                    background: rgba(255, 255, 255, 0.02);
                }
                
                .footer-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 4rem;
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
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                }
                
                .footer-col h4 {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1rem;
                }
                
                .footer-col a {
                    display: block;
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    font-size: 0.875rem;
                    padding: 0.25rem 0;
                    transition: color 0.3s;
                }
                
                .footer-col a:hover {
                    color: #ffffff;
                }
                
                .footer-bottom {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    margin-top: 2rem;
                    text-align: center;
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 0.875rem;
                }
                
                /* RESPONSIVE */
                @media (max-width: 1024px) {
                    .productos-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .features-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                @media (max-width: 768px) {
                    .nav { display: none; }
                    .hero-stats { gap: 2rem; }
                    .categories-grid { grid-template-columns: 1fr; }
                    .productos-grid { grid-template-columns: repeat(2, 1fr); }
                    .footer-inner { grid-template-columns: 1fr; gap: 2rem; }
                    .footer-links { grid-template-columns: repeat(2, 1fr); }
                }
                
                @media (max-width: 480px) {
                    .productos-grid { grid-template-columns: 1fr; }
                    .features-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
