'use client';

// ============================================
// CASH OPEN MODAL - APERTURA DE CAJA
// ============================================

import { useState } from 'react';

interface CashOpenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { turnoId: string; nombre: string; montoInicial: number }) => void;
}

export default function CashOpenModal({ isOpen, onClose, onConfirm }: CashOpenModalProps) {
    const [activeTab, setActiveTab] = useState<'nuevo' | 'continuar'>('nuevo');
    const [montoInicial, setMontoInicial] = useState('0.00');

    // Generate turno ID
    const turnoId = `TURNO-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`;
    const nombreTurno = `TURNO-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}/ ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`;

    if (!isOpen) return null;

    const handleSubmit = () => {
        onConfirm({
            turnoId,
            nombre: nombreTurno,
            montoInicial: parseFloat(montoInicial) || 0
        });
    };

    return (
        <div className="pos-modal-overlay" onClick={onClose}>
            <div className="pos-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header with Tabs */}
                <div className="pos-modal-header" style={{ padding: 0, borderBottom: 'none' }}>
                    <div className="pos-modal-title" style={{ padding: '1.5rem 1.5rem 0' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Apertura de Caja
                    </div>
                    <button className="pos-modal-close" onClick={onClose} style={{ margin: '1rem' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="pos-modal-tabs">
                    <button
                        className={`pos-modal-tab ${activeTab === 'nuevo' ? 'active' : ''}`}
                        onClick={() => setActiveTab('nuevo')}
                    >
                        Nuevo Turno
                    </button>
                    <button
                        className={`pos-modal-tab ${activeTab === 'continuar' ? 'active' : ''}`}
                        onClick={() => setActiveTab('continuar')}
                    >
                        Continuar Turno
                    </button>
                </div>

                {/* Body */}
                <div className="pos-modal-body">
                    {activeTab === 'nuevo' ? (
                        <>
                            {/* Código de Turno */}
                            <div className="pos-form-group">
                                <label>Código de Turno</label>
                                <input
                                    type="text"
                                    value={turnoId}
                                    readOnly
                                    style={{ backgroundColor: '#f8fafc', cursor: 'not-allowed' }}
                                />
                            </div>

                            {/* Nombre del Turno */}
                            <div className="pos-form-group">
                                <label>Nombre del Turno</label>
                                <input
                                    type="text"
                                    value={nombreTurno}
                                    readOnly
                                    style={{ backgroundColor: '#f8fafc', cursor: 'not-allowed' }}
                                />
                            </div>

                            {/* Monto Inicial */}
                            <div className="pos-form-group">
                                <label>Monto Inicial (Caja Chica)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{
                                        padding: '0.75rem 1rem',
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRight: 'none',
                                        borderRadius: '6px 0 0 6px',
                                        color: '#64748b',
                                        fontWeight: 600
                                    }}>
                                        S/
                                    </span>
                                    <input
                                        type="number"
                                        value={montoInicial}
                                        onChange={(e) => setMontoInicial(e.target.value)}
                                        step="0.01"
                                        min="0"
                                        style={{
                                            borderRadius: '0 6px 6px 0',
                                            textAlign: 'right'
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            color: '#64748b'
                        }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1rem', opacity: 0.5 }}>
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <p>No hay turnos abiertos para continuar</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="pos-modal-footer">
                    <button className="btn-pos btn-pos-outline" onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className="btn-pos btn-pos-cyan btn-pos-lg"
                        onClick={handleSubmit}
                        disabled={activeTab === 'continuar'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 11 12 14 22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        Abrir Turno
                    </button>
                </div>
            </div>
        </div>
    );
}
