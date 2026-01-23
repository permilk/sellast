'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { KPISummary } from '@/components/admin/KPISummary';
import {
    getQuotations,
    deleteQuotation,
    updateQuotationStatus,
    checkExpiredQuotations,
    Quotation
} from '@/stores/quotationsStore';

// Status badge colors
const estadoStyles: Record<string, React.CSSProperties> = {
    pendiente: { background: '#F59E0B', color: 'white' },
    enviada: { background: '#3B82F6', color: 'white' },
    aceptada: { background: '#10B981', color: 'white' },
    rechazada: { background: '#EF4444', color: 'white' },
    expirada: { background: '#6B7280', color: 'white' },
    convertida: { background: '#8B5CF6', color: 'white' }
};

const estadoLabels: Record<string, string> = {
    pendiente: 'Pendiente',
    enviada: 'Enviada',
    aceptada: 'Aceptada',
    rechazada: 'Rechazada',
    expirada: 'Expirada',
    convertida: 'Convertida'
};

export default function CotizacionesPage() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

    // Load quotations on mount
    useEffect(() => {
        checkExpiredQuotations();
        setQuotations(getQuotations());
    }, []);

    // Filter quotations
    const filteredQuotations = useMemo(() => {
        return quotations.filter(q => {
            const matchesSearch =
                q.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'todos' || q.estado === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [quotations, searchTerm, statusFilter]);

    const handleDelete = () => {
        if (selectedQuotation) {
            deleteQuotation(selectedQuotation.id);
            setQuotations(getQuotations());
            setShowDeleteModal(false);
            setSelectedQuotation(null);
        }
    };

    const handleStatusChange = (id: string, newStatus: Quotation['estado']) => {
        updateQuotationStatus(id, newStatus);
        setQuotations(getQuotations());
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getEstadoBadge = (estado: string) => ({
        ...estadoStyles[estado],
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'capitalize' as const
    });

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <path d="M16 13H8" />
                            <path d="M16 17H8" />
                            <path d="M10 9H8" />
                        </svg>
                        Gestión de Cotizaciones
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Gestiona tus cotizaciones y conviértelas en ventas
                    </p>
                </div>
                <Link href="/admin/cotizaciones/nuevo">
                    <button style={{
                        padding: '0.75rem 1rem',
                        background: '#2563EB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Nueva Cotización
                    </button>
                </Link>
            </div>

            {/* KPI Summary */}
            <KPISummary cards={[
                { label: 'Total Cotizaciones', value: quotations.length, color: 'blue' },
                { label: 'Pendientes', value: quotations.filter(q => q.estado === 'pendiente' || q.estado === 'enviada').length, color: 'amber' },
                { label: 'Aceptadas', value: quotations.filter(q => q.estado === 'aceptada').length, color: 'green' },
                { label: 'Valor Total', value: formatCurrency(quotations.reduce((sum, q) => sum + q.total, 0)), color: 'purple' }
            ]} />

            {/* Filters */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Buscar</label>
                    <input
                        type="text"
                        placeholder="Folio o cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
                <div style={{ minWidth: '150px' }}>
                    <label style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Estado</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 0.75rem',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            background: 'white'
                        }}
                    >
                        <option value="todos">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="enviada">Enviada</option>
                        <option value="aceptada">Aceptada</option>
                        <option value="rechazada">Rechazada</option>
                        <option value="expirada">Expirada</option>
                        <option value="convertida">Convertida</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                {filteredQuotations.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>No hay cotizaciones</p>
                        <p style={{ fontSize: '0.875rem' }}>Crea tu primera cotización para comenzar</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Folio</th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Cliente</th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Fecha</th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Total</th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Estado</th>
                                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuotations.map((q) => (
                                <tr key={q.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600, color: '#2563EB' }}>{q.folio}</td>
                                    <td style={{ padding: '1rem', color: '#1F2937' }}>{q.cliente.nombre}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: '#6B7280' }}>{formatDate(q.fecha)}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#1F2937' }}>{formatCurrency(q.total)}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={getEstadoBadge(q.estado)}>
                                            {estadoLabels[q.estado]}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => { setSelectedQuotation(q); setShowDetailModal(true); }}
                                                style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }}
                                                title="Ver detalle"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => { setSelectedQuotation(q); setShowDeleteModal(true); }}
                                                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }}
                                                title="Eliminar"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedQuotation && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1F2937' }}>
                                    Cotización {selectedQuotation.folio}
                                </h2>
                                <p style={{ margin: '0.25rem 0 0', color: '#6B7280', fontSize: '0.875rem' }}>
                                    Creada el {formatDate(selectedQuotation.fecha)}
                                </p>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#F9FAFB', borderRadius: '8px' }}>
                                <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Cliente</h3>
                                <p style={{ margin: 0, fontWeight: 600, color: '#1F2937' }}>{selectedQuotation.cliente.nombre}</p>
                            </div>

                            <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Productos</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                                <thead>
                                    <tr style={{ background: '#F9FAFB' }}>
                                        <th style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>Producto</th>
                                        <th style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>Cant.</th>
                                        <th style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedQuotation.items.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                            <td style={{ padding: '0.5rem', color: '#1F2937' }}>{item.nombre}</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'center', color: '#6B7280' }}>{item.cantidad}</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 500, color: '#1F2937' }}>{formatCurrency(item.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem' }}>
                                    <span>Total</span>
                                    <span style={{ color: '#7C3AED' }}>{formatCurrency(selectedQuotation.total)}</span>
                                </div>
                            </div>

                            {(selectedQuotation.estado === 'pendiente' || selectedQuotation.estado === 'enviada') && (
                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => { handleStatusChange(selectedQuotation.id, 'aceptada'); setShowDetailModal(false); }}
                                        style={{ flex: 1, padding: '0.75rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        ✓ Aceptar
                                    </button>
                                    <button
                                        onClick={() => { handleStatusChange(selectedQuotation.id, 'rechazada'); setShowDetailModal(false); }}
                                        style={{ flex: 1, padding: '0.75rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        ✗ Rechazar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedQuotation && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '90%', maxWidth: '400px', padding: '2rem', textAlign: 'center' }}>
                        <h3 style={{ margin: '0 0 0.5rem', color: '#1F2937' }}>¿Eliminar cotización?</h3>
                        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
                            Se eliminará <strong>{selectedQuotation.folio}</strong> permanentemente
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                                Cancelar
                            </button>
                            <button onClick={handleDelete} style={{ flex: 1, padding: '0.75rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
