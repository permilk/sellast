'use client';

// ============================================
// ADMIN - COMPLEMENTOS (CRUD Completo)
// ============================================

import { useState, useEffect } from 'react';
import { exportToExcel } from '@/utils/exportExcel';
import { KPISummary } from '@/components/admin/KPISummary';
import { getComplements, addComplement, updateComplement, deleteComplement, Complement } from '@/stores/complementsStore';

const categorias = ['Todas', 'Bebidas', 'Frutas', 'Condimentos', 'Botanas', 'Salsas', 'Hielos', 'Desechables'];

export default function ComplementosPage() {
    const [complementos, setComplementos] = useState<Complement[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('Todas');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Complement | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        categoria: 'Bebidas',
        precio: 0,
        stock: 0
    });

    // Load from store
    useEffect(() => {
        setComplementos(getComplements());
    }, []);

    const filteredComplementos = complementos.filter(c => {
        const matchSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategoria = categoriaFilter === 'Todas' || c.categoria === categoriaFilter;
        return matchSearch && matchCategoria;
    });

    const totalComplementos = complementos.length;
    const activos = complementos.filter(c => c.estado === 'Disponible').length;
    const stockBajo = complementos.filter(c => c.estado === 'Stock Bajo').length;
    const sinStock = complementos.filter(c => c.estado === 'Agotado').length;

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({ nombre: '', categoria: 'Bebidas', precio: 0, stock: 0 });
        setShowModal(true);
    };

    const openEditModal = (item: Complement) => {
        setEditingItem(item);
        setFormData({
            nombre: item.nombre,
            categoria: item.categoria,
            precio: item.precio,
            stock: item.stock
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.nombre.trim()) {
            alert('El nombre es requerido');
            return;
        }

        if (editingItem) {
            updateComplement(editingItem.id, formData);
        } else {
            addComplement(formData);
        }
        setComplementos(getComplements());
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar este complemento?')) {
            deleteComplement(id);
            setComplementos(getComplements());
        }
    };

    return (
        <div style={{ padding: '1.5rem', fontFamily: 'var(--font-primary)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gray-900)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Complementos
                    </h1>
                    <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>Gestiona accesorios y complementos para ventas</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={() => exportToExcel(
                            filteredComplementos.map((item: Complement) => ({
                                ID: item.id,
                                Código: item.codigo,
                                Nombre: item.nombre,
                                Precio: `$${item.precio.toFixed(2)}`,
                                Stock: item.stock,
                                Categoría: item.categoria,
                                Estado: item.estado
                            })),
                            'Complementos_Sellast',
                            'Complementos'
                        )}
                        style={{ padding: '0.75rem 1rem', background: 'white', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Exportar
                    </button>
                    <button onClick={openAddModal} style={{ padding: '0.75rem 1rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Nuevo Complemento
                    </button>
                </div>
            </div>

            {/* KPI Summary */}
            <KPISummary cards={[
                { label: 'Total Complementos', value: totalComplementos, color: 'blue' },
                { label: 'Activos', value: activos, color: 'green' },
                { label: 'Stock Bajo', value: stockBajo, color: 'amber' },
                { label: 'Sin Stock', value: sinStock, color: 'red' }
            ]} />

            {/* Filters */}
            <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label className="label">Buscar</label>
                    <input
                        type="text"
                        placeholder="Nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input"
                    />
                </div>
                <div style={{ minWidth: '180px' }}>
                    <label className="label">Categoría</label>
                    <select value={categoriaFilter} onChange={(e) => setCategoriaFilter(e.target.value)} className="select">
                        {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Complemento</th>
                                <th>Categoría</th>
                                <th style={{ textAlign: 'center' }}>Stock</th>
                                <th style={{ textAlign: 'right' }}>Precio</th>
                                <th style={{ textAlign: 'center' }}>Estado</th>
                                <th style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplementos.map(item => (
                                <tr key={item.id}>
                                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-primary)' }}>{item.id}</td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>{item.nombre}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{item.codigo}</div>
                                    </td>
                                    <td>
                                        <span className="badge badge-primary">{item.categoria}</span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontWeight: 600,
                                            color: item.stock === 0 ? 'var(--color-danger)' : item.stock < 10 ? 'var(--color-warning)' : 'var(--color-gray-700)'
                                        }}>
                                            {item.stock}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>$ {item.precio.toFixed(2)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`badge ${item.estado === 'Disponible' ? 'badge-success' : item.estado === 'Stock Bajo' ? 'badge-warning' : 'badge-gray'}`}>
                                            {item.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                            <button onClick={() => openEditModal(item)} className="btn-action btn-action-edit" title="Editar">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="btn-action btn-action-delete" title="Eliminar">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredComplementos.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>
                        No se encontraron complementos
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '12px', width: '100%', maxWidth: '500px',
                        maxHeight: '90vh', overflow: 'auto'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>
                                {editingItem ? 'Editar Complemento' : 'Nuevo Complemento'}
                            </h2>
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="label">Nombre *</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="input"
                                    placeholder="Nombre del complemento"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="label">Precio ($)</label>
                                    <input
                                        type="number"
                                        value={formData.precio}
                                        onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                                        className="input"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="label">Stock</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        className="input"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Categoría</label>
                                <select
                                    value={formData.categoria}
                                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                    className="select"
                                >
                                    {categorias.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancelar</button>
                            <button onClick={handleSave} className="btn btn-primary">
                                {editingItem ? 'Guardar Cambios' : 'Crear Complemento'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
