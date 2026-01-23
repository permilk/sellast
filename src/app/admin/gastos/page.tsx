'use client';

import { useState, useEffect } from 'react';
import { KPISummary } from '@/components/admin/KPISummary';
import { getExpenses, addExpense, deleteExpense, Expense } from '@/stores/expensesStore';

const categorias = ['Todas', 'Proveedores', 'Servicios', 'Operativos', 'Renta', 'Otros'];

export default function GastosPage() {
    const [gastos, setGastos] = useState<Expense[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGasto, setSelectedGasto] = useState<Expense | null>(null);
    const [categoriaFilter, setCategoriaFilter] = useState('Todas');
    const [searchTerm, setSearchTerm] = useState('');
    const [nuevoGasto, setNuevoGasto] = useState({
        concepto: '',
        monto: '',
        categoria: 'Operativos',
        metodoPago: 'Efectivo'
    });

    // Load from store
    useEffect(() => {
        setGastos(getExpenses());
    }, []);

    const filteredGastos = gastos.filter(g => {
        const matchSearch = g.concepto.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategoria = categoriaFilter === 'Todas' || g.categoria === categoriaFilter;
        return matchSearch && matchCategoria;
    });

    const totalGastos = filteredGastos.reduce((sum, g) => sum + g.monto, 0);

    const handleSubmit = () => {
        if (!nuevoGasto.concepto || !nuevoGasto.monto) {
            alert('Por favor completa todos los campos');
            return;
        }

        addExpense({
            concepto: nuevoGasto.concepto,
            monto: parseFloat(nuevoGasto.monto),
            categoria: nuevoGasto.categoria,
            fecha: new Date().toLocaleString('es-MX'),
            metodoPago: nuevoGasto.metodoPago
        });

        setGastos(getExpenses());
        setShowModal(false);
        setNuevoGasto({ concepto: '', monto: '', categoria: 'Operativos', metodoPago: 'Efectivo' });
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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        Gastos
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Registra y controla los egresos de caja
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
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
                    Nuevo Gasto
                </button>
            </div>

            {/* KPI Summary */}
            <KPISummary cards={[
                { label: 'Total Gastos', value: totalGastos.toLocaleString(), color: 'red', prefix: '$ ' },
                { label: 'Gastos Hoy', value: gastos.filter(g => g.fecha.includes('22/01')).length, color: 'blue' },
                { label: 'Proveedores', value: gastos.filter(g => g.categoria === 'Proveedores').reduce((s, g) => s + g.monto, 0).toLocaleString(), color: 'purple', prefix: '$ ' },
                { label: 'Operativos', value: gastos.filter(g => g.categoria === 'Operativos').reduce((s, g) => s + g.monto, 0).toLocaleString(), color: 'amber', prefix: '$ ' }
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
                alignItems: 'flex-end'
            }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Buscar</label>
                    <input
                        type="text"
                        placeholder="Concepto o descripción..."
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
                <div style={{ minWidth: '180px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Categoría</label>
                    <select
                        value={categoriaFilter}
                        onChange={e => setCategoriaFilter(e.target.value)}
                        style={{
                            padding: '0.6rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            minWidth: '160px',
                            background: 'white'
                        }}
                    >
                        {categorias.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
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
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Concepto</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Categoría</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Método Pago</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Monto</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Fecha</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGastos.map(gasto => (
                            <tr key={gasto.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem', fontWeight: 500, color: '#374151' }}>{gasto.concepto}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: '#FEE2E2',
                                        color: '#DC2626'
                                    }}>{gasto.categoria}</span>
                                </td>
                                <td style={{ padding: '1rem', color: '#6b7280' }}>{gasto.metodoPago}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#EF4444' }}>- $ {gasto.monto.toLocaleString()}</td>
                                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>{gasto.fecha}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                        <button
                                            onClick={() => { setSelectedGasto(gasto); setShowDetalleModal(true); }}
                                            style={{
                                                width: '32px', height: '32px', background: '#CFFAFE', border: 'none',
                                                borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}
                                            title="Ver"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => { setSelectedGasto(gasto); setShowDeleteModal(true); }}
                                            style={{
                                                width: '32px', height: '32px', background: '#FEE2E2', border: 'none',
                                                borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}
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

                {filteredGastos.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                        No se encontraron gastos
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
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
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '450px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                                    <line x1="12" y1="1" x2="12" y2="23" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                                Registrar Gasto
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '1.5rem' }}>×</button>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Concepto</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Pago a proveedor"
                                    value={nuevoGasto.concepto}
                                    onChange={e => setNuevoGasto({ ...nuevoGasto, concepto: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Monto ($)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={nuevoGasto.monto}
                                    onChange={e => setNuevoGasto({ ...nuevoGasto, monto: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Categoría</label>
                                    <select
                                        value={nuevoGasto.categoria}
                                        onChange={e => setNuevoGasto({ ...nuevoGasto, categoria: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <option value="Proveedores">Proveedores</option>
                                        <option value="Servicios">Servicios</option>
                                        <option value="Operativos">Operativos</option>
                                        <option value="Renta">Renta</option>
                                        <option value="Otros">Otros</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Método Pago</label>
                                    <select
                                        value={nuevoGasto.metodoPago}
                                        onChange={e => setNuevoGasto({ ...nuevoGasto, metodoPago: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Tarjeta">Tarjeta</option>
                                        <option value="Transferencia">Transferencia</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#EF4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Registrar Gasto
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detalle de Gasto */}
            {showDetalleModal && selectedGasto && (
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
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '450px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                                Detalle del Gasto
                            </h3>
                            <button onClick={() => setShowDetalleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '1.5rem' }}>×</button>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Concepto</label>
                                <p style={{ fontSize: '1rem', fontWeight: 500, color: '#1f2937', margin: 0 }}>{selectedGasto.concepto}</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Monto</label>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#EF4444', margin: 0 }}>$ {selectedGasto.monto.toLocaleString()}</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Categoría</label>
                                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, background: '#FEE2E2', color: '#DC2626' }}>{selectedGasto.categoria}</span>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Método de Pago</label>
                                    <p style={{ fontSize: '0.95rem', color: '#374151', margin: 0 }}>{selectedGasto.metodoPago}</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Fecha</label>
                                    <p style={{ fontSize: '0.95rem', color: '#374151', margin: 0 }}>{selectedGasto.fecha}</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowDetalleModal(false)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#2563EB',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Eliminación */}
            {showDeleteModal && selectedGasto && (
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
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '400px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
                        overflow: 'hidden'
                    }}>
                        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: '#FEE2E2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>¿Eliminar Gasto?</h3>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                Esta acción no se puede deshacer.
                            </p>
                            <p style={{ color: '#374151', fontWeight: 600, fontSize: '0.95rem' }}>
                                {selectedGasto.concepto} - ${selectedGasto.monto.toLocaleString()}
                            </p>
                        </div>
                        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    deleteExpense(selectedGasto.id);
                                    setGastos(getExpenses());
                                    setShowDeleteModal(false);
                                    setSelectedGasto(null);
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#EF4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
