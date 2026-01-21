'use client';

import { useState } from 'react';

interface Sale {
    id: string;
    folio: string;
    fecha: string;
    cliente: string;
    total: number;
    estado: 'completada' | 'anulada' | 'pendiente';
    tipoComprobante: 'ticket' | 'boleta' | 'factura';
    metodoPago: string;
}

const mockSales: Sale[] = [
    { id: '1', folio: 'V00000001', fecha: '21/01/2026 10:30', cliente: 'Cliente General', total: 125.00, estado: 'completada', tipoComprobante: 'ticket', metodoPago: 'Efectivo' },
    { id: '2', folio: 'V00000002', fecha: '21/01/2026 11:15', cliente: 'Cristiano Ronaldo', total: 350.50, estado: 'completada', tipoComprobante: 'factura', metodoPago: 'Tarjeta' },
    { id: '3', folio: 'V00000003', fecha: '21/01/2026 12:00', cliente: 'Lionel Messi', total: 89.00, estado: 'anulada', tipoComprobante: 'ticket', metodoPago: 'Efectivo' },
    { id: '4', folio: 'V00000004', fecha: '21/01/2026 14:30', cliente: 'Cliente General', total: 215.75, estado: 'completada', tipoComprobante: 'boleta', metodoPago: 'Transferencia' },
    { id: '5', folio: 'V00000005', fecha: '21/01/2026 15:45', cliente: 'Cristian Cueva', total: 450.00, estado: 'pendiente', tipoComprobante: 'factura', metodoPago: 'Crédito' },
];

export default function HistorialVentasPage() {
    const [sales] = useState<Sale[]>(mockSales);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('todas');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const filteredSales = sales.filter(sale => {
        const matchesSearch = sale.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.cliente.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEstado = estadoFilter === 'todas' || sale.estado === estadoFilter;
        return matchesSearch && matchesEstado;
    });

    const totalVentas = sales.filter(s => s.estado === 'completada').reduce((sum, s) => sum + s.total, 0);
    const ventasHoy = sales.filter(s => s.estado === 'completada').length;
    const ventasAnuladas = sales.filter(s => s.estado === 'anulada').length;

    const getEstadoBadge = (estado: string) => {
        const styles: Record<string, React.CSSProperties> = {
            completada: { background: '#10B981', color: 'white' },
            anulada: { background: '#EF4444', color: 'white' },
            pendiente: { background: '#F59E0B', color: 'white' }
        };
        return {
            ...styles[estado],
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'capitalize' as const
        };
    };

    const getComprobanteBadge = (tipo: string) => {
        const styles: Record<string, React.CSSProperties> = {
            ticket: { background: '#E5E7EB', color: '#374151' },
            boleta: { background: '#DBEAFE', color: '#1D4ED8' },
            factura: { background: '#FEF3C7', color: '#D97706' }
        };
        return {
            ...styles[tipo],
            padding: '0.25rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'capitalize' as const
        };
    };

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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Historial de Ventas
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Consulta todas las transacciones realizadas
                    </p>
                </div>
                <button style={{
                    padding: '0.75rem 1rem',
                    background: '#10B981',
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
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Exportar
                </button>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #10B981'
                }}>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        Total Ventas Hoy
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10B981' }}>
                        $ {totalVentas.toFixed(2)}
                    </div>
                </div>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #3B82F6'
                }}>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        Transacciones
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#3B82F6' }}>
                        {ventasHoy}
                    </div>
                </div>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #EF4444'
                }}>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        Anuladas
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#EF4444' }}>
                        {ventasAnuladas}
                    </div>
                </div>
            </div>

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
                alignItems: 'flex-end'
            }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.35rem' }}>Buscar</label>
                    <input
                        type="text"
                        placeholder="Folio o cliente..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.35rem' }}>Estado</label>
                    <select
                        value={estadoFilter}
                        onChange={e => setEstadoFilter(e.target.value)}
                        style={{
                            padding: '0.6rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            minWidth: '150px'
                        }}
                    >
                        <option value="todas">Todas</option>
                        <option value="completada">Completadas</option>
                        <option value="anulada">Anuladas</option>
                        <option value="pendiente">Pendientes</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.35rem' }}>Desde</label>
                    <input
                        type="date"
                        value={fechaDesde}
                        onChange={e => setFechaDesde(e.target.value)}
                        style={{
                            padding: '0.6rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.35rem' }}>Hasta</label>
                    <input
                        type="date"
                        value={fechaHasta}
                        onChange={e => setFechaHasta(e.target.value)}
                        style={{
                            padding: '0.6rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
                <button style={{
                    padding: '0.6rem 1rem',
                    background: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                }}>
                    Filtrar
                </button>
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
                        <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Folio</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Fecha</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Cliente</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Estado</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Comprobante</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Pago</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSales.map(sale => (
                            <tr key={sale.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem', fontWeight: 600, color: '#3B82F6' }}>{sale.folio}</td>
                                <td style={{ padding: '1rem', color: '#6b7280' }}>{sale.fecha}</td>
                                <td style={{ padding: '1rem' }}>{sale.cliente}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>$ {sale.total.toFixed(2)}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={getEstadoBadge(sale.estado)}>{sale.estado}</span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={getComprobanteBadge(sale.tipoComprobante)}>{sale.tipoComprobante}</span>
                                </td>
                                <td style={{ padding: '1rem', color: '#6b7280' }}>{sale.metodoPago}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                        <button
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#06B6D4',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title="Ver ticket"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>
                                        <button
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#3B82F6',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title="Reimprimir"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                <polyline points="6 9 6 2 18 2 18 9" />
                                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                                <rect x="6" y="14" width="12" height="8" />
                                            </svg>
                                        </button>
                                        {sale.estado === 'completada' && (
                                            <button
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: '#EF4444',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title="Anular"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="15" y1="9" x2="9" y2="15" />
                                                    <line x1="9" y1="9" x2="15" y2="15" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredSales.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                        No se encontraron ventas
                    </div>
                )}
            </div>
        </div>
    );
}
