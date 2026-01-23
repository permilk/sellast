'use client';

// ============================================
// CHECKOUT SUCCESS PAGE
// ============================================

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import StoreNavbar from '@/components/store/Navbar';
import StoreFooter from '@/components/store/Footer';
import '@/styles/store.css';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order');
    const isMock = searchParams.get('mock') === 'true';

    return (
        <div className="success-container">
            <div className="success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            </div>

            <h1>¡Gracias por tu compra!</h1>
            <p className="subtitle">Tu pedido ha sido procesado correctamente.</p>

            {orderId && (
                <div className="order-info">
                    <span className="label">Número de orden</span>
                    <span className="value">{orderId}</span>
                </div>
            )}

            <p className="description">
                Recibirás un correo electrónico con los detalles de tu pedido y los enlaces de descarga de tus diseños.
            </p>

            {isMock && (
                <div className="mock-notice">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Modo de demostración - No se procesó ningún pago real
                </div>
            )}

            <div className="actions">
                <Link href="/productos" className="btn-primary">
                    Seguir comprando
                </Link>
                <Link href="/cuenta/pedidos" className="btn-secondary">
                    Ver mis pedidos
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <div className="store-page">
            <StoreNavbar />

            <main className="success-page">
                <Suspense fallback={<div>Cargando...</div>}>
                    <SuccessContent />
                </Suspense>
            </main>

            <StoreFooter />

            <style jsx>{`
                .success-page {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8rem 2rem 4rem;
                }
                
                .success-container {
                    max-width: 480px;
                    text-align: center;
                }
                
                .success-icon {
                    width: 100px;
                    height: 100px;
                    margin: 0 auto 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(52, 199, 89, 0.1);
                    border-radius: 50%;
                    color: #34C759;
                }
                
                h1 {
                    font-size: 2rem;
                    font-weight: 600;
                    color: #1D1D1F;
                    margin-bottom: 0.5rem;
                }
                
                .subtitle {
                    font-size: 1.125rem;
                    color: #86868B;
                    margin-bottom: 2rem;
                }
                
                .order-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    padding: 1.5rem;
                    background: #F5F5F7;
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                }
                
                .label {
                    font-size: 0.75rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #86868B;
                }
                
                .value {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1D1D1F;
                    font-family: monospace;
                }
                
                .description {
                    color: #6E6E73;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }
                
                .mock-notice {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    background: rgba(255, 149, 0, 0.1);
                    color: #FF9500;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    margin-bottom: 2rem;
                }
                
                .actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                
                .btn-primary {
                    padding: 1rem 2rem;
                    background: #0071E3;
                    color: #fff;
                    border-radius: 980px;
                    font-weight: 500;
                    text-decoration: none;
                    transition: background 0.2s;
                }
                
                .btn-primary:hover {
                    background: #0077ED;
                }
                
                .btn-secondary {
                    padding: 1rem 2rem;
                    background: transparent;
                    color: #0071E3;
                    border: 1px solid #D2D2D7;
                    border-radius: 980px;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                
                .btn-secondary:hover {
                    background: #F5F5F7;
                }
                
                @media (max-width: 640px) {
                    .actions {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
}
