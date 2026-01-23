'use client';

import { useState, useEffect } from 'react';
import { exportToExcel } from '@/utils/exportExcel';
import { getSales, Sale as StoreSale } from '@/stores/salesStore';
import { getConfig } from '@/stores/configStore';

interface Sale {
    id: string;
    folio: string;
    fecha: string;
    cliente: string;
    total: number;
    estado: 'completada' | 'anulada' | 'pendiente';
    tipoComprobante: 'ticket' | 'boleta' | 'factura';
    metodoPago: string;
    items?: { producto: string; cantidad: number; precio: number }[];
}

// Initial demo sales (will be shown alongside localStorage sales)
const initialSales: Sale[] = [
    { id: 'demo-1', folio: 'V00000001', fecha: '21/01/2026 10:30', cliente: 'Cliente General', total: 125.00, estado: 'completada', tipoComprobante: 'ticket', metodoPago: 'Efectivo', items: [{ producto: 'Whisky JackDaniels', cantidad: 1, precio: 85 }, { producto: 'Coca Cola', cantidad: 2, precio: 20 }] },
    { id: 'demo-2', folio: 'V00000002', fecha: '21/01/2026 11:15', cliente: 'Cristiano Ronaldo', total: 350.50, estado: 'completada', tipoComprobante: 'factura', metodoPago: 'Tarjeta', items: [{ producto: 'Vodka Absolut', cantidad: 4, precio: 75 }, { producto: 'Agua San 1Lt', cantidad: 5, precio: 7 }] },
    { id: 'demo-3', folio: 'V00000003', fecha: '21/01/2026 12:00', cliente: 'Lionel Messi', total: 89.00, estado: 'anulada', tipoComprobante: 'ticket', metodoPago: 'Efectivo', items: [{ producto: 'Preparado', cantidad: 1, precio: 89 }] },
    { id: 'demo-4', folio: 'V00000004', fecha: '21/01/2026 14:30', cliente: 'Cliente General', total: 215.75, estado: 'completada', tipoComprobante: 'boleta', metodoPago: 'Transferencia', items: [{ producto: 'Tarro de leche gloria', cantidad: 10, precio: 3.5 }, { producto: 'Coca Cola', cantidad: 10, precio: 18 }] },
    { id: 'demo-5', folio: 'V00000005', fecha: '21/01/2026 15:45', cliente: 'Cristian Cueva', total: 450.00, estado: 'pendiente', tipoComprobante: 'factura', metodoPago: 'Crédito', items: [{ producto: 'Whisky JackDaniels', cantidad: 5, precio: 85 }, { producto: 'Preparado', cantidad: 1, precio: 25 }] },
];

export default function HistorialVentasPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('todas');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    // Modal states
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAnularConfirm, setShowAnularConfirm] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Load sales from localStorage store + demo data
    useEffect(() => {
        const storedSales = getSales();
        // Transform stored sales to match Sale interface
        const transformedSales: Sale[] = storedSales.map((s: StoreSale) => ({
            id: s.id,
            folio: s.folio,
            fecha: `${s.fecha} ${s.hora}`,
            cliente: s.cliente,
            total: s.total,
            estado: 'completada' as const,
            tipoComprobante: 'ticket' as const,
            metodoPago: s.metodoPago === 'EFECTIVO' ? 'Efectivo' : s.metodoPago === 'TARJETA' ? 'Tarjeta' : 'Transferencia',
            items: s.items?.map(i => ({ producto: i.name, cantidad: i.quantity, precio: i.price }))
        }));
        // Combine new sales first, then demo sales
        setSales([...transformedSales, ...initialSales]);
    }, []);

    const filteredSales = sales.filter(sale => {
        const matchesSearch = sale.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.cliente.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEstado = estadoFilter === 'todas' || sale.estado === estadoFilter;
        return matchesSearch && matchesEstado;
    });

    const totalVentas = sales.filter(s => s.estado === 'completada').reduce((sum, s) => sum + s.total, 0);
    const ventasHoy = sales.filter(s => s.estado === 'completada').length;
    const ventasAnuladas = sales.filter(s => s.estado === 'anulada').length;

    const handleViewTicket = (sale: Sale) => {
        setSelectedSale(sale);
        setShowDetailModal(true);
    };

    const handleReprint = (sale: Sale) => {
        // Get company config
        const config = getConfig();

        // Open print dialog
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const hasLogo = config.logoUrl && config.mostrarLogo;

            printWindow.document.write(`
                <html><head><title>Ticket ${sale.folio}</title>
                <style>
                    body { font-family: monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .logo { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 10px; object-fit: cover; display: block; }
                    .line { border-top: 1px dashed #000; margin: 10px 0; }
                    .item { display: flex; justify-content: space-between; }
                    .total { font-weight: bold; font-size: 1.2em; margin-top: 10px; }
                    .info { font-size: 0.85em; color: #666; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                </style></head><body>
                <div class="header">
                    ${hasLogo ? `<img id="ticket-logo" src="${config.logoUrl}" class="logo" alt="Logo" onload="window.logoLoaded=true" onerror="window.logoLoaded=true" />` : ''}
                    <h2>${config.nombreEmpresa}</h2>
                    <p class="info">RFC: ${config.rfc}</p>
                    <p class="info">${config.direccion}</p>
                    <p class="info">Tel: ${config.telefono}</p>
                </div>
                <div class="line"></div>
                <p><strong>Folio:</strong> ${sale.folio}</p>
                <p><strong>Fecha:</strong> ${sale.fecha}</p>
                <p><strong>Cliente:</strong> ${sale.cliente}</p>
                <div class="line"></div>
                ${sale.items?.map(i => `<div class="item"><span>${i.cantidad}x ${i.producto}</span><span>$${(i.cantidad * i.precio).toFixed(2)}</span></div>`).join('') || ''}
                <div class="line"></div>
                <div class="item total"><span>TOTAL:</span><span>$${sale.total.toFixed(2)}</span></div>
                <div class="line"></div>
                <p style="text-align:center">Método de pago: ${sale.metodoPago}</p>
                <p style="text-align:center">${config.mensajeTicket}</p>
                <script>
                    ${hasLogo ? `
                        // Wait for logo to load before printing
                        function waitAndPrint() {
                            if (window.logoLoaded) {
                                setTimeout(function() { window.print(); }, 100);
                            } else {
                                setTimeout(waitAndPrint, 50);
                            }
                        }
                        waitAndPrint();
                    ` : `
                        setTimeout(function() { window.print(); }, 100);
                    `}
                </script>
                </body></html>
            `);
            printWindow.document.close();
        }
        setSuccessMessage(`Reimprimiendo ticket ${sale.folio}`);
        setTimeout(() => setSuccessMessage(''), 3000);
    };


    const handleAnularClick = (sale: Sale) => {
        setSelectedSale(sale);
        setShowAnularConfirm(true);
    };

    const confirmAnular = () => {
        if (selectedSale) {
            setSales(sales.map(s => s.id === selectedSale.id ? { ...s, estado: 'anulada' as const } : s));
            setShowAnularConfirm(false);
            setSuccessMessage(`Venta ${selectedSale.folio} anulada correctamente`);
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

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

    const modalOverlay: React.CSSProperties = {
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    };

    const modalContent: React.CSSProperties = {
        background: 'white', borderRadius: '12px', padding: '1.5rem',
        maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto'
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Success Toast */}
            {successMessage && (
                <div style={{
                    position: 'fixed', top: '1rem', right: '1rem', zIndex: 2000,
                    background: '#10B981', color: 'white', padding: '1rem 1.5rem',
                    borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {successMessage}
                </div>
            )}

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
                <button
                    onClick={() => exportToExcel(
                        filteredSales.map(s => ({
                            Folio: s.folio,
                            Fecha: s.fecha,
                            Cliente: s.cliente,
                            Total: `$${s.total.toFixed(2)}`,
                            Estado: s.estado,
                            Comprobante: s.tipoComprobante,
                            'Método Pago': s.metodoPago
                        })),
                        'Historial_Ventas_Sellast',
                        'Ventas'
                    )}
                    style={{
                        padding: '0.75rem 1rem',
                        background: 'white',
                        color: '#374151',
                        border: '1px solid #D1D5DB',
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
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                        <button
                                            onClick={() => handleViewTicket(sale)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#CFFAFE',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title="Ver ticket"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleReprint(sale)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#DBEAFE',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title="Reimprimir"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                                                <polyline points="6 9 6 2 18 2 18 9" />
                                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                                <rect x="6" y="14" width="12" height="8" />
                                            </svg>
                                        </button>
                                        {sale.estado !== 'anulada' && (
                                            <button
                                                onClick={() => handleAnularClick(sale)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: '#FEE2E2',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title="Anular"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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

            {/* Detail Modal */}
            {showDetailModal && selectedSale && (
                <div style={modalOverlay} onClick={() => setShowDetailModal(false)}>
                    <div style={modalContent} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Detalle de Venta</h2>
                            <button onClick={() => setShowDetailModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div><strong>Folio:</strong> {selectedSale.folio}</div>
                                <div><strong>Fecha:</strong> {selectedSale.fecha}</div>
                                <div><strong>Cliente:</strong> {selectedSale.cliente}</div>
                                <div><strong>Método:</strong> {selectedSale.metodoPago}</div>
                                <div><strong>Estado:</strong> <span style={getEstadoBadge(selectedSale.estado)}>{selectedSale.estado}</span></div>
                                <div><strong>Tipo:</strong> <span style={getComprobanteBadge(selectedSale.tipoComprobante)}>{selectedSale.tipoComprobante}</span></div>
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Productos</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                            <thead>
                                <tr style={{ background: '#f3f4f6' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.8rem' }}>Producto</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem' }}>Cant.</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.8rem' }}>Precio</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.8rem' }}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedSale.items?.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '0.5rem' }}>{item.producto}</td>
                                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.cantidad}</td>
                                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>${item.precio.toFixed(2)}</td>
                                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>${(item.cantidad * item.precio).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ textAlign: 'right', fontSize: '1.25rem', fontWeight: 700 }}>
                            Total: ${selectedSale.total.toFixed(2)}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                style={{ flex: 1, padding: '0.75rem', background: '#E5E7EB', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={() => { handleReprint(selectedSale); setShowDetailModal(false); }}
                                style={{ flex: 1, padding: '0.75rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Reimprimir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Anular Confirmation Modal */}
            {showAnularConfirm && selectedSale && (
                <div style={modalOverlay} onClick={() => setShowAnularConfirm(false)}>
                    <div style={modalContent} onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>¿Anular esta venta?</h2>
                            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                                Vas a anular la venta <strong>{selectedSale.folio}</strong> por <strong>${selectedSale.total.toFixed(2)}</strong>.
                            </p>
                            <p style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowAnularConfirm(false)}
                                style={{ flex: 1, padding: '0.75rem', background: '#E5E7EB', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmAnular}
                                style={{ flex: 1, padding: '0.75rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Anular Venta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
