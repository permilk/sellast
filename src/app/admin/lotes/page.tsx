'use client';

// ============================================
// ADMIN - LOTES Y CADUCIDADES
// ============================================

import { useState, useEffect } from 'react';
import { KPISummary } from '@/components/admin/KPISummary';
import { getBatches, getExpiringBatches, getExpiredBatches, addBatch, Batch } from '@/stores/batchStore';

export default function LotesPage() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [expiring, setExpiring] = useState<Batch[]>([]);
    const [expired, setExpired] = useState<Batch[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filter, setFilter] = useState<'all' | 'expiring' | 'expired'>('all');

    useEffect(() => {
        setBatches(getBatches());
        setExpiring(getExpiringBatches(30));
        setExpired(getExpiredBatches());
    }, []);

    const displayBatches = filter === 'expiring' ? expiring : filter === 'expired' ? expired : batches;

    const estadoStyles: Record<string, { bg: string; color: string }> = {
        activo: { bg: '#D1FAE5', color: '#10B981' },
        bajo: { bg: '#FEF3C7', color: '#D97706' },
        vencido: { bg: '#FEE2E2', color: '#EF4444' },
        agotado: { bg: '#E5E7EB', color: '#6B7280' }
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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Lotes y Caducidades
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Control de lotes, fechas de producción y vencimiento
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#2563EB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Registrar Lote
                </button>
            </div>

            {/* KPIs */}
            <KPISummary cards={[
                { label: 'Lotes Activos', value: batches.filter(b => b.estado === 'activo').length, color: 'green' },
                { label: 'Por Vencer (30 días)', value: expiring.length, color: 'amber' },
                { label: 'Vencidos', value: expired.length, color: 'red' },
                { label: 'Total Lotes', value: batches.length, color: 'blue' }
            ]} />

            {/* Filters */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.5rem'
            }}>
                {[
                    { key: 'all', label: 'Todos' },
                    { key: 'expiring', label: `⚠️ Por Vencer (${expiring.length})` },
                    { key: 'expired', label: `❌ Vencidos (${expired.length})` }
                ].map(f => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key as typeof filter)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: filter === f.key ? '#3B82F6' : 'white',
                            color: filter === f.key ? 'white' : '#374151',
                            border: filter === f.key ? 'none' : '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>LOTE</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>PRODUCTO</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>F. PRODUCCIÓN</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>F. VENCIMIENTO</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>CANTIDAD</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>ESTADO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayBatches.map(batch => {
                            const style = estadoStyles[batch.estado] || estadoStyles.activo;
                            const daysToExpiry = Math.ceil((new Date(batch.fechaVencimiento).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                            return (
                                <tr key={batch.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 600 }}>{batch.lote}</td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{batch.productName}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{batch.fechaProduccion || '—'}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{ color: daysToExpiry <= 7 ? '#EF4444' : daysToExpiry <= 30 ? '#D97706' : '#374151' }}>
                                            {batch.fechaVencimiento}
                                            {daysToExpiry > 0 && daysToExpiry <= 30 && (
                                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#D97706' }}>
                                                    ({daysToExpiry} días)
                                                </span>
                                            )}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{ fontWeight: 600 }}>{batch.cantidadActual}</span>
                                        <span style={{ color: '#9CA3AF' }}> / {batch.cantidadInicial}</span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: style.bg,
                                            color: style.color
                                        }}>
                                            {batch.estado.charAt(0).toUpperCase() + batch.estado.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
