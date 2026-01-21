'use client';

// ============================================
// POS LOGIN PAGE - PREMIUM DESIGN
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../pos-styles.css';

export default function POSLoginPage() {
    const router = useRouter();
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Simulate login - in production, this would be a real auth check
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (usuario && password) {
            // Redirect to POS dashboard
            router.push('/admin/pos/dashboard');
        } else {
            setError('Por favor ingresa usuario y contraseña');
        }
        
        setLoading(false);
    };

    return (
        <div className="pos-login-page pos-module">
            <div className="pos-login-card">
                {/* Logo */}
                <div className="pos-login-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="pos-login-title">Sistema ERP - Punto de Venta</h1>
                <p className="pos-login-subtitle">Ingrese sus credenciales</p>

                {/* Form */}
                <form className="pos-login-form" onSubmit={handleLogin}>
                    {/* Usuario */}
                    <div className="pos-login-input">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            autoComplete="username"
                            autoFocus
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="pos-login-input">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'left' }}>
                            {error}
                        </p>
                    )}

                    {/* Button */}
                    <button 
                        type="submit" 
                        className="pos-login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="animate-pulse">⏳</span>
                                Iniciando...
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                Iniciar Sesión
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
