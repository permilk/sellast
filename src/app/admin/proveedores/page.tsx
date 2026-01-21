'use client';

// ============================================
// ADMIN - PROVEEDORES
// ============================================

import { useState } from 'react';

interface Proveedor {
    id: string;
    nombre: string;
    rfc: string;
    telefono: string;
    email: string;
    direccion: string;
    contacto: string;
    giro: string;
    estado: 'activo' | 'inactivo';
    saldoPendiente: number;
    ultimaCompra: string;
}

const proveedoresMock: Proveedor[] = [
    { id: 'PRV-001', nombre: 'Coca-Cola FEMSA', rfc: 'CCF850101AB0', telefono: '55-1234-5678', email: 'ventas@cocacola.mx', direccion: 'Av. Reforma 123, CDMX', contacto: 'Juan Pérez', giro: 'Bebidas', estado: 'activo', saldoPendiente: 45000, ultimaCompra: '2026-01-18' },
    { id: 'PRV-002', nombre: 'Grupo Modelo', rfc: 'GMO890315KL2', telefono: '55-8765-4321', email: 'proveedores@modelo.mx', direccion: 'Lago Zurich 245, CDMX', contacto: 'María García', giro: 'Bebidas', estado: 'activo', saldoPendiente: 28500, ultimaCompra: '2026-01-15' },
    { id: 'PRV-003', nombre: 'Distribuidora Gloria', rfc: 'DGL910520MN9', telefono: '33-2468-1357', email: 'contacto@gloria.mx', direccion: 'Chapultepec 456, GDL', contacto: 'Roberto López', giro: 'Lácteos', estado: 'activo', saldoPendiente: 12800, ultimaCompra: '2026-01-10' },
    { id: 'PRV-004', nombre: 'Sabritas PepsiCo', rfc: 'SPE880705PQ3', telefono: '81-9753-2468', email: 'ventas@sabritas.mx', direccion: 'Av. Juárez 789, MTY', contacto: 'Ana Martínez', giro: 'Snacks', estado: 'activo', saldoPendiente: 0, ultimaCompra: '2026-01-08' },
    { id: 'PRV-005', nombre: 'Licores del Bajío', rfc: 'LDB950212QR5', telefono: '477-123-4567', email: 'pedidos@licoresbajio.mx', direccion: 'Blvd. López Mateos 321, León', contacto: 'Carlos Hernández', giro: 'Licores', estado: 'inactivo', saldoPendiente: 0, ultimaCompra: '2025-11-20' },
];

const giroOptions = ['Todos', 'Bebidas', 'Lácteos', 'Snacks', 'Licores', 'Otros'];

export default function ProveedoresPage() {
    const [proveedores] = useState<Proveedor[]>(proveedoresMock);
    const [searchTerm, setSearchTerm] = useState('');
    const [giroFilter, setGiroFilter] = useState('Todos');
    const [estadoFilter, setEstadoFilter] = useState('todos');

    const filteredProveedores = proveedores.filter(prov => {
        const matchSearch = prov.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prov.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prov.contacto.toLowerCase().includes(searchTerm.toLowerCase());
        const matchGiro = giroFilter === 'Todos' || prov.giro === giroFilter;
        const matchEstado = estadoFilter === 'todos' || prov.estado === estadoFilter;
        return matchSearch && matchGiro && matchEstado;
    });

    const totalSaldoPendiente = proveedores.reduce((sum, p) => sum + p.saldoPendiente, 0);
    const proveedoresActivos = proveedores.filter(p => p.estado === 'activo').length;

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                            <path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" />
                        </svg>
                        Proveedores
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Administra tu directorio de proveedores</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={() => alert('Exportando proveedores...')}
                        style={{ padding: '0.75rem 1rem', background: '#06B6D4', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Exportar
                    </button>
                    <button
                        onClick={() => alert('Abrir modal nuevo proveedor')}
                        style={{ padding: '0.75rem 1rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Nuevo Proveedor
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #7C3AED' }}>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Proveedores</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937' }}>{proveedores.length}</p>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #10B981' }}>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Activos</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10B981' }}>{proveedoresActivos}</p>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #EF4444' }}>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Saldo Pendiente</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#EF4444' }}>$ {totalSaldoPendiente.toLocaleString()}</p>
                </div>
            </div>

            {/* Filters */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Buscar</label>
                    <input
                        type="text"
                        placeholder="Nombre, RFC o contacto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                </div>
                <div style={{ minWidth: '150px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Giro</label>
                    <select value={giroFilter} onChange={(e) => setGiroFilter(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem' }}>
                        {giroOptions.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div style={{ minWidth: '150px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Estado</label>
                    <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem' }}>
                        <option value="todos">Todos</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Proveedor</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>RFC</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Contacto</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Giro</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Saldo</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Estado</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProveedores.map(prov => (
                                <tr key={prov.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600, color: '#1f2937' }}>{prov.nombre}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{prov.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#374151' }}>{prov.rfc}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ color: '#374151' }}>{prov.contacto}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{prov.telefono}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '0.25rem 0.75rem', background: '#EDE9FE', color: '#7C3AED', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>{prov.giro}</span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: prov.saldoPendiente > 0 ? '#EF4444' : '#6b7280' }}>
                                        $ {prov.saldoPendiente.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{ padding: '0.25rem 0.75rem', background: prov.estado === 'activo' ? '#D1FAE5' : '#F3F4F6', color: prov.estado === 'activo' ? '#10B981' : '#6B7280', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>{prov.estado}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                            <button onClick={() => alert(`Ver proveedor: ${prov.nombre}`)} style={{ width: '32px', height: '32px', background: '#CFFAFE', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Ver">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            </button>
                                            <button onClick={() => alert(`Editar proveedor: ${prov.nombre}`)} style={{ width: '32px', height: '32px', background: '#FEF3C7', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Editar">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                            <button onClick={() => alert(`Eliminar proveedor: ${prov.nombre}`)} style={{ width: '32px', height: '32px', background: '#FEE2E2', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Eliminar">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredProveedores.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                        No se encontraron proveedores
                    </div>
                )}
            </div>
        </div>
    );
}
