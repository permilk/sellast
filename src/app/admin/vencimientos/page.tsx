'use client';

// ============================================
// ADMIN - VENCIMIENTOS (Dashboard de Alertas)
// ============================================

import { useState } from 'react';
import { exportToExcel } from '@/utils/exportExcel';
import { KPISummary } from '@/components/admin/KPISummary';

interface ProductoVencimiento {
    id: string;
    sku: string;
    nombre: string;
    lote: string;
    categoria: string;
    fechaVencimiento: string;
    diasRestantes: number;
    stock: number;
    estado: 'vencido' | 'critico' | 'proximo' | 'normal';
}

// Productos mock con fechas de vencimiento
const vencimientosMock: ProductoVencimiento[] = [
    { id: '1', sku: 'TL-001', nombre: 'Tarro de leche gloria', lote: 'L2026-001', categoria: 'Lácteos', fechaVencimiento: '2026-01-15', diasRestantes: -6, stock: 15, estado: 'vencido' },
    { id: '2', sku: 'YG-001', nombre: 'Yogurt Natural 1L', lote: 'L2026-012', categoria: 'Lácteos', fechaVencimiento: '2026-01-23', diasRestantes: 2, stock: 24, estado: 'critico' },
    { id: '3', sku: 'PM-001', nombre: 'Pomarola Salsa 400g', lote: 'L2026-008', categoria: 'Salsas', fechaVencimiento: '2026-01-25', diasRestantes: 4, stock: 30, estado: 'critico' },
    { id: '4', sku: 'QS-001', nombre: 'Queso Fresco 500g', lote: 'L2026-015', categoria: 'Lácteos', fechaVencimiento: '2026-01-28', diasRestantes: 7, stock: 12, estado: 'proximo' },
    { id: '5', sku: 'JG-001', nombre: 'Jugo de Naranja 1L', lote: 'L2026-020', categoria: 'Bebidas', fechaVencimiento: '2026-02-01', diasRestantes: 11, stock: 40, estado: 'proximo' },
    { id: '6', sku: 'PAN-001', nombre: 'Pan Bimbo Blanco', lote: 'L2026-021', categoria: 'Panadería', fechaVencimiento: '2026-02-05', diasRestantes: 15, stock: 20, estado: 'proximo' },
    { id: '7', sku: 'CR-001', nombre: 'Crema 500ml', lote: 'L2026-025', categoria: 'Lácteos', fechaVencimiento: '2026-02-15', diasRestantes: 25, stock: 18, estado: 'normal' },
    { id: '8', sku: 'MA-001', nombre: 'Mayonesa 1kg', lote: 'L2026-002', categoria: 'Salsas', fechaVencimiento: '2026-03-10', diasRestantes: 48, stock: 25, estado: 'normal' },
];

const categorias = ['Todas', 'Lácteos', 'Salsas', 'Bebidas', 'Panadería'];

const estadoConfig: Record<string, { label: string; bg: string; color: string; borderColor: string }> = {
    vencido: { label: 'VENCIDO', bg: 'var(--color-danger-light)', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' },
    critico: { label: '< 7 días', bg: '#FEF3C7', color: '#D97706', borderColor: '#F59E0B' },
    proximo: { label: '< 30 días', bg: 'var(--color-info-light)', color: 'var(--color-info)', borderColor: 'var(--color-info)' },
    normal: { label: '> 30 días', bg: 'var(--color-success-light)', color: 'var(--color-success)', borderColor: 'var(--color-success)' },
};

export default function VencimientosPage() {
    const [productos] = useState<ProductoVencimiento[]>(vencimientosMock);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('Todas');
    const [estadoFilter, setEstadoFilter] = useState('todos');
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ProductoVencimiento | null>(null);

    const filteredProductos = productos.filter(p => {
        const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.lote.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategoria = categoriaFilter === 'Todas' || p.categoria === categoriaFilter;
        const matchEstado = estadoFilter === 'todos' || p.estado === estadoFilter;
        return matchSearch && matchCategoria && matchEstado;
    });

    const vencidos = productos.filter(p => p.estado === 'vencido');
    const criticos = productos.filter(p => p.estado === 'critico');
    const proximos = productos.filter(p => p.estado === 'proximo');
    const valorEnRiesgo = [...vencidos, ...criticos].reduce((sum, p) => sum + (p.stock * 50), 0); // Precio estimado

    const handleDescartar = (id: string) => {
        const producto = productos.find(p => p.id === id);
        if (confirm(`¿Marcar "${producto?.nombre}" como descartado/dado de baja?`)) {
            // En producción esto actualizaría la base de datos
            setSelectedItem(null);
            setShowDetalleModal(false);
        }
    };

    const handlePromocion = (id: string) => {
        const producto = productos.find(p => p.id === id);
        setSelectedItem(producto || null);
        setShowDetalleModal(true);
    };

    const handleVerDetalle = (item: ProductoVencimiento) => {
        setSelectedItem(item);
        setShowDetalleModal(true);
    };

    return (
        <div style={{ padding: '1.5rem', fontFamily: 'var(--font-primary)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gray-900)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                            <path d="M10 14l2 2 4-4" />
                        </svg>
                        Control de Vencimientos
                    </h1>
                    <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>Monitorea productos próximos a vencer y gestiona mermas</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => exportToExcel(
                        filteredProductos.map(p => ({
                            SKU: p.sku,
                            Nombre: p.nombre,
                            Lote: p.lote,
                            Categoría: p.categoria,
                            Stock: p.stock,
                            Vencimiento: p.fechaVencimiento,
                            'Días Restantes': p.diasRestantes,
                            Estado: estadoConfig[p.estado].label
                        })),
                        'Vencimientos_Sellast',
                        'Vencimientos'
                    )} className="btn btn-secondary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Exportar
                    </button>
                </div>
            </div>

            {/* Alertas Críticas */}
            {(vencidos.length > 0 || criticos.length > 0) && (
                <div style={{
                    background: 'linear-gradient(135deg, #FEE2E2 0%, #FEF3C7 100%)',
                    border: '1px solid #FECACA',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: 'var(--color-danger)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-danger)', fontSize: '1rem', marginBottom: '0.25rem' }}>
                            ¡Atención! Hay productos que requieren acción inmediata
                        </div>
                        <div style={{ color: 'var(--color-gray-600)', fontSize: '0.9rem' }}>
                            {vencidos.length} producto(s) vencidos y {criticos.length} próximos a vencer en menos de 7 días.
                            Valor en riesgo estimado: <strong>$ {valorEnRiesgo.toLocaleString()}</strong>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Summary */}
            <KPISummary cards={[
                { label: 'Vencidos', value: vencidos.length, color: 'red' },
                { label: 'Críticos (<7 días)', value: criticos.length, color: 'amber' },
                { label: 'Próximos (<30 días)', value: proximos.length, color: 'cyan' },
                { label: 'Total Monitoreados', value: productos.length, color: 'gray' }
            ]} />

            {/* Filters */}
            <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label className="label">Buscar</label>
                    <input
                        type="text"
                        placeholder="Nombre, SKU o Lote..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input"
                    />
                </div>
                <div style={{ minWidth: '150px' }}>
                    <label className="label">Categoría</label>
                    <select value={categoriaFilter} onChange={(e) => setCategoriaFilter(e.target.value)} className="select">
                        {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div style={{ minWidth: '150px' }}>
                    <label className="label">Estado</label>
                    <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="select">
                        <option value="todos">Todos</option>
                        <option value="vencido">Vencidos</option>
                        <option value="critico">Críticos (&lt;7 días)</option>
                        <option value="proximo">Próximos (&lt;30 días)</option>
                        <option value="normal">Normales</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Lote</th>
                                <th>Categoría</th>
                                <th style={{ textAlign: 'center' }}>Stock</th>
                                <th>Vencimiento</th>
                                <th style={{ textAlign: 'center' }}>Días Rest.</th>
                                <th style={{ textAlign: 'center' }}>Estado</th>
                                <th style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProductos.map(item => {
                                const config = estadoConfig[item.estado];
                                return (
                                    <tr key={item.id} style={{ background: item.estado === 'vencido' ? '#FEF2F2' : 'transparent' }}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>{item.nombre}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', fontFamily: 'var(--font-mono)' }}>{item.sku}</div>
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{item.lote}</td>
                                        <td>
                                            <span className="badge badge-primary">{item.categoria}</span>
                                        </td>
                                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.stock}</td>
                                        <td style={{ fontWeight: item.estado === 'vencido' || item.estado === 'critico' ? 600 : 400 }}>
                                            {item.fechaVencimiento}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontWeight: 700,
                                                color: item.diasRestantes <= 0 ? 'var(--color-danger)' :
                                                    item.diasRestantes <= 7 ? 'var(--color-warning)' :
                                                        item.diasRestantes <= 30 ? 'var(--color-info)' : 'var(--color-gray-600)'
                                            }}>
                                                {item.diasRestantes <= 0 ? item.diasRestantes : `+${item.diasRestantes}`}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                background: config.bg,
                                                color: config.color,
                                                borderRadius: '9999px',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {config.label}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                                {item.estado !== 'normal' && (
                                                    <button
                                                        onClick={() => handlePromocion(item.id)}
                                                        className="btn-action btn-action-edit"
                                                        title="Crear Promoción"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                        </svg>
                                                    </button>
                                                )}
                                                {item.estado === 'vencido' && (
                                                    <button
                                                        onClick={() => handleDescartar(item.id)}
                                                        className="btn-action btn-action-delete"
                                                        title="Marcar como Descartado"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                    </button>
                                                )}
                                                <button onClick={() => handleVerDetalle(item)} className="btn-action btn-action-view" title="Ver Detalles">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredProductos.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>
                        No se encontraron productos con los filtros aplicados
                    </div>
                )}
            </div>

            {/* Modal Detalle de Producto */}
            {showDetalleModal && selectedItem && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={estadoConfig[selectedItem.estado].color} strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                            </svg>
                            {selectedItem.nombre}
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>SKU</p>
                                <p style={{ fontWeight: 500, margin: 0, fontFamily: 'monospace' }}>{selectedItem.sku}</p>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>LOTE</p>
                                <p style={{ fontWeight: 500, margin: 0, fontFamily: 'monospace' }}>{selectedItem.lote}</p>
                            </div>
                            <div style={{ background: estadoConfig[selectedItem.estado].bg, padding: '1rem', borderRadius: '8px', border: `2px solid ${estadoConfig[selectedItem.estado].borderColor}` }}>
                                <p style={{ fontSize: '0.75rem', color: estadoConfig[selectedItem.estado].color, marginBottom: '0.25rem' }}>VENCIMIENTO</p>
                                <p style={{ fontWeight: 700, margin: 0, color: estadoConfig[selectedItem.estado].color }}>{selectedItem.fechaVencimiento}</p>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>DÍAS RESTANTES</p>
                                <p style={{ fontWeight: 700, fontSize: '1.25rem', margin: 0, color: selectedItem.diasRestantes <= 0 ? 'var(--color-danger)' : selectedItem.diasRestantes <= 7 ? '#D97706' : '#111827' }}>
                                    {selectedItem.diasRestantes <= 0 ? selectedItem.diasRestantes : `+${selectedItem.diasRestantes}`}
                                </p>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>STOCK</p>
                                <p style={{ fontWeight: 700, fontSize: '1.25rem', margin: 0 }}>{selectedItem.stock}</p>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>CATEGORÍA</p>
                                <p style={{ fontWeight: 500, margin: 0 }}>{selectedItem.categoria}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button onClick={() => { setShowDetalleModal(false); setSelectedItem(null); }}
                                style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cerrar</button>
                            {selectedItem.estado === 'vencido' && (
                                <button onClick={() => handleDescartar(selectedItem.id)}
                                    style={{ padding: '0.75rem 1.5rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Marcar como Descartado</button>
                            )}
                            {(selectedItem.estado === 'critico' || selectedItem.estado === 'proximo') && (
                                <button onClick={() => { setShowDetalleModal(false); }}
                                    style={{ padding: '0.75rem 1.5rem', background: '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Crear Promoción</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
