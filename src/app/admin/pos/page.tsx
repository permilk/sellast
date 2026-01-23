'use client';

// ============================================
// POS SALES PAGE - PUNTO DE VENTA PREMIUM
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { processSaleAction, searchProductsAction } from './actions/pos.actions';
import AddToCartModal from './components/AddToCartModal';
import ProcessSaleModal from './components/ProcessSaleModal';
import SaleReceiptModal from './components/SaleReceiptModal';
import { getProducts, Product } from '@/stores/productsStore';
import { getClients, addClient, Client } from '@/stores/clientsStore';
import { addQuotation, QuotationItem } from '@/stores/quotationsStore';
import './pos-styles.css';

// Placeholder images for products without images
const placeholderImages = [
    'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1613063055954-fa3a67da1be2?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=100&h=100&fit=crop',
];

const categories = ['Todos', 'Aguas', 'Complementos', 'Gaseosa', 'Licor', 'Tienda', 'Bebidas', 'Limpieza', 'Alimentos', 'Indumentaria'];

export default function POSSalesPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todos');
    const [carrito, setCarrito] = useState<any[]>([]);
    const [descuento, setDescuento] = useState(0);
    const [descuentoTipo, setDescuentoTipo] = useState<'%' | '$'>('%');
    const [loadingPay, setLoadingPay] = useState(false);
    const [cliente, setCliente] = useState('general');

    // Load products from store on mount
    useEffect(() => {
        const storedProducts = getProducts();
        // Transform to POS format with images
        const posProducts = storedProducts
            .filter(p => p.estado === 'activo') // Only show active products
            .map((p, index) => ({
                id: p.id,
                name: p.name,
                sku: p.sku,
                price: p.precio,
                stock: p.stock,
                category: p.category,
                image: p.imagen || placeholderImages[index % placeholderImages.length]
            }));
        setProducts(posProducts);
    }, []);

    // Modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // Sale modals
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [lastSaleData, setLastSaleData] = useState<any>(null);

    // New client modal
    const [showClientModal, setShowClientModal] = useState(false);
    const [clientes, setClientes] = useState<{ id: string, name: string }[]>([]);
    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: '',
        telefono: '',
        email: '',
        rfc: ''
    });

    // Load clients from store on mount
    useEffect(() => {
        const storedClients = getClients();
        const clientOptions = [
            { id: 'general', name: 'Cliente General' },
            ...storedClients.map(c => ({ id: c.id, name: c.nombre }))
        ];
        setClientes(clientOptions);
    }, []);

    const handleClienteChange = (value: string) => {
        if (value === 'nuevo') {
            setShowClientModal(true);
        } else {
            setCliente(value);
        }
    };

    const handleAddCliente = () => {
        if (!nuevoCliente.nombre.trim()) {
            alert('Por favor ingresa el nombre del cliente');
            return;
        }
        // Save to clientsStore
        const newClient = addClient({
            documento: nuevoCliente.rfc || '',
            nombre: nuevoCliente.nombre,
            tipo: 'minorista',
            telefono: nuevoCliente.telefono || '',
            email: nuevoCliente.email || '',
            totalCompras: 0
        });
        setClientes([...clientes, { id: newClient.id, name: newClient.nombre }]);
        setCliente(newClient.id);
        setShowClientModal(false);
        setNuevoCliente({ nombre: '', telefono: '', email: '', rfc: '' });
    };

    // Filter products
    const filteredProducts = products.filter((prod: any) => {
        const matchesSearch = prod.name.toLowerCase().includes(busqueda.toLowerCase()) ||
            prod.sku?.toLowerCase().includes(busqueda.toLowerCase());
        const matchesCategory = categoryFilter === 'Todos' || prod.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Barcode scanner handler - auto-add to cart on exact match
    const handleBarcodeSearch = (searchValue: string) => {
        setBusqueda(searchValue);

        // If it looks like a barcode (numbers only, 8-13 digits), try exact match
        const isBarcode = /^\d{8,13}$/.test(searchValue.trim());
        if (isBarcode || searchValue.length >= 3) {
            const exactMatch = products.find((p: any) =>
                p.sku?.toLowerCase() === searchValue.toLowerCase().trim() ||
                p.id === searchValue.trim()
            );

            if (exactMatch) {
                // Auto-add to cart with quantity 1
                const existente = carrito.find(item => item.id === exactMatch.id);
                if (existente) {
                    setCarrito(carrito.map(item =>
                        item.id === exactMatch.id
                            ? { ...item, cantidad: item.cantidad + 1 }
                            : item
                    ));
                } else {
                    setCarrito([...carrito, { ...exactMatch, cantidad: 1 }]);
                }
                // Clear search and play sound feedback (optional)
                setBusqueda('');
                // Visual/audio feedback could be added here
            }
        }
    };

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
    const descuentoReal = descuentoTipo === '%' ? (subtotal * descuento / 100) : descuento;
    const iva = (subtotal - descuentoReal) * 0.16; // IVA 16% México
    const total = subtotal - descuentoReal + iva;

    const handlePay = () => {
        if (carrito.length === 0) return;
        setShowProcessModal(true);
    };

    const handleFinalizeSale = async (saleData: any) => {
        setLoadingPay(true);
        setShowProcessModal(false);

        try {
            // Import and use localStorage-based salesStore
            const { processSale } = await import('@/stores/salesStore');

            // Get the client name instead of ID
            const selectedClient = clientes.find(c => c.id === cliente);
            const clienteName = selectedClient?.name || saleData.cliente || 'Cliente General';

            const sale = processSale({
                items: carrito.map(i => ({
                    id: i.id,
                    name: i.name,
                    price: i.price,
                    quantity: i.cantidad
                })),
                subtotal: saleData.subtotal,
                descuento: saleData.descuento,
                iva: saleData.iva,
                total: saleData.total,
                metodoPago: saleData.metodoPago.toUpperCase(),
                cliente: clienteName
            });

            // Add folio to saleData for receipt
            setLastSaleData({ ...saleData, folio: sale.folio });
            setShowReceiptModal(true);
            setCarrito([]);
            setDescuento(0);
        } catch (error) {
            console.error('Error processing sale:', error);
            alert('Error al procesar la venta');
        }
        setLoadingPay(false);
    };

    return (
        <div className="pos-module" style={{ padding: 0 }}>

            {/* Main Content */}
            <div style={{ padding: '1.25rem', height: 'calc(100vh - 60px)' }}>
                <div className="pos-sales-layout">
                    {/* LEFT: Products Panel */}
                    <div className="pos-products-panel" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h1 style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: '#1f2937',
                                    margin: 0
                                }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                                        <circle cx="9" cy="21" r="1" />
                                        <circle cx="20" cy="21" r="1" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                    </svg>
                                    Nueva Venta
                                </h1>
                                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>Registra tus ventas de manera rápida e intuitiva</p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
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
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleBarcodeSearch(busqueda);
                                        }
                                    }}
                                    autoFocus
                                />
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
                                        {prod.image ? (
                                            <img src={prod.image} alt={prod.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                        ) : (
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="product-tile-name">{prod.name}</div>
                                    <div className="product-tile-price">$ {prod.price.toFixed(2)}</div>
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
                        height: 'calc(100vh - 140px)',
                        minHeight: '600px'
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
                                    onChange={(e) => handleClienteChange(e.target.value)}
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
                                    {clientes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                    <option value="nuevo">+ Nuevo Cliente</option>
                                </select>
                                <button
                                    onClick={() => setShowClientModal(true)}
                                    style={{
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
                            minHeight: '200px',
                            overflowY: 'auto',
                            padding: '1rem 1.25rem',
                            background: '#F8F9FA',
                            borderTop: '1px solid #e5e7eb',
                            borderBottom: '1px solid #e5e7eb'
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
                                        background: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderLeft: '4px solid #3B82F6',
                                        borderRadius: '8px',
                                        padding: '0.75rem',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>{item.name}</div>
                                                <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>$ {item.price.toFixed(2)} c/u</div>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} style={{
                                                width: '28px', height: '28px', background: '#FEE2E2', border: 'none',
                                                borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <button onClick={() => updateQty(item.id, -1)} style={{
                                                    width: '26px', height: '26px', border: '1px solid #e5e7eb', borderRadius: '4px',
                                                    background: '#f9fafb', cursor: 'pointer', fontSize: '0.9rem', color: '#374151'
                                                }}>−</button>
                                                <span style={{
                                                    width: '32px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem'
                                                }}>{item.cantidad}</span>
                                                <button onClick={() => updateQty(item.id, 1)} style={{
                                                    width: '26px', height: '26px', border: '1px solid #e5e7eb', borderRadius: '4px',
                                                    background: '#f9fafb', cursor: 'pointer', fontSize: '0.9rem', color: '#374151'
                                                }}>+</button>
                                            </div>
                                            <div style={{ fontWeight: 700, color: '#3B82F6', fontSize: '1rem' }}>
                                                $ {(item.price * item.cantidad).toFixed(2)}
                                            </div>
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
                                    <button
                                        onClick={() => setDescuentoTipo('%')}
                                        style={{
                                            padding: '0.35rem 0.75rem',
                                            background: descuentoTipo === '%' ? '#4B5563' : '#E5E7EB',
                                            color: descuentoTipo === '%' ? 'white' : '#6B7280',
                                            border: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                                        }}>%</button>
                                    <button
                                        onClick={() => setDescuentoTipo('$')}
                                        style={{
                                            padding: '0.35rem 0.75rem',
                                            background: descuentoTipo === '$' ? '#4B5563' : '#E5E7EB',
                                            color: descuentoTipo === '$' ? 'white' : '#6B7280',
                                            border: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                                        }}>$</button>
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
                                <span style={{ fontWeight: 600, color: '#374151' }}>$ {subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ color: '#6b7280' }}>Descuento:</span>
                                <span style={{ fontWeight: 600, color: '#EF4444' }}>$ {descuentoReal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                <span style={{ color: '#6b7280' }}>IVA (16.00%):</span>
                                <span style={{ fontWeight: 600, color: '#374151' }}>$ {iva.toFixed(2)}</span>
                            </div>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                paddingTop: '0.75rem', borderTop: '1px dashed #d1d5db',
                                fontSize: '1.1rem'
                            }}>
                                <span style={{ fontWeight: 700, color: '#1f2937' }}>Total:</span>
                                <span style={{ fontWeight: 700, color: '#3B82F6' }}>$ {total.toFixed(2)}</span>
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
                                disabled={carrito.length === 0}
                                onClick={() => {
                                    if (carrito.length === 0) return;
                                    const clienteObj = clientes.find(c => c.id === cliente);
                                    const clienteName = clienteObj?.name || 'Cliente General';
                                    const items: QuotationItem[] = carrito.map(item => ({
                                        productoId: item.id,
                                        nombre: item.name,
                                        sku: item.sku || '',
                                        cantidad: item.cantidad,
                                        precioUnitario: item.price,
                                        descuento: 0,
                                        subtotal: item.price * item.cantidad
                                    }));
                                    const fechaVenc = new Date();
                                    fechaVenc.setDate(fechaVenc.getDate() + 15);
                                    addQuotation({
                                        fechaVencimiento: fechaVenc.toISOString().slice(0, 10),
                                        cliente: { id: cliente, nombre: clienteName, email: '', telefono: '' },
                                        items,
                                        subtotal,
                                        descuentoGlobal: descuentoReal,
                                        iva,
                                        total,
                                        estado: 'pendiente',
                                        notas: '',
                                        vendedor: 'Vendedor',
                                        condicionesPago: 'Contado',
                                        tiempoEntrega: 'Inmediata'
                                    });
                                    setCarrito([]);
                                    router.push('/admin/cotizaciones');
                                }}
                                style={{
                                    width: '100%',
                                    marginTop: '0.75rem',
                                    padding: '0.75rem',
                                    background: carrito.length === 0 ? '#E5E7EB' : 'rgba(124, 58, 237, 0.1)',
                                    color: carrito.length === 0 ? '#9CA3AF' : '#7C3AED',
                                    border: carrito.length === 0 ? 'none' : '1px solid rgba(124, 58, 237, 0.3)',
                                    borderRadius: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: carrito.length === 0 ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.35rem'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                Guardar como Cotización
                            </button>
                            <button
                                onClick={() => router.push('/admin/ventas/historial')}
                                style={{
                                    width: '100%',
                                    marginTop: '0.5rem',
                                    padding: '0.6rem',
                                    background: 'transparent',
                                    color: '#6B7280',
                                    border: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.35rem'
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

            {/* Process Sale Modal */}
            <ProcessSaleModal
                isOpen={showProcessModal}
                onClose={() => setShowProcessModal(false)}
                cartItems={carrito}
                subtotal={subtotal}
                descuento={descuentoReal}
                cliente={cliente}
                onFinalizeSale={handleFinalizeSale}
            />

            {/* Sale Receipt Modal */}
            <SaleReceiptModal
                isOpen={showReceiptModal}
                onClose={() => setShowReceiptModal(false)}
                saleData={lastSaleData}
            />

            {/* New Client Modal */}
            {showClientModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '450px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                            color: 'white'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Nuevo Cliente
                            </h3>
                            <button onClick={() => setShowClientModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: '1.5rem' }}>×</button>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Nombre *</label>
                                <input
                                    type="text"
                                    placeholder="Nombre del cliente"
                                    value={nuevoCliente.nombre}
                                    onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Teléfono</label>
                                <input
                                    type="tel"
                                    placeholder="Ej: 55 1234 5678"
                                    value={nuevoCliente.telefono}
                                    onChange={e => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Email</label>
                                    <input
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        value={nuevoCliente.email}
                                        onChange={e => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>RFC</label>
                                    <input
                                        type="text"
                                        placeholder="XAXX010101000"
                                        value={nuevoCliente.rfc}
                                        onChange={e => setNuevoCliente({ ...nuevoCliente, rfc: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowClientModal(false)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddCliente}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#3B82F6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Agregar Cliente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
