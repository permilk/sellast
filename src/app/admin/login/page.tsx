'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulación de login - En producción conectar con auth real
        setTimeout(() => {
            if (email === 'admin@sellast.com' && password === 'admin123') {
                // Guardar sesión mock
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
                            <span className="logo-text">Sellast<span className="dot">.</span></span>
                        </div>
                        <h1>Sistema de Gestión<br />Empresarial</h1>
                        <p>Administra tu negocio de forma inteligente con nuestra plataforma todo-en-uno.</p>

                        <div className="features">
                            <div className="feature">
                                <div className="feature-icon">📊</div>
                                <span>Dashboard en tiempo real</span>
                            </div>
                            <div className="feature">
                                <div className="feature-icon">💳</div>
                                <span>Punto de Venta integrado</span>
                            </div>
                            <div className="feature">
                                <div className="feature-icon">📦</div>
                                <span>Control de inventario</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="login-form-container">
                    <div className="login-form-wrapper">
                        <div className="form-header">
                            <h2>Bienvenido</h2>
                            <p>Ingresa tus credenciales para acceder al panel</p>
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
                                        placeholder="admin@sellast.com"
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
                                    <span>Recuérdame</span>
                                </label>
                                <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                            </div>

                            <button type="submit" className="login-button" disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className="spinner"></div>
                                        Ingresando...
                                    </>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </form>

                        <div className="demo-credentials">
                            <p>Demo: <code>admin@sellast.com</code> / <code>admin123</code></p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .login-page {
                    min-height: 100vh;
                    background: #0B0F19;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Outfit', sans-serif;
                }

                .login-container {
                    display: flex;
                    width: 100%;
                    max-width: 1000px;
                    min-height: 600px;
                    margin: 2rem;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
                }

                /* LEFT SIDE - BRANDING */
                .login-branding {
                    flex: 1;
                    background: linear-gradient(135deg, #111827 0%, #1a1f35 50%, #0B0F19 100%);
                    padding: 3rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }

                .login-branding::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -50%;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(255, 77, 109, 0.1) 0%, transparent 70%);
                    pointer-events: none;
                }

                .branding-content {
                    position: relative;
                    z-index: 1;
                }

                .logo {
                    margin-bottom: 2rem;
                }

                .logo-text {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    font-weight: 600;
                    color: #F8FAFC;
                }

                .logo-text .dot {
                    color: #FF4D6D;
                }

                .login-branding h1 {
                    font-size: 2.5rem;
                    font-weight: 600;
                    color: #F8FAFC;
                    line-height: 1.2;
                    margin-bottom: 1rem;
                }

                .login-branding p {
                    color: #94A3B8;
                    font-size: 1rem;
                    line-height: 1.6;
                    margin-bottom: 2.5rem;
                }

                .features {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .feature {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: #94A3B8;
                    font-size: 0.95rem;
                }

                .feature-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 77, 109, 0.1);
                    border: 1px solid rgba(255, 77, 109, 0.2);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }

                /* RIGHT SIDE - FORM */
                .login-form-container {
                    flex: 1;
                    background: #FFFFFF;
                    padding: 3rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .login-form-wrapper {
                    width: 100%;
                    max-width: 360px;
                }

                .form-header {
                    margin-bottom: 2rem;
                    text-align: center;
                }

                .form-header h2 {
                    font-size: 1.75rem;
                    font-weight: 600;
                    color: #0F172A;
                    margin-bottom: 0.5rem;
                }

                .form-header p {
                    color: #64748B;
                    font-size: 0.95rem;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
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
                    border: 1px solid #E2E8F0;
                    border-radius: 12px;
                    padding: 0 1rem;
                    transition: all 0.2s;
                }

                .input-wrapper:focus-within {
                    border-color: #FF4D6D;
                    box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.1);
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
                    padding: 0.875rem 0;
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
                    background: #FF4D6D;
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
                    background: #fa3e5f;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 20px rgba(255, 77, 109, 0.3);
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
                    margin-top: 2rem;
                    text-align: center;
                    padding-top: 1.5rem;
                    border-top: 1px solid #E2E8F0;
                }

                .demo-credentials p {
                    color: #64748B;
                    font-size: 0.85rem;
                }

                .demo-credentials code {
                    background: #F1F5F9;
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.8rem;
                    color: #0F172A;
                }

                /* RESPONSIVE */
                @media (max-width: 768px) {
                    .login-container {
                        flex-direction: column;
                        margin: 0;
                        border-radius: 0;
                        min-height: 100vh;
                    }

                    .login-branding {
                        padding: 2rem;
                    }

                    .login-branding h1 {
                        font-size: 1.75rem;
                    }

                    .features {
                        display: none;
                    }

                    .login-form-container {
                        padding: 2rem;
                    }
                }
            `}</style>
        </div>
    );
}
