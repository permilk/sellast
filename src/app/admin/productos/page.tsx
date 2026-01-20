// ============================================
// ADMIN - GESTIÓN DE PRODUCTOS
// ============================================

'use client';

import Link from 'next/link';
import { useState } from 'react';

// Datos de ejemplo
const productos = [
    { id: '1', sku: 'PROD-001', nombre: 'Bolso Premium Leather', categoria: 'Accesorios', precio: 1299, stock: 15, activo: true, imagen: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop' },
    { id: '2', sku: 'PROD-002', nombre: 'Reloj Clásico Dorado', categoria: 'Joyería', precio: 2499, stock: 8, activo: true, imagen: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&h=100&fit=crop' },
    { id: '3', sku: 'PROD-003', nombre: 'Zapatillas Urban Style', categoria: 'Calzado', precio: 1899, stock: 3, activo: true, imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' },
    { id: '4', sku: 'PROD-004', nombre: 'Lentes de Sol Aviator', categoria: 'Accesorios', precio: 799, stock: 25, activo: true, imagen: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop' },
    { id: '5', sku: 'PROD-005', nombre: 'Cartera Ejecutiva', categoria: 'Accesorios', precio: 650, stock: 0, activo: false, imagen: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop' },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(amount);
}

function getStockStatus(stock: number) {
    if (stock === 0) return { label: 'Sin stock', color: '#ef4444' };
    if (stock <= 5) return { label: 'Stock bajo', color: '#f59e0b' };
    return { label: 'Disponible', color: '#10b981' };
}

export default function ProductosPage() {
    const [busqueda, setBusqueda] = useState('');
    const [showModal, setShowModal] = useState(false);

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.sku.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="productos-page">
            <div className="page-header">
                <div>
                    <h1>Productos</h1>
                    <p>Gestiona el catálogo de productos</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Nuevo Producto
                </button>
            </div>

            {/* Filtros */}
            <div className="filters-bar">
                <input
                    type="search"
                    placeholder="Buscar por nombre, SKU o categoría..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Grid de Productos */}
            <div className="products-grid">
                {productosFiltrados.map((producto) => {
                    const stockStatus = getStockStatus(producto.stock);
                    return (
                        <div key={producto.id} className="product-card">
                            <div className="product-image">
                                <img src={producto.imagen} alt={producto.nombre} />
                                {!producto.activo && (
                                    <span className="inactive-badge">Inactivo</span>
                                )}
                            </div>
                            <div className="product-info">
                                <span className="product-sku">{producto.sku}</span>
                                <h3 className="product-name">{producto.nombre}</h3>
                                <span className="product-category">{producto.categoria}</span>
                                <div className="product-meta">
                                    <span className="product-price">{formatCurrency(producto.precio)}</span>
                                    <span
                                        className="product-stock"
                                        style={{ color: stockStatus.color }}
                                    >
                                        {producto.stock} uds • {stockStatus.label}
                                    </span>
                                </div>
                            </div>
                            <div className="product-actions">
                                <Link href={`/admin/productos/${producto.id}`} className="action-btn">
                                    ✏️ Editar
                                </Link>
                                <button className="action-btn danger">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal Nuevo Producto */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Nuevo Producto</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form className="modal-body">
                            <div className="form-group">
                                <label>SKU</label>
                                <input type="text" placeholder="PROD-XXX" />
                            </div>
                            <div className="form-group">
                                <label>Nombre del Producto</label>
                                <input type="text" placeholder="Ej: Bolso Premium Leather" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Precio</label>
                                    <input type="number" placeholder="0.00" />
                                </div>
                                <div className="form-group">
                                    <label>Stock Inicial</label>
                                    <input type="number" placeholder="0" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Categoría</label>
                                <select>
                                    <option value="">Seleccionar categoría</option>
                                    <option value="accesorios">Accesorios</option>
                                    <option value="calzado">Calzado</option>
                                    <option value="joyeria">Joyería</option>
                                    <option value="ropa">Ropa</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea rows={3} placeholder="Descripción del producto..." />
                            </div>
                            <div className="form-group">
                                <label>Imágenes</label>
                                <div className="upload-area">
                                    <span>📷</span>
                                    <p>Arrastra imágenes o haz clic para subir</p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Guardar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .productos-page {
                    max-width: 1400px;
                }
                
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                }
                
                .page-header h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin-bottom: 0.25rem;
                }
                
                .page-header p {
                    color: #64748b;
                }
                
                .btn-primary {
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(233, 69, 96, 0.3);
                }
                
                .filters-bar {
                    margin-bottom: 1.5rem;
                }
                
                .search-input {
                    width: 100%;
                    max-width: 400px;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 0.95rem;
                }
                
                .search-input:focus {
                    outline: none;
                    border-color: #e94560;
                }
                
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                
                .product-card {
                    background: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    transition: all 0.2s;
                }
                
                .product-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                
                .product-image {
                    position: relative;
                    height: 200px;
                    background: #f8fafc;
                }
                
                .product-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .inactive-badge {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    padding: 0.25rem 0.75rem;
                    background: #ef4444;
                    color: #fff;
                    font-size: 0.75rem;
                    font-weight: 600;
                    border-radius: 4px;
                }
                
                .product-info {
                    padding: 1.25rem;
                }
                
                .product-sku {
                    font-size: 0.75rem;
                    font-family: monospace;
                    color: #64748b;
                }
                
                .product-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1a1a2e;
                    margin: 0.25rem 0;
                }
                
                .product-category {
                    font-size: 0.85rem;
                    color: #64748b;
                }
                
                .product-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #e2e8f0;
                }
                
                .product-price {
                    font-size: 1.25rem;
                    font-weight: 700;
                    font-family: monospace;
                    color: #1a1a2e;
                }
                
                .product-stock {
                    font-size: 0.8rem;
                    font-weight: 500;
                }
                
                .product-actions {
                    display: flex;
                    gap: 0.5rem;
                    padding: 0 1.25rem 1.25rem;
                }
                
                .action-btn {
                    flex: 1;
                    padding: 0.6rem;
                    background: #f1f5f9;
                    border: none;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    cursor: pointer;
                    text-decoration: none;
                    text-align: center;
                    transition: all 0.2s;
                }
                
                .action-btn:hover {
                    background: #e2e8f0;
                }
                
                .action-btn.danger:hover {
                    background: #fee2e2;
                    color: #ef4444;
                }
                
                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .modal {
                    background: #fff;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                .modal-header h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1a1a2e;
                }
                
                .modal-close {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f1f5f9;
                    border: none;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                }
                
                .modal-body {
                    padding: 1.5rem;
                }
                
                .form-group {
                    margin-bottom: 1.25rem;
                }
                
                .form-group label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #1a1a2e;
                    margin-bottom: 0.5rem;
                }
                
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 0.95rem;
                }
                
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #e94560;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                
                .upload-area {
                    border: 2px dashed #e2e8f0;
                    border-radius: 8px;
                    padding: 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .upload-area:hover {
                    border-color: #e94560;
                    background: #fef2f2;
                }
                
                .upload-area span {
                    font-size: 2rem;
                }
                
                .upload-area p {
                    color: #64748b;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                }
                
                .modal-footer {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    padding-top: 1rem;
                    border-top: 1px solid #e2e8f0;
                    margin-top: 1rem;
                }
                
                .btn-secondary {
                    padding: 0.75rem 1.5rem;
                    background: #f1f5f9;
                    color: #1a1a2e;
                    border: none;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
