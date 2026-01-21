'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        setTimeout(() => {
            if (email === 'admin@sellast.com' && password === 'admin123') {
                localStorage.setItem('sellast_admin_session', JSON.stringify({
                    user: { email, name: 'Administrador', role: 'Super Admin' },
                    loggedIn: true
                }));
                router.push('/admin');
            } else {
                setError('Credenciales inválidas');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Left Side - Branding */}
                <div className="login-branding">
                    <div className="branding-content">
                        <div className="logo">
                            <div className="logo-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="M2 10h20" />
                                    <path d="M6 16h4" />
                                    <path d="M14 16h4" />
                                </svg>
                            </div>
                            <span className="logo-text">Sellast<span className="dot">.</span></span>
                        </div>

                        <h1>Punto de Venta<br /><span className="highlight">Inteligente</span></h1>
                        <p>Gestiona ventas, inventario y clientes desde una plataforma unificada y moderna.</p>

                        <div className="stats-row">
                            <div className="stat">
                                <div className="stat-value">+500</div>
                                <div className="stat-label">Negocios</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">99.9%</div>
                                <div className="stat-label">Uptime</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">24/7</div>
                                <div className="stat-label">Soporte</div>
                            </div>
                        </div>

                        <div className="features">
                            <div className="feature">
                                <div className="feature-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </div>
                                <div className="feature-text">
                                    <strong>Ventas en tiempo real</strong>
                                    <span>Procesa pagos y genera tickets al instante</span>
                                </div>
                            </div>
                            <div className="feature">
                                <div className="feature-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                        <line x1="12" y1="22.08" x2="12" y2="12" />
                                    </svg>
                                </div>
                                <div className="feature-text">
                                    <strong>Control de inventario</strong>
                                    <span>Stock automático y alertas de reorden</span>
                                </div>
                            </div>
                            <div className="feature">
                                <div className="feature-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="20" x2="18" y2="10" />
                                        <line x1="12" y1="20" x2="12" y2="4" />
                                        <line x1="6" y1="20" x2="6" y2="14" />
                                    </svg>
                                </div>
                                <div className="feature-text">
                                    <strong>Reportes detallados</strong>
                                    <span>Analítica de ventas y productos</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="branding-footer">
                        <span>© 2026 Sellast. Todos los derechos reservados.</span>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="login-form-container">
                    <div className="login-form-wrapper">
                        <div className="form-header">
                            <div className="form-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                            </div>
                            <h2>Iniciar Sesión</h2>
                            <p>Accede a tu panel de control</p>
                        </div>

                        <form onSubmit={handleLogin} className="login-form">
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

                            <div className="input-group">
                                <label>Correo electrónico</label>
                                <div className="input-wrapper">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@correo.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Contraseña</label>
                                <div className="input-wrapper">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    <span>Mantener sesión</span>
                                </label>
                                <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                            </div>

                            <button type="submit" className="login-button" disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className="spinner"></div>
                                        Verificando...
                                    </>
                                ) : (
                                    <>
                                        Ingresar al Sistema
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="demo-credentials">
                            <div className="demo-badge">DEMO</div>
                            <div className="demo-info">
                                <code>admin@sellast.com</code>
                                <span>/</span>
                                <code>admin123</code>
                            </div>
                        </div>

                        <div className="form-footer">
                            <span>¿Necesitas ayuda?</span>
                            <a href="#">Contactar soporte</a>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .login-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0B0F19 0%, #1a1f35 50%, #0B0F19 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
                    padding: 1rem;
                }

                .login-container {
                    display: flex;
                    width: 100%;
                    max-width: 1100px;
                    min-height: 650px;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05);
                }

                /* LEFT SIDE - BRANDING */
                .login-branding {
                    flex: 1.1;
                    background: linear-gradient(160deg, #111827 0%, #0d1424 100%);
                    padding: 2.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                }

                .login-branding::before {
                    content: '';
                    position: absolute;
                    top: -100px;
                    right: -100px;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(255, 77, 109, 0.15) 0%, transparent 70%);
                    pointer-events: none;
                }

                .login-branding::after {
                    content: '';
                    position: absolute;
                    bottom: -50px;
                    left: -50px;
                    width: 200px;
                    height: 200px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
                    pointer-events: none;
                }

                .branding-content {
                    position: relative;
                    z-index: 1;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 2.5rem;
                }

                .logo-icon {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #FF4D6D, #f97316);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 15px rgba(255, 77, 109, 0.3);
                }

                .logo-icon svg {
                    width: 24px;
                    height: 24px;
                    color: white;
                }

                .logo-text {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.75rem;
                    font-weight: 600;
                    color: #F8FAFC;
                }

                .logo-text .dot {
                    color: #FF4D6D;
                }

                .login-branding h1 {
                    font-size: 2.75rem;
                    font-weight: 700;
                    color: #F8FAFC;
                    line-height: 1.15;
                    margin-bottom: 1rem;
                    letter-spacing: -0.02em;
                }

                .login-branding h1 .highlight {
                    background: linear-gradient(90deg, #FF4D6D, #f97316);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .login-branding > .branding-content > p {
                    color: #94A3B8;
                    font-size: 1.05rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    max-width: 380px;
                }

                .stats-row {
                    display: flex;
                    gap: 2rem;
                    margin-bottom: 2.5rem;
                    padding: 1.25rem 0;
                    border-top: 1px solid rgba(255,255,255,0.08);
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                }

                .stat {
                    text-align: left;
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #F8FAFC;
                    line-height: 1;
                }

                .stat-label {
                    font-size: 0.8rem;
                    color: #64748B;
                    margin-top: 0.25rem;
                }

                .features {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .feature {
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                }

                .feature-icon {
                    width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .feature-icon svg {
                    width: 22px;
                    height: 22px;
                    color: #FF4D6D;
                }

                .feature-text {
                    display: flex;
                    flex-direction: column;
                    gap: 0.1rem;
                }

                .feature-text strong {
                    color: #F8FAFC;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .feature-text span {
                    color: #64748B;
                    font-size: 0.8rem;
                }

                .branding-footer {
                    position: relative;
                    z-index: 1;
                    color: #475569;
                    font-size: 0.8rem;
                }

                /* RIGHT SIDE - FORM */
                .login-form-container {
                    flex: 0.9;
                    background: #FFFFFF;
                    padding: 3rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .login-form-wrapper {
                    width: 100%;
                    max-width: 340px;
                }

                .form-header {
                    margin-bottom: 2rem;
                    text-align: center;
                }

                .form-icon {
                    width: 56px;
                    height: 56px;
                    background: linear-gradient(135deg, rgba(255, 77, 109, 0.1), rgba(249, 115, 22, 0.1));
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.25rem;
                }

                .form-icon svg {
                    width: 26px;
                    height: 26px;
                    color: #FF4D6D;
                }

                .form-header h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #0F172A;
                    margin-bottom: 0.35rem;
                }

                .form-header p {
                    color: #64748B;
                    font-size: 0.9rem;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #dc2626;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .input-group label {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #374151;
                }

                .input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: #F8FAFC;
                    border: 1.5px solid #E2E8F0;
                    border-radius: 12px;
                    padding: 0 1rem;
                    transition: all 0.2s;
                }

                .input-wrapper:focus-within {
                    border-color: #FF4D6D;
                    box-shadow: 0 0 0 4px rgba(255, 77, 109, 0.1);
                    background: white;
                }

                .input-wrapper svg {
                    color: #94A3B8;
                    flex-shrink: 0;
                }

                .input-wrapper input {
                    flex: 1;
                    background: none;
                    border: none;
                    outline: none;
                    padding: 0.9rem 0;
                    font-size: 0.95rem;
                    color: #0F172A;
                }

                .input-wrapper input::placeholder {
                    color: #94A3B8;
                }

                .form-options {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.85rem;
                }

                .remember-me {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #64748B;
                    cursor: pointer;
                }

                .remember-me input {
                    accent-color: #FF4D6D;
                    width: 16px;
                    height: 16px;
                }

                .forgot-password {
                    color: #FF4D6D;
                    text-decoration: none;
                    font-weight: 500;
                }

                .forgot-password:hover {
                    text-decoration: underline;
                }

                .login-button {
                    background: linear-gradient(135deg, #FF4D6D, #f97316);
                    color: white;
                    border: none;
                    padding: 1rem;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                }

                .login-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255, 77, 109, 0.35);
                }

                .login-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .demo-credentials {
                    margin-top: 1.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 0.85rem;
                    background: #F8FAFC;
                    border-radius: 10px;
                    border: 1px dashed #E2E8F0;
                }

                .demo-badge {
                    background: linear-gradient(135deg, #FF4D6D, #f97316);
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 700;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    letter-spacing: 0.05em;
                }

                .demo-info {
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    color: #64748B;
                    font-size: 0.85rem;
                }

                .demo-info code {
                    background: white;
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.8rem;
                    color: #0F172A;
                    border: 1px solid #E2E8F0;
                }

                .form-footer {
                    margin-top: 2rem;
                    text-align: center;
                    font-size: 0.85rem;
                    color: #64748B;
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .form-footer a {
                    color: #FF4D6D;
                    text-decoration: none;
                    font-weight: 500;
                }

                .form-footer a:hover {
                    text-decoration: underline;
                }

                /* RESPONSIVE */
                @media (max-width: 900px) {
                    .login-container {
                        flex-direction: column;
                        min-height: auto;
                    }

                    .login-branding {
                        padding: 2rem;
                    }

                    .login-branding h1 {
                        font-size: 2rem;
                    }

                    .stats-row {
                        gap: 1.5rem;
                    }

                    .features {
                        display: none;
                    }

                    .login-form-container {
                        padding: 2rem;
                    }
                }

                @media (max-width: 480px) {
                    .login-page {
                        padding: 0;
                    }

                    .login-container {
                        border-radius: 0;
                    }

                    .login-branding {
                        padding: 1.5rem;
                    }

                    .stats-row {
                        gap: 1rem;
                    }

                    .stat-value {
                        font-size: 1.25rem;
                    }
                }
            `}</style>
        </div>
    );
}
