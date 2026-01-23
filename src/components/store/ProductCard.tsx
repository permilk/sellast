'use client';

// ============================================
// PRODUCT CARD - APPLE MINIMAL STYLE
// ============================================

import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';

interface ProductCardProps {
    id: string;
    slug: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    image: string;
    isNew?: boolean;
    isBestseller?: boolean;
}

export default function ProductCard({
    id,
    slug,
    name,
    category,
    price,
    originalPrice,
    image,
    isNew,
    isBestseller
}: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id,
            name,
            price,
            image,
            quantity: 1
        });
    };

    const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

    return (
        <Link href={`/productos/${slug}`} className="product-card">
            <div className="image-container">
                <img src={image} alt={name} loading="lazy" />

                {/* Badges */}
                <div className="badges">
                    {isNew && <span className="badge new">Nuevo</span>}
                    {isBestseller && <span className="badge best">Popular</span>}
                    {discount > 0 && <span className="badge sale">-{discount}%</span>}
                </div>

                {/* Quick Add */}
                <button className="quick-add" onClick={handleAddToCart}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            </div>

            <div className="info">
                <span className="category">{category}</span>
                <h3 className="name">{name}</h3>
                <div className="price-row">
                    <span className="price">${price.toLocaleString('es-MX')} MXN</span>
                    {originalPrice && (
                        <span className="original">${originalPrice.toLocaleString('es-MX')}</span>
                    )}
                </div>
            </div>

            <style jsx>{`
                .product-card {
                    display: block;
                    text-decoration: none;
                    background: #fff;
                    border-radius: 18px;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                
                .product-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
                }
                
                .image-container {
                    position: relative;
                    aspect-ratio: 1;
                    background: #F5F5F7;
                    overflow: hidden;
                }
                
                .image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                
                .product-card:hover .image-container img {
                    transform: scale(1.08);
                }
                
                .badges {
                    position: absolute;
                    top: 1rem;
                    left: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .badge {
                    padding: 0.35rem 0.75rem;
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                    border-radius: 6px;
                }
                
                .badge.new {
                    background: rgba(0, 113, 227, 0.1);
                    color: #0071E3;
                }
                
                .badge.best {
                    background: rgba(29, 29, 31, 0.9);
                    color: #fff;
                }
                
                .badge.sale {
                    background: rgba(255, 59, 48, 0.1);
                    color: #FF3B30;
                }
                
                .quick-add {
                    position: absolute;
                    bottom: 1rem;
                    right: 1rem;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.3s ease;
                    color: #1D1D1F;
                }
                
                .product-card:hover .quick-add {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .quick-add:hover {
                    background: #0071E3;
                    color: #fff;
                    transform: scale(1.1);
                }
                
                .info {
                    padding: 1.25rem 1.5rem 1.5rem;
                }
                
                .category {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #86868B;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.5rem;
                }
                
                .name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1D1D1F;
                    margin: 0 0 0.75rem;
                    line-height: 1.3;
                }
                
                .price-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .price {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1D1D1F;
                }
                
                .original {
                    font-size: 0.875rem;
                    color: #86868B;
                    text-decoration: line-through;
                }
            `}</style>
        </Link>
    );
}
