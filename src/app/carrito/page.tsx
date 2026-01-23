'use client';

// ============================================
// CARRITO PAGE - APPLE STYLE
// ============================================

import Link from 'next/link';
import StoreNavbar from '@/components/store/Navbar';
import StoreFooter from '@/components/store/Footer';
import { useCartStore } from '@/stores/cartStore';
import '@/styles/store.css';

export default function CartPage() {
    const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
    const subtotal = getSubtotal();
    const tax = subtotal * 0.16;
    const shipping = subtotal >= 500 ? 0 : 99;
    const total = subtotal + tax + shipping;

    if (items.length === 0) {
        return (
            <div className="store-page">
                <StoreNavbar />
                <main className="empty-cart">
                    <div className="empty-content">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        <h2>Tu carrito está vacío</h2>
                        <p>Explora nuestro catálogo y encuentra diseños increíbles</p>
                        <Link href="/productos" className="btn-primary">Ver catálogo</Link>
                    </div>
                </main>
                <StoreFooter />
                <style jsx>{`
                    .empty-cart { min-height: 70vh; display: flex; align-items: center; justify-content: center; padding: 8rem 2rem; }
                    .empty-content { text-align: center; max-width: 400px; }
                    .empty-content svg { color: #86868B; margin-bottom: 1.5rem; }
                    .empty-content h2 { font-size: 1.5rem; color: #1D1D1F; margin-bottom: 0.5rem; }
                    .empty-content p { color: #86868B; margin-bottom: 2rem; }
                    .btn-primary { display: inline-block; padding: 1rem 2rem; background: #0071E3; color: #fff; border-radius: 980px; text-decoration: none; font-weight: 500; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="store-page">
            <StoreNavbar />

            <main className="cart-page">
                <div className="cart-container">
                    <h1>Tu carrito</h1>

                    <div className="cart-grid">
                        <div className="cart-items">
                            {items.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <span className="item-price">${item.price.toLocaleString('es-MX')} MXN</span>
                                    </div>
                                    <div className="item-quantity">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="item-total">
                                        ${(item.price * item.quantity).toLocaleString('es-MX')} MXN
                                    </div>
                                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h3>Resumen</h3>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="summary-row">
                                <span>IVA (16%)</span>
                                <span>${tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="summary-row">
                                <span>Envío</span>
                                <span>{shipping === 0 ? 'Gratis' : `$${shipping}`}</span>
                            </div>

                            {subtotal < 500 && (
                                <div className="free-shipping-hint">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    Agrega ${(500 - subtotal).toLocaleString('es-MX')} más para envío gratis
                                </div>
                            )}

                            <div className="summary-divider"></div>

                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                            </div>

                            <Link href="/checkout" className="checkout-btn">
                                Continuar al pago
                            </Link>

                            <Link href="/productos" className="continue-shopping">
                                Seguir comprando
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <StoreFooter />

            <style jsx>{`
                .cart-page {
                    padding: 8rem 2rem 4rem;
                }
                
                .cart-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                h1 {
                    font-size: 2rem;
                    font-weight: 600;
                    color: #1D1D1F;
                    margin-bottom: 2rem;
                }
                
                .cart-grid {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 4rem;
                    align-items: start;
                }
                
                .cart-items {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .cart-item {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 1.5rem;
                    background: #fff;
                    border-radius: 16px;
                }
                
                .item-image {
                    width: 100px;
                    height: 100px;
                    border-radius: 12px;
                    overflow: hidden;
                    background: #F5F5F7;
                }
                
                .item-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .item-details {
                    flex: 1;
                }
                
                .item-details h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1D1D1F;
                    margin-bottom: 0.25rem;
                }
                
                .item-price {
                    font-size: 0.9375rem;
                    color: #86868B;
                }
                
                .item-quantity {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem;
                    background: #F5F5F7;
                    border-radius: 10px;
                }
                
                .item-quantity button {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff;
                    border: none;
                    border-radius: 8px;
                    color: #1D1D1F;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                
                .item-quantity button:hover:not(:disabled) {
                    background: #E8E8ED;
                }
                
                .item-quantity button:disabled {
                    color: #D2D2D7;
                    cursor: not-allowed;
                }
                
                .item-quantity span {
                    font-weight: 600;
                    min-width: 24px;
                    text-align: center;
                }
                
                .item-total {
                    font-weight: 600;
                    color: #1D1D1F;
                    min-width: 100px;
                    text-align: right;
                }
                
                .remove-btn {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    color: #86868B;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                
                .remove-btn:hover {
                    background: rgba(255, 59, 48, 0.1);
                    color: #FF3B30;
                }
                
                /* Summary */
                .cart-summary {
                    position: sticky;
                    top: 100px;
                    padding: 2rem;
                    background: #fff;
                    border-radius: 18px;
                }
                
                .cart-summary h3 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #1D1D1F;
                    margin-bottom: 1.5rem;
                }
                
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                    font-size: 0.9375rem;
                    color: #6E6E73;
                }
                
                .summary-row.total {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1D1D1F;
                    margin-bottom: 1.5rem;
                }
                
                .free-shipping-hint {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    background: rgba(0, 113, 227, 0.1);
                    color: #0071E3;
                    border-radius: 10px;
                    font-size: 0.8125rem;
                    margin: 1rem 0;
                }
                
                .summary-divider {
                    height: 1px;
                    background: #E8E8ED;
                    margin: 1.25rem 0;
                }
                
                .checkout-btn {
                    display: block;
                    width: 100%;
                    padding: 1rem;
                    background: #0071E3;
                    color: #fff;
                    border-radius: 12px;
                    text-align: center;
                    font-weight: 600;
                    text-decoration: none;
                    transition: background 0.2s;
                }
                
                .checkout-btn:hover {
                    background: #0077ED;
                }
                
                .continue-shopping {
                    display: block;
                    text-align: center;
                    margin-top: 1rem;
                    color: #0071E3;
                    font-weight: 500;
                    text-decoration: none;
                }
                
                @media (max-width: 900px) {
                    .cart-grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    
                    .cart-item {
                        flex-wrap: wrap;
                    }
                    
                    .item-total {
                        order: 5;
                        width: 100%;
                        text-align: left;
                        padding-top: 1rem;
                        border-top: 1px solid #E8E8ED;
                        margin-top: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}
