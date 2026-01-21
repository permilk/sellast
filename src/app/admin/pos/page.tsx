'use client';

// ============================================
// ADMIN - POS (NUEVA VENTA) - CONNECTED
// ============================================

import { useState, useEffect, useRef } from 'react';
import { processSaleAction, searchProductsAction } from './actions/pos.actions';
import { useRouter } from 'next/navigation';

export default function POSPage() {
    const router = useRouter();
    const [busqueda, setBusqueda] = useState('');
    const [resultados, setResultados] = useState<any[]>([]);
    const [carrito, setCarrito] = useState<any[]>([]);
    const [descuento, setDescuento] = useState(0);
    const [loadingPay, setLoadingPay] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (busqueda.length > 2) {
                const results = await searchProductsAction(busqueda);
                setResultados(results);
            } else {
                setResultados([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [busqueda]);

    const addToCart = (producto: any) => {
        const existente = carrito.find(item => item.id === producto.id);
        if (existente) {
            setCarrito(carrito.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
        setBusqueda('');
        setResultados([]);
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
    const total = subtotal - descuento;

    const handlePay = async () => {
        if (carrito.length === 0) return;
        setLoadingPay(true);

        const result = await processSaleAction({
            items: carrito.map(i => ({ id: i.id, price: i.price, quantity: i.cantidad })),
            total,
            subtotal,
            discount: descuento,
            paymentMethod: 'CASH' // Hardcoded for MVP, should be a selector
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
        <div className="pos-container">
            <div className="pos-layout">
                {/* LEFT: PRODUCTS SEARCH */}
                <div className="pos-products">
                    <div className="search-section">
                        <h2>Registrar Venta</h2>
                        <div className="input-group">
                            <span className="search-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Buscar productos por nombre o código..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="results-list">
                        {resultados.length > 0 ? (
                            resultados.map(prod => (
                                <div key={prod.id} className="product-item" onClick={() => addToCart(prod)}>
                                    <div className="prod-info">
                                        <div className="prod-name">{prod.name}</div>
                                        <div className="prod-meta">SKU: {prod.sku || 'N/A'} | Stock: {prod.stock}</div>
                                    </div>
                                    <div className="prod-price">${prod.price}</div>
                                    <button className="add-btn">+</button>
                                </div>
                            ))
                        ) : busqueda.length > 0 ? (
                            <div className="empty-state">
                                <p>No se encontraron productos</p>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>Escribe para buscar o escanea un código</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: CART (CARRITO) */}
                <div className="pos-cart">
                    <div className="cart-header">
                        <h3>Carrito de Compras</h3>
                        <span className="item-count">{carrito.reduce((c, i) => c + i.cantidad, 0)} items</span>
                    </div>

                    <div className="cart-items">
                        {carrito.length === 0 ? (
                            <div className="cart-empty">Carrito vacío</div>
                        ) : (
                            carrito.map(item => (
                                <div key={item.id} className="cart-row">
                                    <div className="row-main">
                                        <div className="row-name">{item.name}</div>
                                        <div className="row-price">${item.price} x {item.cantidad}</div>
                                    </div>
                                    <div className="row-actions">
                                        <div className="qty-control">
                                            <button onClick={() => updateQty(item.id, -1)}>−</button>
                                            <span>{item.cantidad}</span>
                                            <button onClick={() => updateQty(item.id, 1)}>+</button>
                                        </div>
                                        <button className="del-btn" onClick={() => removeFromCart(item.id)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                    <div className="row-total">${item.price * item.cantidad}</div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="cart-footer">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row discount">
                            <span>Descuento</span>
                            <input
                                type="number"
                                value={descuento}
                                onChange={e => setDescuento(Number(e.target.value))}
                                className="discount-input"
                            />
                        </div>
                        <div className="summary-row total">
                            <span>Total a Pagar</span>
                            <span>${total.toLocaleString()}</span>
                        </div>

                        <div className="cart-buttons">
                            <button className="btn-clear" onClick={() => setCarrito([])}>Limpiar</button>
                            <button
                                className="btn-pay"
                                disabled={carrito.length === 0 || loadingPay}
                                onClick={handlePay}
                            >
                                {loadingPay ? 'Procesando...' : 'Pagar (Efectivo)'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .pos-container { height: calc(100vh - 120px); overflow: hidden; }
                .pos-layout { display: grid; grid-template-columns: 1fr 400px; gap: 1.5rem; height: 100%; }
                
                /* PRODUCT SEARCH */
                .pos-products { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; overflow: hidden; }
                .search-section { padding: 1.5rem; border-bottom: 1px solid #e2e8f0; }
                .search-section h2 { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem; }
                
                .input-group { position: relative; display: flex; align-items: center; }
                .search-icon { position: absolute; left: 1rem; color: #64748b; }
                .input-group input { width: 100%; padding: 1rem 1rem 1rem 3rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; outline: none; transition: all 0.2s; }
                .input-group input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
                
                .results-list { flex: 1; overflow-y: auto; padding: 1rem; background: #f8fafc; }
                .product-item { background: #fff; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s; }
                .product-item:hover { border-color: #2563eb; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                .prod-name { font-weight: 600; color: #1e293b; }
                .prod-meta { font-size: 0.8rem; color: #64748b; margin-top: 0.25rem; }
                .prod-price { font-weight: 700; color: #2563eb; font-size: 1.1rem; }
                
                .add-btn { width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; color: #2563eb; border: none; font-weight: 700; display: flex; align-items: center; justify-content: center; }
                
                .empty-state { text-align: center; color: #94a3b8; padding: 3rem; }

                /* CART */
                .pos-cart { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; overflow: hidden; }
                .cart-header { padding: 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
                .cart-header h3 { font-size: 1.1rem; font-weight: 700; color: #1e293b; }
                .item-count { background: #2563eb; color: #fff; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
                
                .cart-items { flex: 1; overflow-y: auto; padding: 1rem; }
                .cart-empty { text-align: center; color: #94a3b8; margin-top: 3rem; }
                .cart-row { display: grid; grid-template-columns: 1fr auto auto; gap: 1rem; align-items: center; padding: 1rem 0; border-bottom: 1px solid #f1f5f9; }
                .row-name { font-weight: 600; font-size: 0.9rem; color: #1e293b; }
                .row-price { font-size: 0.8rem; color: #64748b; margin-top: 0.25rem; }
                .row-actions { display: flex; align-items: center; gap: 0.5rem; }
                .qty-control { display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 6px; }
                .qty-control button { width: 28px; height: 28px; background: none; border: none; cursor: pointer; color: #64748b; }
                .qty-control button:hover { background: #f1f5f9; color: #2563eb; }
                .qty-control span { width: 24px; text-align: center; font-size: 0.9rem; font-weight: 600; }
                .del-btn { color: #ef4444; background: none; border: none; cursor: pointer; padding: 0.25rem; }
                .row-total { text-align: right; font-weight: 700; font-size: 1rem; color: #1e293b; width: 80px; }
                
                .cart-footer { padding: 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; }
                .summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-size: 0.95rem; color: #64748b; }
                .summary-row.total { font-weight: 800; font-size: 1.4rem; color: #1e293b; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; }
                .discount-input { width: 80px; padding: 0.25rem 0.5rem; border: 1px solid #e2e8f0; border-radius: 4px; text-align: right; }
                
                .cart-buttons { display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; margin-top: 1.5rem; }
                .btn-clear { padding: 1rem; border: 1px solid #e2e8f0; background: #fff; color: #ef4444; border-radius: 8px; font-weight: 600; cursor: pointer; }
                .btn-pay { padding: 1rem; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1.1rem; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
                .btn-pay:disabled { background: #cbd5e1; cursor: not-allowed; box-shadow: none; }
                .btn-pay:hover:not(:disabled) { background: #1d4ed8; }
            `}</style>
        </div>
    );
}
