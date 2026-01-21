'use client';

// ============================================
// TIENDA - DETALLE DE PRODUCTO
// ============================================

import Link from 'next/link';
import { useState, use } from 'react';

interface PageProps {
    params: Promise<{ slug: string }>;
}

const productoData = {
    id: '1',
    nombre: 'Rosa Elegante - Diseño de Bordado',
    descripcion: 'Hermoso diseño de rosa con detalles realistas, perfecto para playeras, bolsas y decoración textil. Incluye múltiples formatos compatibles con las principales marcas de bordadoras.',
    precio: 89,
    precioAnterior: 129,
    categoria: 'Bordados',
    imagenes: [
        'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&h=600&fit=crop',
    ],
    formatos: ['DST (Tajima)', 'PES (Brother)', 'JEF (Janome)', 'EXP (Melco)', 'VP3 (Pfaff)'],
    medidas: { ancho: '10 cm', alto: '12 cm', puntadas: '15,432' },
    incluye: ['Archivo de bordado en 5 formatos', 'Archivo PDF con instrucciones', 'Imagen PNG de referencia', 'Soporte técnico por email'],
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default function ProductoDetallePage({ params }: PageProps) {
    const { slug } = use(params);
    const [imagenActiva, setImagenActiva] = useState(0);
    const [cantidad, setCantidad] = useState(1);

    const handleAddToCart = () => {
        alert(`${productoData.nombre} x${cantidad} agregado al carrito`);
    };

    return (
        <div className="producto-page">
            {/* Header */}
            <header className="store-header">
                <div className="header-container">
                    <Link href="/" className="logo">Sell<span>ast</span></Link>
                    <nav className="nav-links">
                        <Link href="/productos">Catálogo</Link>
                        <Link href="/productos?cat=bordados">Bordados</Link>
                        <Link href="/productos?cat=dtf">DTF</Link>
                        <Link href="/productos?cat=vinil">Vinil</Link>
                    </nav>
                    <Link href="/carrito" className="cart-btn">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <span className="cart-count">0</span>
                    </Link>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link href="/">Inicio</Link> / <Link href="/productos">Productos</Link> / <span>{productoData.nombre}</span>
            </div>

            {/* Producto */}
            <div className="producto-container">
                {/* Galería */}
                <div className="producto-galeria">
                    <div className="imagen-principal">
                        <img src={productoData.imagenes[imagenActiva]} alt={productoData.nombre} />
                        <span className="descuento-badge">-31%</span>
                    </div>
                    <div className="imagenes-thumbs">
                        {productoData.imagenes.map((img, i) => (
                            <button key={i} className={`thumb ${imagenActiva === i ? 'active' : ''}`} onClick={() => setImagenActiva(i)}>
                                <img src={img} alt="" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="producto-info">
                    <span className="producto-categoria">{productoData.categoria}</span>
                    <h1>{productoData.nombre}</h1>

                    <div className="producto-precios">
                        <span className="precio-actual">{formatCurrency(productoData.precio)}</span>
                        {productoData.precioAnterior && (
                            <span className="precio-anterior">{formatCurrency(productoData.precioAnterior)}</span>
                        )}
                    </div>

                    <p className="producto-descripcion">{productoData.descripcion}</p>

                    {/* Especificaciones */}
                    <div className="especificaciones">
                        <h3>Especificaciones</h3>
                        <div className="specs-grid">
                            <div className="spec"><span>Ancho</span><strong>{productoData.medidas.ancho}</strong></div>
                            <div className="spec"><span>Alto</span><strong>{productoData.medidas.alto}</strong></div>
                            <div className="spec"><span>Puntadas</span><strong>{productoData.medidas.puntadas}</strong></div>
                        </div>
                    </div>

                    {/* Formatos */}
                    <div className="formatos">
                        <h3>Formatos Incluidos</h3>
                        <div className="formatos-tags">
                            {productoData.formatos.map((f, i) => (
                                <span key={i} className="formato-tag">{f}</span>
                            ))}
                        </div>
                    </div>

                    {/* Agregar al carrito */}
                    <div className="add-to-cart">
                        <div className="cantidad-selector">
                            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</button>
                            <span>{cantidad}</span>
                            <button onClick={() => setCantidad(cantidad + 1)}>+</button>
                        </div>
                        <button className="btn-add-cart" onClick={handleAddToCart}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            Agregar al Carrito
                        </button>
                    </div>

                    {/* Incluye */}
                    <div className="incluye">
                        <h3>Este producto incluye</h3>
                        <ul>
                            {productoData.incluye.map((item, i) => (
                                <li key={i}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .producto-page { min-height: 100vh; background: #f8fafc; }
                .store-header { background: #1a1a2e; padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; }
                .header-container { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
                .logo { font-size: 1.5rem; font-weight: 700; color: #fff; text-decoration: none; }
                .logo span { color: #e94560; }
                .nav-links { display: flex; gap: 2rem; }
                .nav-links a { color: rgba(255,255,255,0.8); text-decoration: none; }
                .cart-btn { position: relative; color: #fff; text-decoration: none; }
                .cart-count { position: absolute; top: -8px; right: -8px; background: #e94560; color: #fff; font-size: 0.7rem; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                
                .breadcrumb { max-width: 1200px; margin: 0 auto; padding: 1.5rem 2rem; font-size: 0.9rem; color: #64748b; }
                .breadcrumb a { color: #64748b; text-decoration: none; }
                .breadcrumb a:hover { color: #e94560; }
                .breadcrumb span { color: #1a1a2e; }
                
                .producto-container { max-width: 1200px; margin: 0 auto; padding: 0 2rem 4rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
                
                .imagen-principal { position: relative; border-radius: 16px; overflow: hidden; background: #fff; }
                .imagen-principal img { width: 100%; aspect-ratio: 1; object-fit: cover; }
                .descuento-badge { position: absolute; top: 1rem; left: 1rem; background: #e94560; color: #fff; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; }
                .imagenes-thumbs { display: flex; gap: 0.75rem; margin-top: 1rem; }
                .thumb { width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 2px solid transparent; cursor: pointer; padding: 0; }
                .thumb.active { border-color: #e94560; }
                .thumb img { width: 100%; height: 100%; object-fit: cover; }
                
                .producto-categoria { display: inline-block; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #e94560; font-weight: 600; margin-bottom: 0.5rem; }
                .producto-info h1 { font-size: 2rem; font-weight: 700; color: #1a1a2e; margin-bottom: 1rem; line-height: 1.2; }
                .producto-precios { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
                .precio-actual { font-size: 2rem; font-weight: 700; color: #1a1a2e; }
                .precio-anterior { font-size: 1.25rem; color: #94a3b8; text-decoration: line-through; }
                .producto-descripcion { color: #64748b; line-height: 1.7; margin-bottom: 2rem; }
                
                .especificaciones, .formatos, .incluye { margin-bottom: 2rem; }
                .producto-info h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 1rem; }
                .specs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
                .spec { background: #fff; padding: 1rem; border-radius: 8px; text-align: center; }
                .spec span { display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem; }
                .spec strong { font-size: 1.1rem; color: #1a1a2e; }
                .formatos-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .formato-tag { background: #e2e8f0; color: #374151; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; }
                
                .add-to-cart { display: flex; gap: 1rem; margin-bottom: 2rem; }
                .cantidad-selector { display: flex; align-items: center; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
                .cantidad-selector button { width: 44px; height: 44px; border: none; background: none; font-size: 1.25rem; cursor: pointer; color: #374151; }
                .cantidad-selector span { width: 44px; text-align: center; font-weight: 600; }
                .btn-add-cart { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 1rem 2rem; background: linear-gradient(135deg, #e94560, #ff6b6b); color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .btn-add-cart:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(233, 69, 96, 0.3); }
                
                .incluye ul { list-style: none; padding: 0; }
                .incluye li { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; color: #374151; }
                
                @media (max-width: 768px) {
                    .producto-container { grid-template-columns: 1fr; gap: 2rem; }
                    .nav-links { display: none; }
                }
            `}</style>
        </div>
    );
}
