'use client';

import { useState } from 'react';

interface Debt {
    id: string;
    cliente: string;
    documento: string;
    totalDeuda: number;
    cuotasPendientes: number;
    cuotasVencidas: number;
    proximoVencimiento: string;
    estado: 'pendiente' | 'vencido';
}

const mockDebts: Debt[] = [
    {
        id: '1',
        cliente: 'Cristiano Ronaldo',
        documento: '45214589',
        totalDeuda: 810.83,
        cuotasPendientes: 17,
        cuotasVencidas: 1,
        proximoVencimiento: '29/11/2025',
        estado: 'vencido'
    },
    {
        id: '2',
        cliente: 'Lionel Messi',
        documento: '42201458',
        totalDeuda: 225.00,
        cuotasPendientes: 5,
        cuotasVencidas: 0,
        proximoVencimiento: '30/11/2025',
        estado: 'pendiente'
    }
];

interface AccountsReceivableModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccountsReceivableModal({ isOpen, onClose }: AccountsReceivableModalProps) {
    const [debts] = useState<Debt[]>(mockDebts);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('pendientes');
    const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

    if (!isOpen) return null;

    const filteredDebts = debts.filter(d => {
        const matchesSearch = d.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.documento.includes(searchTerm);
        const matchesFilter = filterStatus === 'todas' ||
            (filterStatus === 'pendientes' && d.estado === 'pendiente') ||
            (filterStatus === 'vencidas' && d.estado === 'vencido');
        return matchesSearch && matchesFilter;
    });

    const totalDeuda = debts.reduce((sum, d) => sum + d.totalDeuda, 0);
    const clientesConDeuda = debts.length;
    const cuotasVencidas = debts.reduce((sum, d) => sum + d.cuotasVencidas, 0);

    const modalStyles: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
    };

    const contentStyles: React.CSSProperties = {
        background: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
    };

    const headerStyles: React.CSSProperties = {
        background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    return (
        <div style={modalStyles} onClick={onClose}>
            <div style={contentStyles} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={headerStyles}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Cuentas por Cobrar - Gestión de Créditos</span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            cursor: 'pointer'
                        }}
                    >×</button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {/* Search & Filter Row */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                            <svg
                                width="18" height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#9ca3af"
                                strokeWidth="2"
                                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar cliente por nombre o documento..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            style={{
                                padding: '0.75rem 1rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                minWidth: '150px'
                            }}
                        >
                            <option value="pendientes">Pendientes</option>
                            <option value="vencidas">Vencidas</option>
                            <option value="todas">Todas</option>
                        </select>
                        <button style={{
                            padding: '0.75rem 1rem',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            color: '#3B82F6',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 4 23 10 17 10" />
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                            </svg>
                            Actualizar
                        </button>
                    </div>

                    {/* KPI Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{
                            background: '#DC2626',
                            color: 'white',
                            padding: '1.25rem',
                            borderRadius: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                Total Deuda
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>$ {totalDeuda.toFixed(2)}</div>
                        </div>
                        <div style={{
                            background: '#F59E0B',
                            color: 'white',
                            padding: '1.25rem',
                            borderRadius: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                Clientes con Deuda
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{clientesConDeuda}</div>
                        </div>
                        <div style={{
                            background: '#06B6D4',
                            color: 'white',
                            padding: '1.25rem',
                            borderRadius: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Cuotas Vencidas
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{cuotasVencidas}</div>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{
                        background: '#f9fafb',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ background: '#f3f4f6' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>CLIENTE</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>DOCUMENTO</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>TOTAL DEUDA</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>CUOTAS PENDIENTES</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>PRÓXIMO VENCIMIENTO</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>ESTADO</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDebts.map(debt => (
                                    <tr key={debt.id} style={{ background: 'white', borderTop: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{debt.cliente}</td>
                                        <td style={{ padding: '1rem', color: '#6b7280' }}>{debt.documento}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#3B82F6' }}>
                                            $ {debt.totalDeuda.toFixed(2)}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                                <span style={{
                                                    padding: '0.2rem 0.5rem',
                                                    background: '#F59E0B',
                                                    color: 'white',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600
                                                }}>
                                                    {debt.cuotasPendientes} cuotas
                                                </span>
                                                {debt.cuotasVencidas > 0 && (
                                                    <span style={{
                                                        padding: '0.2rem 0.5rem',
                                                        background: '#DC2626',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600
                                                    }}>
                                                        {debt.cuotasVencidas} vencidas
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>{debt.proximoVencimiento}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '0.35rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                background: debt.estado === 'vencido' ? '#FEE2E2' : '#FEF3C7',
                                                color: debt.estado === 'vencido' ? '#DC2626' : '#F59E0B',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}>
                                                {debt.estado === 'vencido' ? (
                                                    <>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                                            <line x1="12" y1="9" x2="12" y2="13" />
                                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                                        </svg>
                                                        Vencido
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <polyline points="12 6 12 12 16 14" />
                                                        </svg>
                                                        Pendiente
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => setSelectedDebt(debt)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: '#7C3AED',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem'
                                                }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                Ver Deudas
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Progress bar decoration */}
                    <div style={{
                        height: '6px',
                        background: 'linear-gradient(90deg, #3B82F6 0%, #7C3AED 100%)',
                        borderRadius: '3px',
                        marginTop: '1.5rem'
                    }}></div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#6B7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        Cerrar
                    </button>
                </div>
            </div>

            {/* Sub-modal: Detalle de Deudas del Cliente */}
            {selectedDebt && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1100
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        width: '90%',
                        maxWidth: '500px',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1f2937' }}>
                                Deudas de {selectedDebt.cliente}
                            </h3>
                            <button
                                onClick={() => setSelectedDebt(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#6b7280' }}
                            >×</button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Documento</label>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{selectedDebt.documento}</p>
                                </div>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Estado</label>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: selectedDebt.estado === 'vencido' ? '#FEE2E2' : '#FEF3C7',
                                        color: selectedDebt.estado === 'vencido' ? '#DC2626' : '#92400E'
                                    }}>
                                        {selectedDebt.estado === 'vencido' ? 'Vencido' : 'Pendiente'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px' }}>
                                <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Deuda</label>
                                <p style={{
                                    margin: 0,
                                    fontWeight: 700,
                                    fontSize: '1.75rem',
                                    color: '#DC2626',
                                    fontFamily: 'monospace'
                                }}>$ {selectedDebt.totalDeuda.toFixed(2)}</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Cuotas Pendientes</label>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1.25rem' }}>{selectedDebt.cuotasPendientes}</p>
                                </div>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Cuotas Vencidas</label>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '1.25rem', color: selectedDebt.cuotasVencidas > 0 ? '#DC2626' : '#059669' }}>
                                        {selectedDebt.cuotasVencidas}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Próximo Vencimiento</label>
                                <p style={{ margin: 0, fontWeight: 500 }}>{selectedDebt.proximoVencimiento}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => setSelectedDebt(null)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#F1F5F9',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >Cerrar</button>
                            <button
                                onClick={() => alert('Funcionalidad de registro de pago en desarrollo')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#10B981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >Registrar Pago</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
