'use client';

// ============================================
// POS SALES PAGE - PUNTO DE VENTA PREMIUM
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { processSaleAction, searchProductsAction } from './actions/pos.actions';
import AddToCartModal from './components/AddToCartModal';
import './pos-styles.css';

// Mock products for grid display
const mockProducts = [
    { id: '1', name: 'Whisky JackDaniels', sku: 'WJD-001', price: 85.00, stock: 24, category: 'Licor', image: '' },
    { id: '2', name: 'Vodka Absolut', sku: 'VA-001', price: 75.00, stock: 18, category: 'Licor', image: '' },
    { id: '3', name: 'CocaCola', sku: 'CC-001', price: 18.00, stock: 48, category: 'Gaseosa', image: '' },
    { id: '4', name: 'Agua San 1Lt', sku: 'AS-001', price: 7.00, stock: 100, category: 'Aguas', image: '' },
    { id: '5', name: 'Pisco Suerño', sku: 'PS-001', price: 10.00, stock: 36, category: 'Licor', image: '' },
    { id: '6', name: 'Preparado', sku: 'PR-001', price: 107.00, stock: 12, category: 'Complementos', image: '' },
    { id: '7', name: 'Tarro de leche gloria', sku: 'TL-001', price: 3.50, stock: 60, category: 'Tienda', image: '' },
    { id: '8', name: 'Pomarola', sku: 'PM-001', price: 7.00, stock: 40, category: 'Tienda', image: '' },
];

const categories = ['Todos', 'Aguas', 'Complementos', 'Gaseosa', 'Licor', 'Tienda'];

export default function POSSalesPage() {
    const router = useRouter();
    const [busqueda, setBusqueda] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todos');
    const [carrito, setCarrito] = useState<any[]>([]);
    const [descuento, setDescuento] = useState(0);
    const [loadingPay, setLoadingPay] = useState(false);
    const [cliente, setCliente] = useState('general');

    // Modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // Filter products
    const filteredProducts = mockProducts.filter(prod => {
        const matchesSearch = prod.name.toLowerCase().includes(busqueda.toLowerCase()) ||
            prod.sku?.toLowerCase().includes(busqueda.toLowerCase());
        const matchesCategory = categoryFilter === 'Todos' || prod.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleProductClick = (product: any) => {
        setSelectedProduct(product);
        setShowAddModal(true);
    };

    const handleAddToCart = (product: any, quantity: number, customPrice: number) => {
        const existente = carrito.find(item => item.id === product.id);
        if (existente) {
            setCarrito(carrito.map(item =>
                item.id === product.id
                    ? { ...item, cantidad: item.cantidad + quantity, price: customPrice }
                    : item
            ));
        } else {
            setCarrito([...carrito, { ...product, cantidad: quantity, price: customPrice }]);
        }
    };

    const updateQty = (id: string, delta: number) => {
        setCarrito(carrito.map(item => {
            if (item.id === id) {
                const nuevaCant = item.cantidad + delta;
                return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : item;
            }
            return item;
        }));
    };

    const removeFromCart = (id: string) => {
        setCarrito(carrito.filter(item => item.id !== id));
    };

    const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
    const igv = subtotal * 0.18;
    const total = subtotal - descuento;

    const handlePay = async () => {
        if (carrito.length === 0) return;
        setLoadingPay(true);

        const result = await processSaleAction({
            items: carrito.map(i => ({ id: i.id, price: i.price, quantity: i.cantidad })),
            total,
            subtotal,
            discount: descuento,
            paymentMethod: 'CASH'
        });

        if (result.success) {
            alert('¡Venta realizada con éxito!');
            setCarrito([]);
            setDescuento(0);
        } else {
            alert('Error: ' + result.error);
        }
        setLoadingPay(false);
    };

    return (
        <div className="pos-module" style={{ padding: 0 }}>

            {/* Main Content */}
            <div style={{ padding: '1.25rem', background: '#f1f5f9', height: 'calc(100vh - 60px)' }}>
                <div className="pos-sales-layout">
                    {/* LEFT: Products Panel */}
                    <div className="pos-products-panel">
                        {/* Header */}
                        <div className="pos-products-header">
                            <div className="pos-products-title">
                                <h2>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                        <line x1="1" y1="10" x2="23" y2="10" />
                                    </svg>
                                    Punto de Venta
                                </h2>
                                <div className="pos-header-actions">
                                    <button className="btn-pos btn-pos-cyan">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="16" />
                                            <line x1="8" y1="12" x2="16" y2="12" />
                                        </svg>
                                        Gastos
                                    </button>
                                    <button className="btn-pos btn-pos-rose" onClick={() => {
                                        localStorage.removeItem('sellast_admin_session');
                                        router.push('/');
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                        Cerrar Turno
                                    </button>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '-0.5rem' }}>
                                Registra tus ventas de manera rápida e intuitiva
                            </p>

                            {/* Search Bar */}
                            <div className="pos-search-bar">
                                <div className="pos-search-input">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.35-4.35" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Buscar producto por nombre, código o escanear..."
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category Tabs */}
                        <div className="pos-category-tabs">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`category-tab ${categoryFilter === cat ? 'active' : ''}`}
                                    onClick={() => setCategoryFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Products Grid */}
                        <div className="pos-products-grid">
                            {filteredProducts.map(prod => (
                                <div
                                    key={prod.id}
                                    className="product-tile"
                                    onClick={() => handleProductClick(prod)}
                                >
                                    <div className="product-tile-image">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                    <div className="product-tile-name">{prod.name}</div>
                                    <div className="product-tile-price">S/ {prod.price.toFixed(2)}</div>
                                    <div className="product-tile-category">{prod.category}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Cart Panel - Redesigned */}
                    <div className="pos-cart-panel" style={{
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'fit-content',
                        maxHeight: 'calc(100vh - 140px)'
                    }}>
                        {/* Cart Header - Blue */}
                        <div style={{
                            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                            color: 'white',
                            padding: '1rem 1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem', fontStyle: 'italic' }}>Carrito de Compra</span>
                        </div>

                        {/* Cliente Section */}
                        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'block' }}>Cliente</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select
                                    value={cliente}
                                    onChange={(e) => setCliente(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem 1rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        color: '#374151',
                                        background: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="general">Cliente General</option>
                                    <option value="nuevo">+ Nuevo Cliente</option>
                                </select>
                                <button style={{
                                    width: '42px',
                                    height: '42px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    background: '#fff',
                                    color: '#3B82F6',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>+</button>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '1rem 1.25rem',
                            maxHeight: '280px'
                        }}>
                            {carrito.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#9ca3af' }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: '0.5rem' }}>
                                        <circle cx="9" cy="21" r="1" />
                                        <circle cx="20" cy="21" r="1" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                    </svg>
                                    <p style={{ margin: 0, fontWeight: 500 }}>Carrito vacío</p>
                                    <span style={{ fontSize: '0.85rem' }}>Agrega productos para comenzar</span>
                                </div>
                            ) : (
                                carrito.map(item => (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.75rem',
                                        padding: '1rem 0',
                                        borderBottom: '1px solid #f3f4f6',
                                        borderLeft: '3px solid #3B82F6',
                                        paddingLeft: '1rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '0.35rem' }}>{item.name}</div>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                background: '#10B981',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                                                Unidad
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                                                <button onClick={() => updateQty(item.id, -1)} style={{
                                                    width: '28px', height: '28px', border: '1px solid #e5e7eb', borderRadius: '4px',
                                                    background: '#fff', cursor: 'pointer', fontSize: '1rem', color: '#6b7280'
                                                }}>−</button>
                                                <input
                                                    type="text"
                                                    value={item.cantidad}
                                                    readOnly
                                                    style={{
                                                        width: '40px', textAlign: 'center', border: '1px solid #e5e7eb',
                                                        borderRadius: '4px', padding: '0.25rem', fontSize: '0.9rem'
                                                    }}
                                                />
                                                <button onClick={() => updateQty(item.id, 1)} style={{
                                                    width: '28px', height: '28px', border: '1px solid #e5e7eb', borderRadius: '4px',
                                                    background: '#fff', cursor: 'pointer', fontSize: '1rem', color: '#6b7280'
                                                }}>+</button>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <button onClick={() => removeFromCart(item.id)} style={{
                                                width: '36px', height: '36px', background: '#F97316', border: 'none',
                                                borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', marginBottom: '0.5rem'
                                            }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>S/ {item.price.toFixed(2)} c/u</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#3B82F6' }}>S/ {(item.price * item.cantidad).toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Discount Section */}
                        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#374151' }}>Descuento</label>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button style={{
                                        padding: '0.35rem 0.75rem', background: '#4B5563', color: 'white',
                                        border: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                                    }}>%</button>
                                    <button style={{
                                        padding: '0.35rem 0.75rem', background: '#E5E7EB', color: '#6B7280',
                                        border: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                                    }}>S/</button>
                                </div>
                            </div>
                            <input
                                type="number"
                                value={descuento}
                                onChange={(e) => setDescuento(Number(e.target.value) || 0)}
                                min="0"
                                style={{
                                    width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb',
                                    borderRadius: '8px', fontSize: '1rem', color: '#374151'
                                }}
                                placeholder="0"
                            />
                        </div>

                        {/* Totals */}
                        <div style={{ padding: '1rem 1.25rem', background: '#F9FAFB', borderTop: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ color: '#6b7280' }}>Subtotal:</span>
                                <span style={{ fontWeight: 600, color: '#374151' }}>S/ {subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ color: '#6b7280' }}>Descuento:</span>
                                <span style={{ fontWeight: 600, color: '#EF4444' }}>S/ {descuento.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                <span style={{ color: '#6b7280' }}>IGV (18.00%):</span>
                                <span style={{ fontWeight: 600, color: '#374151' }}>S/ {igv.toFixed(2)}</span>
                            </div>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                paddingTop: '0.75rem', borderTop: '1px dashed #d1d5db',
                                fontSize: '1.1rem'
                            }}>
                                <span style={{ fontWeight: 700, color: '#1f2937' }}>Total:</span>
                                <span style={{ fontWeight: 700, color: '#3B82F6' }}>S/ {total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ padding: '1rem 1.25rem' }}>
                            <button
                                disabled={carrito.length === 0 || loadingPay}
                                onClick={handlePay}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: carrito.length === 0 ? '#9CA3AF' : '#10B981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: carrito.length === 0 ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                {loadingPay ? 'Procesando...' : 'Procesar Venta'}
                            </button>
                            <button
                                onClick={() => router.push('/admin/ventas/historial')}
                                style={{
                                    width: '100%',
                                    marginTop: '0.75rem',
                                    padding: '0.75rem',
                                    background: 'transparent',
                                    color: '#3B82F6',
                                    border: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.35rem'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                Historial de Ventas
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add to Cart Modal */}
            <AddToCartModal
                isOpen={showAddModal}
                product={selectedProduct}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddToCart}
            />
        </div>
    );
}
