'use client';

// ============================================
// CHECKOUT PAGE - APPLE STYLE
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StoreNavbar from '@/components/store/Navbar';
import StoreFooter from '@/components/store/Footer';
import { useCartStore } from '@/stores/cartStore';
import '@/styles/store.css';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: ''
    });

    const subtotal = getSubtotal();
    const tax = subtotal * 0.16;
    const shipping = subtotal >= 500 ? 0 : 99;
    const total = subtotal + tax + shipping;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/store/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(item => ({
                        productId: item.id,
                        variantId: item.variantId,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    customer: formData
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Error al procesar el pedido');
            }

            // Clear cart
            clearCart();

            // Redirect to MercadoPago or success page
            if (data.data.paymentUrl) {
                window.location.href = data.data.paymentUrl;
            } else {
                router.push(`/checkout/success?order=${data.data.orderId}`);
            }
        } catch (err: any) {
            setError(err.message || 'Error al procesar el pedido');
            setLoading(false);
        }
    };

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
                        <p>Agrega diseños a tu carrito para continuar con la compra</p>
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

            <main className="checkout-page">
                <div className="checkout-container">
                    {/* Form */}
                    <div className="checkout-form-section">
                        <h1>Checkout</h1>

                        <form onSubmit={handleCheckout}>
                            <div className="form-section">
                                <h3>Información de contacto</h3>

                                <div className="form-group">
                                    <label htmlFor="email">Correo electrónico</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="tu@correo.com"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="name">Nombre completo</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Tu nombre"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Teléfono (opcional)</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="55 1234 5678"
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Método de pago</h3>
                                <div className="payment-method">
                                    <div className="payment-option selected">
                                        <div className="payment-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <rect x="1" y="4" width="22" height="16" rx="2" fill="#009ee3" />
                                                <text x="12" y="14" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">MP</text>
                                            </svg>
                                        </div>
                                        <div className="payment-info">
                                            <strong>MercadoPago</strong>
                                            <span>Tarjeta, OXXO, transferencia</span>
                                        </div>
                                        <div className="payment-check">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0071E3" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="15" y1="9" x2="9" y2="15" />
                                        <line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="checkout-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Procesando...
                                    </>
                                ) : (
                                    <>Pagar ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3>Resumen del pedido</h3>

                        <div className="cart-items">
                            {items.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img src={item.image} alt={item.name} />
                                        <span className="item-qty">{item.quantity}</span>
                                    </div>
                                    <div className="item-details">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-price">${item.price.toLocaleString('es-MX')} MXN</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-divider"></div>

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

                        <div className="summary-divider"></div>

                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                        </div>
                    </div>
                </div>
            </main>

            <StoreFooter />

            <style jsx>{`
                .checkout-page {
                    padding: 8rem 2rem 4rem;
                }
                
                .checkout-container {
                    max-width: 1100px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 4rem;
                }
                
                h1 {
                    font-size: 2rem;
                    font-weight: 600;
                    color: #1D1D1F;
                    margin-bottom: 2rem;
                }
                
                .form-section {
                    margin-bottom: 2.5rem;
                }
                
                .form-section h3 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #1D1D1F;
                    margin-bottom: 1.25rem;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                }
                
                .form-group label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #1D1D1F;
                    margin-bottom: 0.5rem;
                }
                
                .form-group input {
                    width: 100%;
                    padding: 1rem 1.25rem;
                    font-size: 1rem;
                    border: 1px solid #D2D2D7;
                    border-radius: 12px;
                    background: #fff;
                    transition: all 0.2s;
                }
                
                .form-group input:focus {
                    outline: none;
                    border-color: #0071E3;
                    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
                }
                
                .payment-method {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .payment-option {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.25rem;
                    border: 1px solid #D2D2D7;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .payment-option.selected {
                    border-color: #0071E3;
                    background: rgba(0, 113, 227, 0.05);
                }
                
                .payment-icon {
                    width: 48px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .payment-info {
                    flex: 1;
                }
                
                .payment-info strong {
                    display: block;
                    color: #1D1D1F;
                    margin-bottom: 0.125rem;
                }
                
                .payment-info span {
                    font-size: 0.875rem;
                    color: #86868B;
                }
                
                .error-message {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    background: rgba(255, 59, 48, 0.1);
                    color: #FF3B30;
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                    font-size: 0.9375rem;
                }
                
                .checkout-btn {
                    width: 100%;
                    padding: 1.125rem 2rem;
                    background: #0071E3;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                
                .checkout-btn:hover:not(:disabled) {
                    background: #0077ED;
                }
                
                .checkout-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                /* Order Summary */
                .order-summary {
                    position: sticky;
                    top: 100px;
                    height: fit-content;
                    padding: 2rem;
                    background: #F5F5F7;
                    border-radius: 18px;
                }
                
                .order-summary h3 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #1D1D1F;
                    margin-bottom: 1.5rem;
                }
                
                .cart-items {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .cart-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .item-image {
                    position: relative;
                    width: 64px;
                    height: 64px;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #fff;
                }
                
                .item-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .item-qty {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    min-width: 20px;
                    height: 20px;
                    background: #86868B;
                    color: #fff;
                    font-size: 0.7rem;
                    font-weight: 600;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 6px;
                }
                
                .item-details {
                    flex: 1;
                }
                
                .item-name {
                    display: block;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: #1D1D1F;
                }
                
                .item-price {
                    font-size: 0.875rem;
                    color: #86868B;
                }
                
                .summary-divider {
                    height: 1px;
                    background: #D2D2D7;
                    margin: 1.5rem 0;
                }
                
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                    font-size: 0.9375rem;
                    color: #6E6E73;
                }
                
                .summary-row.total {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #1D1D1F;
                    margin-bottom: 0;
                }
                
                @media (max-width: 900px) {
                    .checkout-container {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    
                    .order-summary {
                        order: -1;
                        position: static;
                    }
                }
            `}</style>
        </div>
    );
}
