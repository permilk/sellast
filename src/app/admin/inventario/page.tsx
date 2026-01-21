'use client';

import { useState } from 'react';

interface InventoryItem {
    id: string;
    producto: string;
    sku: string;
    stockActual: number;
    stockMinimo: number;
    stockMaximo: number;
    ultimoMovimiento: string;
    estado: 'normal' | 'bajo' | 'agotado' | 'exceso';
}

const mockInventory: InventoryItem[] = [
    { id: '1', producto: 'Whisky JackDaniels', sku: 'WJD-001', stockActual: 24, stockMinimo: 10, stockMaximo: 50, ultimoMovimiento: '21/01/2026', estado: 'normal' },
    { id: '2', producto: 'Vodka Absolut', sku: 'VA-001', stockActual: 18, stockMinimo: 10, stockMaximo: 40, ultimoMovimiento: '20/01/2026', estado: 'normal' },
    { id: '3', producto: 'CocaCola', sku: 'CC-001', stockActual: 5, stockMinimo: 20, stockMaximo: 100, ultimoMovimiento: '21/01/2026', estado: 'bajo' },
    { id: '4', producto: 'Agua San 1Lt', sku: 'AS-001', stockActual: 0, stockMinimo: 30, stockMaximo: 150, ultimoMovimiento: '19/01/2026', estado: 'agotado' },
    { id: '5', producto: 'Pisco Suerño', sku: 'PS-001', stockActual: 36, stockMinimo: 15, stockMaximo: 60, ultimoMovimiento: '18/01/2026', estado: 'normal' },
    { id: '6', producto: 'Preparado', sku: 'PR-001', stockActual: 65, stockMinimo: 5, stockMaximo: 50, ultimoMovimiento: '21/01/2026', estado: 'exceso' },
];

interface Movement {
    id: string;
    fecha: string;
    tipo: 'entrada' | 'salida' | 'ajuste';
    producto: string;
    cantidad: number;
    motivo: string;
}

const mockMovements: Movement[] = [
    { id: '1', fecha: '21/01/2026 14:30', tipo: 'salida', producto: 'CocaCola', cantidad: 12, motivo: 'Venta' },
    { id: '2', fecha: '21/01/2026 12:00', tipo: 'entrada', producto: 'Whisky JackDaniels', cantidad: 10, motivo: 'Compra a proveedor' },
    { id: '3', fecha: '21/01/2026 10:15', tipo: 'ajuste', producto: 'Preparado', cantidad: 5, motivo: 'Inventario físico' },
    { id: '4', fecha: '20/01/2026 16:45', tipo: 'salida', producto: 'Vodka Absolut', cantidad: 3, motivo: 'Venta' },
    { id: '5', fecha: '20/01/2026 11:00', tipo: 'entrada', producto: 'Pisco Suerño', cantidad: 20, motivo: 'Compra a proveedor' },
];

export default function InventarioPage() {
    const [inventory] = useState<InventoryItem[]>(mockInventory);
    const [movements] = useState<Movement[]>(mockMovements);
    const [activeTab, setActiveTab] = useState<'stock' | 'movimientos'>('stock');
    const [searchTerm, setSearchTerm] = useState('');

    const getEstadoBadge = (estado: string) => {
        const styles: Record<string, { bg: string; color: string; label: string }> = {
            normal: { bg: '#D1FAE5', color: '#059669', label: 'Normal' },
            bajo: { bg: '#FEF3C7', color: '#D97706', label: 'Stock Bajo' },
            agotado: { bg: '#FEE2E2', color: '#DC2626', label: 'Agotado' },
            exceso: { bg: '#DBEAFE', color: '#2563EB', label: 'Exceso' }
        };
        const style = styles[estado];
        return (
            <span style={{
                background: style.bg,
                color: style.color,
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600
            }}>
                {style.label}
            </span>
        );
    };

    const getMovimientoBadge = (tipo: string) => {
        const styles: Record<string, { bg: string; color: string }> = {
            entrada: { bg: '#10B981', color: 'white' },
            salida: { bg: '#EF4444', color: 'white' },
            ajuste: { bg: '#F59E0B', color: 'white' }
        };
        const style = styles[tipo];
        return (
            <span style={{
                background: style.bg,
                color: style.color,
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize'
            }}>
                {tipo}
            </span>
        );
    };

    const alertas = inventory.filter(i => i.estado === 'bajo' || i.estado === 'agotado').length;
    const productosActivos = inventory.length;

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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                        Control de Inventario
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Gestiona el stock y movimientos de productos
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
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
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Registrar Entrada
                    </button>
                    <button style={{
                        padding: '0.75rem 1rem',
                        background: '#EF4444',
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
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Registrar Salida
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #3B82F6'
                }}>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Productos</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#3B82F6' }}>{productosActivos}</div>
                </div>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #EF4444'
                }}>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Alertas Stock</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#EF4444' }}>{alertas}</div>
                </div>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #10B981'
                }}>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Entradas Hoy</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10B981' }}>12</div>
                </div>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #F59E0B'
                }}>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Salidas Hoy</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F59E0B' }}>8</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                    onClick={() => setActiveTab('stock')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: activeTab === 'stock' ? '#3B82F6' : 'white',
                        color: activeTab === 'stock' ? 'white' : '#6b7280',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Stock Actual
                </button>
                <button
                    onClick={() => setActiveTab('movimientos')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: activeTab === 'movimientos' ? '#3B82F6' : 'white',
                        color: activeTab === 'movimientos' ? 'white' : '#6b7280',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Movimientos
                </button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '1rem', maxWidth: '400px' }}>
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                    }}
                />
            </div>

            {/* Stock Table */}
            {activeTab === 'stock' && (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>PRODUCTO</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>SKU</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>STOCK ACTUAL</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>MÍNIMO</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>MÁXIMO</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>ESTADO</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.filter(i => i.producto.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                                <tr key={item.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{item.producto}</td>
                                    <td style={{ padding: '1rem', color: '#7C3AED', fontWeight: 500 }}>{item.sku}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>{item.stockActual}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{item.stockMinimo}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{item.stockMaximo}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>{getEstadoBadge(item.estado)}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                            <button
                                                onClick={() => alert(`Ver detalles de: ${item.producto}`)}
                                                style={{
                                                    width: '32px', height: '32px', background: '#CFFAFE', border: 'none',
                                                    borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}
                                                title="Ver"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => alert(`Editar: ${item.producto}`)}
                                                style={{
                                                    width: '32px', height: '32px', background: '#FEF3C7', border: 'none',
                                                    borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}
                                                title="Editar"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => alert(`Ajustar stock de: ${item.producto}`)}
                                                style={{
                                                    width: '32px', height: '32px', background: '#DBEAFE', border: 'none',
                                                    borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}
                                                title="Ajustar Stock"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                                                    <path d="M12 2v20M2 12h20" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Movements Table */}
            {activeTab === 'movimientos' && (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>FECHA</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>TIPO</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>PRODUCTO</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>CANTIDAD</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>MOTIVO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.map(mov => (
                                <tr key={mov.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', color: '#6b7280' }}>{mov.fecha}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>{getMovimientoBadge(mov.tipo)}</td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{mov.producto}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>
                                        <span style={{ color: mov.tipo === 'entrada' ? '#10B981' : mov.tipo === 'salida' ? '#EF4444' : '#F59E0B' }}>
                                            {mov.tipo === 'entrada' ? '+' : mov.tipo === 'salida' ? '-' : ''}{mov.cantidad}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#6b7280' }}>{mov.motivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
