'use client';

// ============================================
// ADMIN - PROVEEDORES
// ============================================

import { useState, useEffect } from 'react';
import { exportToExcel } from '@/utils/exportExcel';
import { KPISummary } from '@/components/admin/KPISummary';
import { getSuppliers, addSupplier, Supplier } from '@/stores/suppliersStore';
import AccountsPayableModal from './components/AccountsPayableModal';

const giroOptions = ['Todos', 'Bebidas', 'Lácteos', 'Snacks', 'Licores', 'Alimentos', 'Licor', 'Otros'];

export default function ProveedoresPage() {
    const [proveedores, setProveedores] = useState<Supplier[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [giroFilter, setGiroFilter] = useState('Todos');
    const [estadoFilter, setEstadoFilter] = useState('todos');
    const [showModal, setShowModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [showCuentasModal, setShowCuentasModal] = useState(false);
    const [selectedProveedor, setSelectedProveedor] = useState<Supplier | null>(null);
    const [nuevoProveedor, setNuevoProveedor] = useState({
        nombre: '', rfc: '', telefono: '', contacto: '', giro: 'Bebidas'
    });

    // Load from store
    useEffect(() => {
        setProveedores(getSuppliers());
    }, []);

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

    const handleAddProveedor = () => {
        if (!nuevoProveedor.nombre.trim()) {
            alert('El nombre es requerido');
            return;
        }
        addSupplier({
            nombre: nuevoProveedor.nombre,
            rfc: nuevoProveedor.rfc,
            contacto: nuevoProveedor.contacto,
            telefono: nuevoProveedor.telefono,
            giro: nuevoProveedor.giro,
            estado: 'activo',
            saldoPendiente: 0
        });
        setProveedores(getSuppliers());
        setShowModal(false);
        setNuevoProveedor({ nombre: '', rfc: '', telefono: '', contacto: '', giro: 'Bebidas' });
    };

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
                        onClick={() => setShowCuentasModal(true)}
                        style={{
                            padding: '0.75rem 1rem',
                            background: '#F59E0B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Cuentas por Pagar
                    </button>
                    <button
                        onClick={() => exportToExcel(
                            filteredProveedores.map((p: Supplier) => ({
                                ID: p.id,
                                Nombre: p.nombre,
                                RFC: p.rfc,
                                Teléfono: p.telefono,
                                Contacto: p.contacto,
                                Giro: p.giro,
                                'Saldo Pendiente': `$${p.saldoPendiente.toLocaleString()}`,
                                Estado: p.estado
                            })),
                            'Proveedores_Sellast',
                            'Proveedores'
                        )}
                        style={{ padding: '0.75rem 1rem', background: 'white', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Exportar
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{ padding: '0.75rem 1rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Nuevo Proveedor
                    </button>
                </div>
            </div>

            {/* KPI Summary */}
            <KPISummary cards={[
                { label: 'Total Proveedores', value: proveedores.length, color: 'purple' },
                { label: 'Activos', value: proveedoresActivos, color: 'green' },
                { label: 'Inactivos', value: proveedores.length - proveedoresActivos, color: 'gray' },
                { label: 'Saldo Pendiente', value: totalSaldoPendiente.toLocaleString(), color: 'red', prefix: '$ ' }
            ]} />

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
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{prov.rfc}</div>
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
                                            <button onClick={() => { setSelectedProveedor(prov); setShowDetalleModal(true); }} style={{ width: '32px', height: '32px', background: '#CFFAFE', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Ver">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            </button>
                                            <button onClick={() => { setSelectedProveedor(prov); setShowModal(true); }} style={{ width: '32px', height: '32px', background: '#FEF3C7', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Editar">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                            <button onClick={() => { if (confirm(`¿Está seguro que desea eliminar a ${prov.nombre}?`)) { /* TODO: Implement delete */ } }} style={{ width: '32px', height: '32px', background: '#FEE2E2', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Eliminar">
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

            {/* Modal Nuevo Proveedor */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Nuevo Proveedor</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Nombre Empresa *</label>
                                <input type="text" value={nuevoProveedor.nombre} onChange={e => setNuevoProveedor({ ...nuevoProveedor, nombre: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} placeholder="Ej: Distribuidora ABC" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>RFC *</label>
                                    <input type="text" value={nuevoProveedor.rfc} onChange={e => setNuevoProveedor({ ...nuevoProveedor, rfc: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} placeholder="XXX000000XX0" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Teléfono</label>
                                    <input type="tel" value={nuevoProveedor.telefono} onChange={e => setNuevoProveedor({ ...nuevoProveedor, telefono: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} placeholder="55-1234-5678" />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Nombre Contacto</label>
                                <input type="text" value={nuevoProveedor.contacto} onChange={e => setNuevoProveedor({ ...nuevoProveedor, contacto: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} placeholder="Juan Pérez" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Giro</label>
                                <select value={nuevoProveedor.giro} onChange={e => setNuevoProveedor({ ...nuevoProveedor, giro: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <option value="Bebidas">Bebidas</option>
                                    <option value="Lácteos">Lácteos</option>
                                    <option value="Snacks">Snacks</option>
                                    <option value="Licores">Licores</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={() => {
                                handleAddProveedor();
                            }} style={{ padding: '0.75rem 1.5rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Guardar Proveedor</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detalle de Proveedor */}
            {showDetalleModal && selectedProveedor && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        width: '90%',
                        maxWidth: '500px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Detalle del Proveedor</h3>
                            <button
                                onClick={() => { setShowDetalleModal(false); setSelectedProveedor(null); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
                            >×</button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Nombre</label>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '1.125rem' }}>{selectedProveedor.nombre}</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>RFC</label>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{selectedProveedor.rfc || 'N/A'}</p>
                                </div>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Giro</label>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{selectedProveedor.giro}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Contacto</label>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{selectedProveedor.contacto || 'N/A'}</p>
                                </div>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Teléfono</label>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{selectedProveedor.telefono || 'N/A'}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Estado</label>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: selectedProveedor.estado === 'activo' ? '#D1FAE5' : '#F3F4F6',
                                        color: selectedProveedor.estado === 'activo' ? '#10B981' : '#6B7280',
                                        textTransform: 'capitalize' as const
                                    }}>{selectedProveedor.estado}</span>
                                </div>
                                <div>
                                    <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Saldo Pendiente</label>
                                    <p style={{
                                        margin: 0,
                                        fontWeight: 600,
                                        fontSize: '1.125rem',
                                        color: selectedProveedor.saldoPendiente > 0 ? '#EF4444' : '#10B981'
                                    }}>$ {selectedProveedor.saldoPendiente.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => { setShowDetalleModal(false); setSelectedProveedor(null); }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#F1F5F9',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Cuentas por Pagar */}
            <AccountsPayableModal
                isOpen={showCuentasModal}
                onClose={() => setShowCuentasModal(false)}
                proveedores={proveedores.map(p => ({ id: p.id, nombre: p.nombre }))}
            />
        </div>
    );
}
