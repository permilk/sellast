'use client';

import { useState } from 'react';

export default function ReportesPage() {
    const [periodoFilter, setPeriodoFilter] = useState('hoy');

    // Mock data
    const ventasHoy = 2450.00;
    const ventasSemana = 15680.50;
    const ventasMes = 68420.00;
    const transacciones = 127;
    const ticketPromedio = 54.25;

    const topProductos = [
        { nombre: 'Whisky JackDaniels', vendidos: 45, total: 3825.00 },
        { nombre: 'Vodka Absolut', vendidos: 38, total: 2850.00 },
        { nombre: 'CocaCola', vendidos: 120, total: 2160.00 },
        { nombre: 'Preparado', vendidos: 18, total: 1926.00 },
        { nombre: 'Pisco Suerño', vendidos: 65, total: 650.00 },
    ];

    const topClientes = [
        { nombre: 'Cristiano Ronaldo', compras: 12, total: 1700.00 },
        { nombre: 'Lionel Messi', compras: 8, total: 650.00 },
        { nombre: 'Cristian Cueva', compras: 5, total: 320.00 },
        { nombre: 'Cliente General', compras: 102, total: 4500.00 },
    ];

    const ventasPorDia = [
        { dia: 'Lun', monto: 1250 },
        { dia: 'Mar', monto: 1890 },
        { dia: 'Mié', monto: 2100 },
        { dia: 'Jue', monto: 1780 },
        { dia: 'Vie', monto: 3200 },
        { dia: 'Sáb', monto: 4100 },
        { dia: 'Dom', monto: 1360 },
    ];

    const maxVenta = Math.max(...ventasPorDia.map(d => d.monto));

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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                        Reportes y Analítica
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Visualiza el rendimiento de tu negocio
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <select
                        value={periodoFilter}
                        onChange={e => setPeriodoFilter(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            minWidth: '150px'
                        }}
                    >
                        <option value="hoy">Hoy</option>
                        <option value="semana">Esta Semana</option>
                        <option value="mes">Este Mes</option>
                        <option value="anio">Este Año</option>
                    </select>
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
                        Exportar PDF
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem'
                }}>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>Ventas Hoy</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>$ {ventasHoy.toFixed(2)}</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem'
                }}>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>Ventas Semana</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>$ {ventasSemana.toFixed(2)}</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem'
                }}>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>Ventas Mes</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>$ {ventasMes.toFixed(2)}</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem'
                }}>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>Transacciones</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{transacciones}</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '1.25rem'
                }}>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>Ticket Promedio</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>$ {ticketPromedio.toFixed(2)}</div>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Sales Chart */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1f2937' }}>
                        Ventas por Día (Última Semana)
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '200px' }}>
                        {ventasPorDia.map((dia, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    width: '100%',
                                    height: `${(dia.monto / maxVenta) * 180}px`,
                                    background: `linear-gradient(180deg, #3B82F6 0%, #7C3AED 100%)`,
                                    borderRadius: '8px 8px 0 0',
                                    minHeight: '20px',
                                    position: 'relative'
                                }}>
                                    <span style={{
                                        position: 'absolute',
                                        top: '-25px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: '#374151'
                                    }}>
                                        ${(dia.monto / 1000).toFixed(1)}k
                                    </span>
                                </div>
                                <span style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}>{dia.dia}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pie Chart Placeholder */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>
                        Ventas por Categoría
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}>
                        <div style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            background: `conic-gradient(
                                #3B82F6 0% 35%,
                                #10B981 35% 55%,
                                #F59E0B 55% 75%,
                                #7C3AED 75% 90%,
                                #EF4444 90% 100%
                            )`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column'
                            }}>
                                <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>Total</span>
                                <span style={{ fontSize: '1rem', fontWeight: 700 }}>100%</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                        {[
                            { label: 'Licor', color: '#3B82F6' },
                            { label: 'Gaseosa', color: '#10B981' },
                            { label: 'Tienda', color: '#F59E0B' },
                            { label: 'Aguas', color: '#7C3AED' },
                            { label: 'Otros', color: '#EF4444' },
                        ].map((cat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: cat.color }}></div>
                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{cat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Top Products */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                            🏆 Productos Más Vendidos
                        </h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>#</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>PRODUCTO</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>VENDIDOS</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProductos.map((prod, i) => (
                                <tr key={i} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <span style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7F32' : '#E5E7EB',
                                            color: i < 3 ? 'white' : '#6b7280',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}>
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{prod.nombre}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{prod.vendidos}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, color: '#10B981' }}>
                                        $ {prod.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Top Clients */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                            ⭐ Mejores Clientes
                        </h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>#</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>CLIENTE</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>COMPRAS</th>
                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem' }}>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topClientes.map((cliente, i) => (
                                <tr key={i} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <span style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7F32' : '#E5E7EB',
                                            color: i < 3 ? 'white' : '#6b7280',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}>
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{cliente.nombre}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{cliente.compras}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, color: '#3B82F6' }}>
                                        $ {cliente.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
