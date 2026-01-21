'use client';

// ============================================
// TIENDA - CATÁLOGO DE PRODUCTOS
// ============================================

import Link from 'next/link';
import { useState } from 'react';

const categorias = [
    { id: 'todos', nombre: 'Todos', icono: '🎨' },
    { id: 'bordados', nombre: 'Bordados', icono: '🧵' },
    { id: 'dtf', nombre: 'DTF', icono: '🖨️' },
    { id: 'vinil', nombre: 'Vinil', icono: '✂️' },
];

const productos = [
    { id: '1', slug: 'rosa-elegante-bordado', nombre: 'Rosa Elegante - Diseño Bordado', categoria: 'bordados', precio: 89, precioAnterior: 129, imagen: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop', badge: 'Popular' },
    { id: '2', slug: 'mariposa-monarca-dtf', nombre: 'Mariposa Monarca - Transfer DTF', categoria: 'dtf', precio: 65, imagen: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400&h=400&fit=crop' },
    { id: '3', slug: 'lettering-script-vinil', nombre: 'Lettering Script - Corte Vinil', categoria: 'vinil', precio: 45, imagen: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop' },
    { id: '4', slug: 'mandala-floral-bordado', nombre: 'Mandala Floral - Diseño Bordado', categoria: 'bordados', precio: 149, precioAnterior: 199, imagen: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop', badge: 'Nuevo' },
    { id: '5', slug: 'tigre-realista-dtf', nombre: 'Tigre Realista - Transfer DTF', categoria: 'dtf', precio: 120, imagen: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=400&fit=crop' },
    { id: '6', slug: 'corazon-geometrico-vinil', nombre: 'Corazón Geométrico - Vinil', categoria: 'vinil', precio: 35, imagen: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop' },
    { id: '7', slug: 'aguila-mexicana-bordado', nombre: 'Águila Mexicana - Bordado', categoria: 'bordados', precio: 189, imagen: 'https://images.unsplash.com/photo-1557401620-67270b61ea82?w=400&h=400&fit=crop' },
    { id: '8', slug: 'flor-acuarela-dtf', nombre: 'Flor Acuarela - DTF Full Color', categoria: 'dtf', precio: 75, precioAnterior: 95, imagen: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop', badge: '-20%' },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default function ProductosPage() {
    const [categoriaActiva, setCategoriaActiva] = useState('todos');
    const [ordenar, setOrdenar] = useState('relevancia');

    const productosFiltrados = productos.filter(p =>
        categoriaActiva === 'todos' || p.categoria === categoriaActiva
    );

    return (
        <div className="productos-page">
            {/* Header */}
            <header className="store-header">
                <div className="header-container">
                    <Link href="/" className="logo">
                        Sell<span>ast</span>
                    </Link>
                    <nav className="nav-links">
                        <Link href="/productos">Catálogo</Link>
                        <Link href="/productos?cat=bordados">Bordados</Link>
                        <Link href="/productos?cat=dtf">DTF</Link>
                        <Link href="/productos?cat=vinil">Vinil</Link>
                    </nav>
                    <div className="header-actions">
                        <Link href="/carrito" className="cart-btn">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <span className="cart-count">0</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="catalog-hero">
                <h1>Diseños Profesionales</h1>
                <p>Bordados, DTF y Corte de Vinil para tu negocio</p>
            </section>

            {/* Filtros */}
            <div className="catalog-container">
                <aside className="filters-sidebar">
                    <h3>Categorías</h3>
                    <ul className="category-list">
                        {categorias.map(cat => (
                            <li key={cat.id}>
                                <button
                                    className={`cat-btn ${categoriaActiva === cat.id ? 'active' : ''}`}
                                    onClick={() => setCategoriaActiva(cat.id)}
                                >
                                    <span>{cat.icono}</span>
                                    {cat.nombre}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <h3>Formato</h3>
                    <ul className="format-list">
                        <li><label><input type="checkbox" defaultChecked /> DST (Tajima)</label></li>
                        <li><label><input type="checkbox" defaultChecked /> PES (Brother)</label></li>
                        <li><label><input type="checkbox" defaultChecked /> PNG Transparente</label></li>
                        <li><label><input type="checkbox" defaultChecked /> SVG Vector</label></li>
                    </ul>
                </aside>

                <main className="products-main">
                    <div className="products-header">
                        <span className="results-count">{productosFiltrados.length} diseños</span>
                        <select value={ordenar} onChange={e => setOrdenar(e.target.value)}>
                            <option value="relevancia">Más relevantes</option>
                            <option value="precio-asc">Precio: menor a mayor</option>
                            <option value="precio-desc">Precio: mayor a menor</option>
                            <option value="nuevo">Más recientes</option>
                        </select>
                    </div>

                    <div className="products-grid">
                        {productosFiltrados.map(producto => (
                            <Link href={`/productos/${producto.slug}`} key={producto.id} className="product-card">
                                <div className="product-image">
                                    <img src={producto.imagen} alt={producto.nombre} />
                                    {producto.badge && (
                                        <span className="product-badge">{producto.badge}</span>
                                    )}
                                    <button className="quick-add" onClick={e => { e.preventDefault(); alert(`${producto.nombre} agregado al carrito`); }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                        </svg>
                                        Agregar
                                    </button>
                                </div>
                                <div className="product-info">
                                    <span className="product-category">{categorias.find(c => c.id === producto.categoria)?.nombre}</span>
                                    <h3>{producto.nombre}</h3>
                                    <div className="product-prices">
                                        <span className="price">{formatCurrency(producto.precio)}</span>
                                        {producto.precioAnterior && (
                                            <span className="price-old">{formatCurrency(producto.precioAnterior)}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>

            <style jsx>{`
                .productos-page { min-height: 100vh; background: #f8fafc; }
                .store-header { background: #1a1a2e; padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; }
                .header-container { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
                .logo { font-size: 1.5rem; font-weight: 700; color: #fff; text-decoration: none; }
                .logo span { color: #e94560; }
                .nav-links { display: flex; gap: 2rem; }
                .nav-links a { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.95rem; transition: color 0.2s; }
                .nav-links a:hover { color: #fff; }
                .cart-btn { position: relative; color: #fff; background: none; border: none; cursor: pointer; padding: 0.5rem; }
                .cart-count { position: absolute; top: -4px; right: -4px; background: #e94560; color: #fff; font-size: 0.7rem; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                
                .catalog-hero { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 4rem 2rem; text-align: center; }
                .catalog-hero h1 { font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
                .catalog-hero p { color: rgba(255,255,255,0.7); font-size: 1.1rem; }
                
                .catalog-container { max-width: 1400px; margin: 0 auto; padding: 2rem; display: grid; grid-template-columns: 250px 1fr; gap: 2rem; }
                
                .filters-sidebar { background: #fff; padding: 1.5rem; border-radius: 12px; height: fit-content; position: sticky; top: 100px; }
                .filters-sidebar h3 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 1rem; }
                .category-list { list-style: none; padding: 0; margin: 0 0 2rem 0; }
                .cat-btn { display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.75rem 1rem; background: none; border: none; border-radius: 8px; cursor: pointer; font-size: 0.95rem; color: #374151; transition: all 0.2s; text-align: left; }
                .cat-btn:hover { background: #f1f5f9; }
                .cat-btn.active { background: #fef2f2; color: #e94560; font-weight: 600; }
                .format-list { list-style: none; padding: 0; }
                .format-list li { padding: 0.5rem 0; }
                .format-list label { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-size: 0.9rem; color: #374151; }
                .format-list input { accent-color: #e94560; }
                
                .products-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .results-count { font-size: 0.95rem; color: #64748b; }
                .products-header select { padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 6px; }
                
                .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
                .product-card { background: #fff; border-radius: 12px; overflow: hidden; text-decoration: none; transition: all 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
                .product-image { position: relative; aspect-ratio: 1; overflow: hidden; }
                .product-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
                .product-card:hover .product-image img { transform: scale(1.05); }
                .product-badge { position: absolute; top: 0.75rem; left: 0.75rem; background: #e94560; color: #fff; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
                .quick-add { position: absolute; bottom: 0.75rem; right: 0.75rem; display: flex; align-items: center; gap: 0.5rem; background: #fff; color: #1a1a2e; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; border: none; cursor: pointer; opacity: 0; transform: translateY(10px); transition: all 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
                .product-card:hover .quick-add { opacity: 1; transform: translateY(0); }
                .quick-add:hover { background: #e94560; color: #fff; }
                .product-info { padding: 1.25rem; }
                .product-category { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #e94560; font-weight: 600; }
                .product-info h3 { font-size: 1rem; font-weight: 600; color: #1a1a2e; margin: 0.5rem 0; line-height: 1.4; }
                .product-prices { display: flex; align-items: center; gap: 0.75rem; }
                .price { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; }
                .price-old { font-size: 0.9rem; color: #94a3b8; text-decoration: line-through; }
                
                @media (max-width: 768px) {
                    .catalog-container { grid-template-columns: 1fr; }
                    .filters-sidebar { position: static; }
                    .nav-links { display: none; }
                }
            `}</style>
        </div>
    );
}
