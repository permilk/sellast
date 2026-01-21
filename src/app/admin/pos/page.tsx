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

                    {/* RIGHT: Cart Panel */}
                    <div className="pos-cart-panel">
                        {/* Cart Header */}
                        <div className="pos-cart-header">
                            <h3>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                Carrito de Compra
                            </h3>
                            <div className="pos-client-selector">
                                <select value={cliente} onChange={(e) => setCliente(e.target.value)}>
                                    <option value="general">Cliente General</option>
                                    <option value="nuevo">+ Nuevo Cliente</option>
                                </select>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="pos-cart-items">
                            {carrito.length === 0 ? (
                                <div className="pos-cart-empty">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="9" cy="21" r="1" />
                                        <circle cx="20" cy="21" r="1" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                    </svg>
                                    <p>Carrito vacío</p>
                                    <span>Agrega productos para comenzar</span>
                                </div>
                            ) : (
                                carrito.map(item => (
                                    <div key={item.id} className="pos-cart-item">
                                        <div className="pos-cart-item-image">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            </svg>
                                        </div>
                                        <div className="pos-cart-item-info">
                                            <div className="pos-cart-item-name">{item.name}</div>
                                            <div className="pos-cart-item-price">S/ {item.price.toFixed(2)}</div>
                                        </div>
                                        <div className="pos-cart-item-qty">
                                            <button onClick={() => updateQty(item.id, -1)}>−</button>
                                            <span>{item.cantidad}</span>
                                            <button onClick={() => updateQty(item.id, 1)}>+</button>
                                        </div>
                                        <div className="pos-cart-item-total">S/ {(item.price * item.cantidad).toFixed(2)}</div>
                                        <button className="pos-cart-item-delete" onClick={() => removeFromCart(item.id)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Cart Footer */}
                        <div className="pos-cart-footer">
                            <div className="pos-cart-discount">
                                <label>Descuento</label>
                                <input
                                    type="number"
                                    value={descuento}
                                    onChange={(e) => setDescuento(Number(e.target.value) || 0)}
                                    min="0"
                                />
                                <span>%</span>
                            </div>

                            <div className="pos-cart-totals">
                                <div className="pos-cart-total-row">
                                    <span>Subtotal</span>
                                    <span>S/ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="pos-cart-total-row">
                                    <span>Descuento</span>
                                    <span>S/ {descuento.toFixed(2)}</span>
                                </div>
                                <div className="pos-cart-total-row">
                                    <span>IGV (18.00%)</span>
                                    <span>S/ {igv.toFixed(2)}</span>
                                </div>
                                <div className="pos-cart-total-row final">
                                    <span>Total</span>
                                    <span>S/ {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="pos-cart-actions">
                                <button
                                    className="btn-pos btn-pos-outline"
                                    onClick={() => setCarrito([])}
                                >
                                    Limpiar
                                </button>
                                <button
                                    className="btn-pos btn-pos-cyan btn-pos-lg"
                                    disabled={carrito.length === 0 || loadingPay}
                                    onClick={handlePay}
                                >
                                    {loadingPay ? 'Procesando...' : 'Pagar'}
                                </button>
                            </div>
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
