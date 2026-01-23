'use client';

// ============================================
// ADMIN - CONCILIACIÓN BANCARIA
// ============================================

import { useState, useEffect } from 'react';
import { KPISummary } from '@/components/admin/KPISummary';
import { getBankAccounts, getBankTransactions, getPendingTransactions, reconcileTransaction, createConciliacion, BankAccount, BankTransaction } from '@/stores/bankReconciliationStore';

export default function ConciliacionPage() {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [transactions, setTransactions] = useState<BankTransaction[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<string>('');
    const [showConciliarModal, setShowConciliarModal] = useState(false);

    useEffect(() => {
        setAccounts(getBankAccounts());
        setTransactions(getBankTransactions());
    }, []);

    const pendingCount = transactions.filter(t => !t.conciliado).length;
    const totalDepositos = transactions.filter(t => t.tipo === 'deposito').reduce((sum, t) => sum + t.monto, 0);
    const totalRetiros = Math.abs(transactions.filter(t => t.tipo === 'retiro' || t.tipo === 'comision').reduce((sum, t) => sum + t.monto, 0));

    const handleReconcile = (id: string) => {
        reconcileTransaction(id);
        setTransactions(getBankTransactions());
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#1f2937',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Conciliación Bancaria
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Concilia los movimientos bancarios con el sistema
                    </p>
                </div>
                <button
                    onClick={() => setShowConciliarModal(true)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#2563EB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Nueva Conciliación
                </button>
            </div>

            {/* KPIs */}
            <KPISummary cards={[
                { label: 'Cuenta Principal', value: accounts[0]?.banco || '—', color: 'blue' },
                { label: 'Saldo Actual', value: accounts[0]?.saldoActual.toFixed(2) || '0', color: 'green', prefix: '$ ' },
                { label: 'Pendientes', value: pendingCount, color: 'amber' },
                { label: 'Total Depósitos', value: totalDepositos.toFixed(2), color: 'cyan', prefix: '$ ' }
            ]} />

            {/* Accounts */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Cuentas Bancarias</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {accounts.map(acc => (
                        <div
                            key={acc.id}
                            style={{
                                border: selectedAccount === acc.id ? '2px solid #3B82F6' : '1px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '1rem',
                                cursor: 'pointer',
                                background: selectedAccount === acc.id ? '#EFF6FF' : 'white'
                            }}
                            onClick={() => setSelectedAccount(acc.id)}
                        >
                            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{acc.banco}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>Cuenta: {acc.cuenta}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>CLABE: {acc.clabe}</div>
                            <div style={{ marginTop: '0.75rem', fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>
                                $ {acc.saldoActual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transactions Table */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Movimientos Bancarios</h3>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{transactions.length} movimientos</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>FECHA</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>CONCEPTO</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>REFERENCIA</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>MONTO</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>ESTADO</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem', color: '#6b7280' }}>{t.fecha}</td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{t.concepto}</td>
                                <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#6b7280' }}>{t.referencia}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: t.monto >= 0 ? '#10B981' : '#EF4444' }}>
                                    {t.monto >= 0 ? '+' : ''}${Math.abs(t.monto).toFixed(2)}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: t.conciliado ? '#D1FAE5' : '#FEF3C7',
                                        color: t.conciliado ? '#10B981' : '#D97706'
                                    }}>
                                        {t.conciliado ? 'Conciliado' : 'Pendiente'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    {!t.conciliado && (
                                        <button
                                            onClick={() => handleReconcile(t.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#10B981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontWeight: 600,
                                                fontSize: '0.8rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Conciliar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
