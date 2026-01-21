'use client';

// ============================================
// ADMIN - PRODUCTOS
// ============================================

import Link from 'next/link';
import { useState } from 'react';

// Datos actualizados: Bordados, DTF, Vinil
const productosIniciales = [
    { id: '1', sku: 'BOR-001', nombre: 'Rosa Elegante - Diseño de Bordado', categoria: 'Bordados', precio: 89, stock: 'Digital', status: 'activo', imagen: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop' },
    { id: '2', sku: 'DTF-001', nombre: 'Mariposa Monarca - Transfer DTF', categoria: 'DTF', precio: 65, stock: 150, status: 'activo', imagen: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400&h=400&fit=crop' },
    { id: '3', sku: 'VIN-001', nombre: 'Lettering Script - Corte Vinil', categoria: 'Vinil', precio: 45, stock: 50, status: 'activo', imagen: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop' },
    { id: '4', sku: 'BOR-002', nombre: 'Mandala Floral - Diseño de Bordado', categoria: 'Bordados', precio: 149, stock: 'Digital', status: 'activo', imagen: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop' },
    { id: '5', sku: 'DTF-002', nombre: 'Tigre Realista - Transfer DTF', categoria: 'DTF', precio: 120, stock: 80, status: 'inactivo', imagen: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=400&fit=crop' },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default function AdminProductosPage() {
    const [busqueda, setBusqueda] = useState('');
    const [productos, setProductos] = useState(productosIniciales);

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.sku.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            setProductos(productos.filter(p => p.id !== id));
        }
    };

    return (
        <div className="admin-products">
            <div className="page-header">
                <div>
                    <h1>Productos</h1>
                    <p>Gestiona tu catálogo de diseños y materiales</p>
                </div>
                <Link href="/admin/productos/nuevo" className="btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                    Nuevo Producto
                </Link>
            </div>

            <div className="filters-bar">
                <div className="search-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    <input
                        type="search"
                        placeholder="Buscar por nombre, SKU o categoría..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="filter-actions">
                    <button className="btn-filter">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>
                        Filtros
                    </button>
                    <button className="btn-export">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Exportar
                    </button>
                </div>
            </div>

            <div className="products-grid">
                {productosFiltrados.map(producto => (
                    <div key={producto.id} className="product-card">
                        <div className="product-image">
                            <img src={producto.imagen} alt={producto.nombre} />
                            <div className={`status-indicator ${producto.status}`}>
                                {producto.status === 'activo' ? 'Activo' : 'Inactivo'}
                            </div>
                        </div>
                        <div className="product-content">
                            <div className="product-header">
                                <span className="product-sku">{producto.sku}</span>
                                <div className="product-actions">
                                    <button className="action-btn edit" title="Editar">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDelete(producto.id)} title="Eliminar">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                    </button>
                                </div>
                            </div>
                            <h3 className="product-title">{producto.nombre}</h3>
                            <span className="product-category">{producto.categoria}</span>
                            <div className="product-footer">
                                <span className="product-price">{formatCurrency(producto.precio)}</span>
                                <span className="product-stock">
                                    {producto.stock === 'Digital' ?
                                        <span className="stock-digital">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                            Digital
                                        </span>
                                        :
                                        `${producto.stock} uds.`
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .admin-products { max-width: 1400px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.25rem; }
                .page-header p { color: #64748b; }
                
                .btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #e94560, #ff6b6b); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 12px rgba(233, 69, 96, 0.2); transition: all 0.2s; }
                .btn-primary:hover { transform: translateY(-2px); }
                
                .filters-bar { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; background: #fff; padding: 1rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .search-box { display: flex; align-items: center; gap: 0.75rem; background: #f8fafc; padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0; flex: 1; max-width: 400px; }
                .search-box input { border: none; background: none; width: 100%; outline: none; color: #1a1a2e; }
                .filter-actions { display: flex; gap: 0.75rem; }
                .btn-filter, .btn-export { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; color: #64748b; cursor: pointer; transition: all 0.2s; }
                .btn-filter:hover, .btn-export:hover { border-color: #94a3b8; color: #1a1a2e; }

                .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
                .product-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: all 0.2s; border: 1px solid #f1f5f9; }
                .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); border-color: #e2e8f0; }
                
                .product-image { height: 200px; position: relative; overflow: hidden; background: #f1f5f9; }
                .product-image img { width: 100%; height: 100%; object-fit: cover; }
                .status-indicator { position: absolute; top: 1rem; left: 1rem; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; background: rgba(255,255,255,0.9); }
                .status-indicator.activo { color: #10b981; }
                .status-indicator.inactivo { color: #94a3b8; }

                .product-content { padding: 1.25rem; }
                .product-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
                .product-sku { font-size: 0.75rem; color: #94a3b8; font-family: monospace; background: #f8fafc; padding: 0.15rem 0.5rem; border-radius: 4px; }
                
                .product-actions { display: flex; gap: 0.5rem; opacity: 0; transition: opacity 0.2s; }
                .product-card:hover .product-actions { opacity: 1; }
                .action-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; border-radius: 6px; cursor: pointer; background: #f1f5f9; color: #64748b; transition: all 0.2s; }
                .action-btn.edit:hover { background: #3b82f6; color: #fff; }
                .action-btn.delete:hover { background: #ef4444; color: #fff; }

                .product-title { font-size: 1rem; font-weight: 600; color: #1a1a2e; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .product-category { font-size: 0.8rem; color: #64748b; display: block; margin-bottom: 1rem; }
                
                .product-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #f1f5f9; }
                .product-price { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; }
                .product-stock { font-size: 0.85rem; color: #64748b; }
                .stock-digital { display: flex; align-items: center; gap: 0.25rem; color: #8b5cf6; background: rgba(139, 92, 246, 0.1); padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 500; }
            `}</style>
        </div>
    );
}
