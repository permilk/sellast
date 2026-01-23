'use client';

// ============================================
// STORE FOOTER - APPLE MINIMAL STYLE
// ============================================

import Link from 'next/link';

export default function StoreFooter() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <div className="logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M2 10h20" />
                            <path d="M6 16h4" />
                        </svg>
                        <span>Sellast</span>
                    </div>
                    <p>Diseños digitales profesionales para bordado, DTF y corte de vinil. Descarga instantánea, licencia comercial incluida.</p>
                </div>

                <div className="footer-links">
                    <div className="footer-col">
                        <h4>Catálogo</h4>
                        <Link href="/productos">Todos los diseños</Link>
                        <Link href="/productos?cat=bordados">Bordados</Link>
                        <Link href="/productos?cat=dtf">Transfer DTF</Link>
                        <Link href="/productos?cat=vinil">Corte Vinil</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Cuenta</h4>
                        <Link href="/auth">Iniciar sesión</Link>
                        <Link href="/carrito">Carrito</Link>
                        <Link href="/cuenta/pedidos">Mis pedidos</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Ayuda</h4>
                        <Link href="/ayuda/formatos">Formatos disponibles</Link>
                        <Link href="/ayuda/descargas">Cómo descargar</Link>
                        <Link href="/contacto">Contacto</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Empresa</h4>
                        <Link href="/auth">Portal empresas</Link>
                        <Link href="/admin/pos">Sistema POS</Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} Sellast. Todos los derechos reservados.</span>
                <div className="footer-legal">
                    <Link href="/terminos">Términos</Link>
                    <Link href="/privacidad">Privacidad</Link>
                </div>
            </div>

            <style jsx>{`
                .footer {
                    background: #fff;
                    border-top: 1px solid #E8E8ED;
                    margin-top: auto;
                }
                
                .footer-top {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    gap: 4rem;
                }
                
                .footer-brand {
                    max-width: 280px;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    color: #1D1D1F;
                }
                
                .logo span {
                    font-size: 1.125rem;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                }
                
                .footer-brand p {
                    color: #86868B;
                    font-size: 0.875rem;
                    line-height: 1.6;
                }
                
                .footer-links {
                    display: flex;
                    gap: 4rem;
                }
                
                .footer-col h4 {
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #86868B;
                    margin-bottom: 1.25rem;
                }
                
                .footer-col a {
                    display: block;
                    color: #424245;
                    text-decoration: none;
                    font-size: 0.875rem;
                    padding: 0.35rem 0;
                    transition: color 0.2s;
                }
                
                .footer-col a:hover {
                    color: #1D1D1F;
                }
                
                .footer-bottom {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1.5rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #E8E8ED;
                    font-size: 0.8125rem;
                    color: #86868B;
                }
                
                .footer-legal {
                    display: flex;
                    gap: 1.5rem;
                }
                
                .footer-legal a {
                    color: #86868B;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                
                .footer-legal a:hover {
                    color: #1D1D1F;
                }
                
                @media (max-width: 1024px) {
                    .footer-links {
                        gap: 2rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .footer-top {
                        flex-direction: column;
                        gap: 2.5rem;
                        padding: 3rem 1.5rem;
                    }
                    
                    .footer-links {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 2rem;
                    }
                    
                    .footer-brand {
                        max-width: none;
                    }
                    
                    .footer-bottom {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </footer>
    );
}
