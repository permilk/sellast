'use client';

// ============================================
// ADD TO CART MODAL - AGREGAR AL CARRITO
// ============================================

import { useState, useEffect } from 'react';

interface Product {
    id: string;
    name: string;
    sku?: string;
    price: number;
    stock: number;
    image?: string;
}

interface AddToCartModalProps {
    isOpen: boolean;
    product: Product | null;
    onClose: () => void;
    onAdd: (product: Product, quantity: number, customPrice: number) => void;
}

export default function AddToCartModal({ isOpen, product, onClose, onAdd }: AddToCartModalProps) {
    const [priceType, setPriceType] = useState('retail');
    const [customPrice, setCustomPrice] = useState('');
    const [unitType, setUnitType] = useState('unidad');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product) {
            setCustomPrice(product.price.toFixed(2));
            setQuantity(1);
            setPriceType('retail');
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const subtotal = quantity * parseFloat(customPrice || '0');

    const handleAdd = () => {
        onAdd(product, quantity, parseFloat(customPrice));
        onClose();
    };

    const increaseQty = () => {
        if (quantity < product.stock) {
            setQuantity(q => q + 1);
        }
    };

    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1);
        }
    };

    return (
        <div className="pos-modal-overlay" onClick={onClose}>
            <div className="pos-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                {/* Header */}
                <div className="pos-modal-header">
                    <div className="pos-modal-title">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Agregar al Carrito
                    </div>
                    <button className="pos-modal-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="pos-modal-body">
                    {/* Product Info */}
                    <div className="pos-add-cart-product">
                        <div className="pos-add-cart-image">
                            {product.image ? (
                                <img src={product.image} alt={product.name} />
                            ) : (
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                            )}
                        </div>
                        <div className="pos-add-cart-info">
                            <h4>{product.name}</h4>
                            <p>Código: {product.sku || 'N/A'}</p>
                            <span className="price">$ {product.price.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Price Type */}
                    <div className="pos-form-group">
                        <label>Precio de venta</label>
                        <select
                            value={priceType}
                            onChange={(e) => {
                                setPriceType(e.target.value);
                                if (e.target.value === 'retail') {
                                    setCustomPrice(product.price.toFixed(2));
                                }
                            }}
                        >
                            <option value="retail">Retail $ {product.price.toFixed(2)}</option>
                            <option value="mayoreo">Mayoreo</option>
                            <option value="especial">Precio Especial</option>
                        </select>
                    </div>

                    {/* Custom Price */}
                    <div className="pos-form-group">
                        <label>Precio personalizado</label>
                        <input
                            type="number"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            step="0.01"
                            min="0"
                        />
                    </div>

                    {/* Unit Type */}
                    <div className="pos-form-group">
                        <label>Unidad de venta</label>
                        <select value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                            <option value="unidad">Unidad</option>
                            <option value="caja">Caja</option>
                            <option value="paquete">Paquete</option>
                        </select>
                    </div>

                    {/* Quantity */}
                    <div className="pos-form-group">
                        <label>Cantidad</label>
                        <div className="pos-quantity-control">
                            <button onClick={decreaseQty} disabled={quantity <= 1}>−</button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || 1;
                                    setQuantity(Math.min(Math.max(1, val), product.stock));
                                }}
                                min="1"
                                max={product.stock}
                            />
                            <button onClick={increaseQty} disabled={quantity >= product.stock}>+</button>
                            <span className="pos-quantity-stock">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.25rem' }}>
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                </svg>
                                {product.stock} disponibles
                            </span>
                        </div>
                    </div>

                    {/* Subtotal */}
                    <div className="pos-subtotal">
                        <label>Subtotal</label>
                        <span>$ {subtotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="pos-modal-footer">
                    <button className="btn-pos btn-pos-outline" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Cancelar
                    </button>
                    <button
                        className="btn-pos btn-pos-cyan btn-pos-lg"
                        onClick={handleAdd}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    );
}
