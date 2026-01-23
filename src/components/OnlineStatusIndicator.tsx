'use client';

// ============================================
// ONLINE STATUS INDICATOR COMPONENT
// ============================================

import { useEffect, useState } from 'react';
import { useOfflineSalesStore } from '@/stores/offlineSalesStore';

export default function OnlineStatusIndicator() {
    const [isOnline, setIsOnline] = useState(true);
    const [showBanner, setShowBanner] = useState(false);
    const { pendingSales, syncPendingSales } = useOfflineSalesStore();

    const pendingCount = pendingSales.filter(s => !s.synced).length;

    useEffect(() => {
        const updateStatus = () => {
            const online = navigator.onLine;
            setIsOnline(online);
            setShowBanner(!online || pendingCount > 0);

            if (online && pendingCount > 0) {
                syncPendingSales();
            }
        };

        updateStatus();

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        };
    }, [pendingCount, syncPendingSales]);

    if (!showBanner) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            padding: '0.75rem 1rem',
            background: isOnline
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(185, 28, 28, 0.95))',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 9999,
            animation: 'slideIn 0.3s ease'
        }}>
            <style jsx>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>

            <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'white',
                animation: isOnline ? 'none' : 'pulse 1.5s infinite'
            }} />

            <div>
                <div style={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                }}>
                    {isOnline ? '✓ Conectado' : '⚠ Sin conexión'}
                </div>
                {pendingCount > 0 && (
                    <div style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.75rem'
                    }}>
                        {pendingCount} venta{pendingCount > 1 ? 's' : ''} pendiente{pendingCount > 1 ? 's' : ''} de sincronizar
                    </div>
                )}
            </div>

            {isOnline && pendingCount > 0 && (
                <button
                    onClick={() => syncPendingSales()}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    title="Sincronizar ahora"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 4 23 10 17 10" />
                        <polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                </button>
            )}
        </div>
    );
}
