'use client';

// ============================================
// ADMIN - POS (NUEVA VENTA)
// ============================================

import { useState } from 'react';

const productosMock = [
    { id: '1', codigo: '750100', nombre: 'Agua Mineral 500ml', precio: 700, stock: 92 },
    { id: '2', codigo: '750101', nombre: 'Coca Cola 600ml', precio: 1200, stock: 44 },
    { id: '3', codigo: 'DTO001', nombre: 'Servicio Diseño DTF', precio: 1500, stock: 999 },
    { id: '4', codigo: 'BOR005', nombre: 'Bordado Escolar', precio: 850, stock: 999 },
    { id: '5', codigo: 'VIN010', nombre: 'Vinil Textil Metro', precio: 3200, stock: 15 },
    { id: '6', codigo: '750102', nombre: 'Agua Ciel 1L', precio: 900, stock: 30 },
];

export default function POSPage() {
    const [busqueda, setBusqueda] = useState('');
    const [carrito, setCarrito] = useState<any[]>([]);
    const [descuento, setDescuento] = useState(0);

    const resultados = busqueda.length > 0
        ? productosMock.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.codigo.includes(busqueda))
        : [];

    const addToCart = (producto: any) => {
        const existente = carrito.find(item => item.id === producto.id);
        if (existente) {
            setCarrito(carrito.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
        setBusqueda('');
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

    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const total = subtotal - descuento;

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
                            <button className="scan-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="results-list">
                        {resultados.length > 0 ? (
                            resultados.map(prod => (
                                <div key={prod.id} className="product-item" onClick={() => addToCart(prod)}>
                                    <div className="prod-info">
                                        <div className="prod-name">{prod.nombre}</div>
                                        <div className="prod-meta">SKU: {prod.codigo} | Stock: {prod.stock}</div>
                                    </div>
                                    <div className="prod-price">${prod.precio}</div>
                                    <button className="add-btn">+</button>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>Escribe para buscar o escanea un código</p>
                            </div>
                        )}

                        {busqueda === '' && (
                            <div className="quick-grid">
                                <h3>Más Vendidos</h3>
                                <div className="grid-items">
                                    {productosMock.slice(0, 4).map(prod => (
                                        <div key={prod.id} className="quick-card" onClick={() => addToCart(prod)}>
                                            <div className="qc-name">{prod.nombre}</div>
                                            <div className="qc-price">${prod.precio}</div>
                                        </div>
                                    ))}
                                </div>
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
                                        <div className="row-name">{item.nombre}</div>
                                        <div className="row-price">${item.precio} x {item.cantidad}</div>
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
                                    <div className="row-total">${item.precio * item.cantidad}</div>
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
                            <button className="btn-pay" disabled={carrito.length === 0}>Pagar</button>
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
                .input-group input { width: 100%; padding: 1rem 1rem 1rem 3rem; border: 1px solid #e2e8f0; border-radius: 8px 0 0 8px; font-size: 1rem; outline: none; transition: all 0.2s; }
                .input-group input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
                .scan-btn { padding: 0 1.5rem; background: #2563eb; color: #fff; border: none; border-radius: 0 8px 8px 0; cursor: pointer; display: flex; align-items: center; }
                
                .results-list { flex: 1; overflow-y: auto; padding: 1rem; background: #f8fafc; }
                .product-item { background: #fff; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s; }
                .product-item:hover { border-color: #2563eb; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                .prod-name { font-weight: 600; color: #1e293b; }
                .prod-meta { font-size: 0.8rem; color: #64748b; margin-top: 0.25rem; }
                .prod-price { font-weight: 700; color: #2563eb; font-size: 1.1rem; }
                
                .add-btn { width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; color: #2563eb; border: none; font-weight: 700; display: flex; align-items: center; justify-content: center; }
                
                .empty-state { text-align: center; color: #94a3b8; padding: 3rem; }
                
                .quick-grid { margin-top: 2rem; }
                .quick-grid h3 { font-size: 1rem; font-weight: 600; color: #64748b; margin-bottom: 1rem; }
                .grid-items { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
                .quick-card { background: #fff; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; cursor: pointer; text-align: center; transition: all 0.2s; }
                .quick-card:hover { border-color: #2563eb; background: #eff6ff; }
                .qc-name { font-weight: 500; font-size: 0.9rem; margin-bottom: 0.5rem; }
                .qc-price { font-weight: 700; color: #2563eb; }

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
