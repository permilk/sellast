'use client';

import { useState } from 'react';
import { exportToExcel } from '@/utils/exportExcel';
import { KPISummary } from '@/components/admin/KPISummary';

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
                    <button onClick={() => {
                        // Sheet 1: Resumen General
                        const resumenGeneral = [
                            { Concepto: 'Ventas del Día', Valor: `$${ventasHoy.toFixed(2)}` },
                            { Concepto: 'Ventas de la Semana', Valor: `$${ventasSemana.toFixed(2)}` },
                            { Concepto: 'Ventas del Mes', Valor: `$${ventasMes.toFixed(2)}` },
                            { Concepto: 'Total Transacciones', Valor: transacciones },
                            { Concepto: 'Ticket Promedio', Valor: `$${ticketPromedio.toFixed(2)}` }
                        ];

                        // Sheet 2: Top Productos
                        const productosData = topProductos.map(p => ({
                            Producto: p.nombre,
                            'Unidades Vendidas': p.vendidos,
                            'Total Ventas': `$${p.total.toFixed(2)}`
                        }));

                        // Sheet 3: Top Clientes
                        const clientesData = topClientes.map(c => ({
                            Cliente: c.nombre,
                            Compras: c.compras,
                            'Total Gastado': `$${c.total.toFixed(2)}`
                        }));

                        // Sheet 4: Ventas por Día
                        const ventasDiarias = ventasPorDia.map(d => ({
                            Día: d.dia,
                            Monto: `$${d.monto.toFixed(2)}`
                        }));

                        // Export with multiple sheets using XLSX
                        import('xlsx').then((XLSX) => {
                            const wb = XLSX.utils.book_new();

                            const ws1 = XLSX.utils.json_to_sheet(resumenGeneral);
                            XLSX.utils.book_append_sheet(wb, ws1, 'Resumen General');

                            const ws2 = XLSX.utils.json_to_sheet(productosData);
                            XLSX.utils.book_append_sheet(wb, ws2, 'Top Productos');

                            const ws3 = XLSX.utils.json_to_sheet(clientesData);
                            XLSX.utils.book_append_sheet(wb, ws3, 'Top Clientes');

                            const ws4 = XLSX.utils.json_to_sheet(ventasDiarias);
                            XLSX.utils.book_append_sheet(wb, ws4, 'Ventas por Día');

                            XLSX.writeFile(wb, 'Reporte_Completo_Sellast.xlsx');
                        });
                    }} style={{
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
            </div>

            {/* KPI Summary */}
            <KPISummary cards={[
                { label: 'Ventas Hoy', value: ventasHoy.toFixed(2), color: 'green', prefix: '$ ' },
                { label: 'Ventas Semana', value: ventasSemana.toFixed(2), color: 'blue', prefix: '$ ' },
                { label: 'Ventas Mes', value: ventasMes.toFixed(2), color: 'purple', prefix: '$ ' },
                { label: 'Ticket Promedio', value: ticketPromedio.toFixed(2), color: 'cyan', prefix: '$ ' }
            ]} />

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
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                            Productos Más Vendidos
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
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            Mejores Clientes
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

            {/* Advanced Reports Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* ABC Analysis */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>
                            Análisis ABC de Productos
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Pareto 80/20</span>
                    </div>
                    <div style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ background: '#10B981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', minWidth: '40px', textAlign: 'center' }}>A</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Productos Clase A (20%)</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Generan 80% de las ventas</div>
                                </div>
                                <span style={{ fontWeight: 600, color: '#10B981' }}>5 productos</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ background: '#F59E0B', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', minWidth: '40px', textAlign: 'center' }}>B</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Productos Clase B (30%)</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Generan 15% de las ventas</div>
                                </div>
                                <span style={{ fontWeight: 600, color: '#F59E0B' }}>8 productos</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ background: '#EF4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', minWidth: '40px', textAlign: 'center' }}>C</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Productos Clase C (50%)</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Generan 5% de las ventas</div>
                                </div>
                                <span style={{ fontWeight: 600, color: '#EF4444' }}>12 productos</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profit Report */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            Utilidad por Producto
                        </h3>
                    </div>
                    <div style={{ padding: '1rem 1.5rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <th style={{ padding: '0.5rem 0', textAlign: 'left', fontWeight: 500, color: '#6b7280' }}>Producto</th>
                                    <th style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 500, color: '#6b7280' }}>Margen</th>
                                    <th style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 500, color: '#6b7280' }}>Utilidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '0.5rem 0' }}>Whisky JackDaniels</td>
                                    <td style={{ padding: '0.5rem 0', textAlign: 'right', color: '#10B981' }}>35%</td>
                                    <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600 }}>$1,338.75</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '0.5rem 0' }}>Vodka Absolut</td>
                                    <td style={{ padding: '0.5rem 0', textAlign: 'right', color: '#10B981' }}>32%</td>
                                    <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600 }}>$912.00</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '0.5rem 0' }}>CocaCola</td>
                                    <td style={{ padding: '0.5rem 0', textAlign: 'right', color: '#F59E0B' }}>18%</td>
                                    <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600 }}>$388.80</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem 0' }}>Preparado</td>
                                    <td style={{ padding: '0.5rem 0', textAlign: 'right', color: '#10B981' }}>40%</td>
                                    <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600 }}>$770.40</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Corte Z - Daily Fiscal Summary */}
            <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '12px',
                padding: '1.5rem',
                color: 'white'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            Corte Z - Resumen Fiscal del Día
                        </h3>
                        <p style={{ margin: '0.25rem 0 0', opacity: 0.8, fontSize: '0.9rem' }}>23 de Enero de 2026</p>
                    </div>
                    <button style={{ padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                        Imprimir Corte
                    </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>VENTAS EN EFECTIVO</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace' }}>$1,850.00</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>VENTAS CON TARJETA</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace' }}>$480.00</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>TRANSFERENCIAS</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace' }}>$120.00</div>
                    </div>
                    <div style={{ background: 'rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>TOTAL DEL DÍA</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace' }}>$2,450.00</div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                        <span style={{ opacity: 0.8 }}>Transacciones:</span>
                        <span style={{ fontWeight: 600 }}>47</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                        <span style={{ opacity: 0.8 }}>Ticket Promedio:</span>
                        <span style={{ fontWeight: 600 }}>$52.13</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                        <span style={{ opacity: 0.8 }}>IVA Recaudado:</span>
                        <span style={{ fontWeight: 600 }}>$337.93</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
