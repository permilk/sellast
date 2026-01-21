'use client';

// ============================================
// ADMIN - COMPLEMENTOS (CRUD Completo)
// ============================================

import { useState } from 'react';

interface Complemento {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    estado: 'activo' | 'inactivo';
    fechaCreacion: string;
}

const complementosMock: Complemento[] = [
    { id: 'CMP-001', nombre: 'Hielo (Bolsa 5kg)', descripcion: 'Bolsa de hielo para bebidas', precio: 25.00, stock: 50, categoria: 'Bebidas', estado: 'activo', fechaCreacion: '2026-01-10' },
    { id: 'CMP-002', nombre: 'Limón (10 pzas)', descripcion: 'Limones frescos por 10 piezas', precio: 15.00, stock: 30, categoria: 'Frutas', estado: 'activo', fechaCreacion: '2026-01-12' },
    { id: 'CMP-003', nombre: 'Sal de grano (500g)', descripcion: 'Sal de grano para bebidas', precio: 12.00, stock: 40, categoria: 'Condimentos', estado: 'activo', fechaCreacion: '2026-01-15' },
    { id: 'CMP-004', nombre: 'Mix de cacahuates', descripcion: 'Botana mixta para acompañar', precio: 35.00, stock: 25, categoria: 'Botanas', estado: 'activo', fechaCreacion: '2026-01-18' },
    { id: 'CMP-005', nombre: 'Chamoy (350ml)', descripcion: 'Salsa chamoy para preparados', precio: 28.00, stock: 0, categoria: 'Salsas', estado: 'inactivo', fechaCreacion: '2026-01-05' },
    { id: 'CMP-006', nombre: 'Chile en polvo Miguelito', descripcion: 'Chile piquín para bebidas', precio: 18.00, stock: 60, categoria: 'Condimentos', estado: 'activo', fechaCreacion: '2026-01-08' },
];

const categorias = ['Todas', 'Bebidas', 'Frutas', 'Condimentos', 'Botanas', 'Salsas'];

export default function ComplementosPage() {
    const [complementos, setComplementos] = useState<Complemento[]>(complementosMock);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('Todas');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Complemento | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        categoria: 'Bebidas'
    });

    const filteredComplementos = complementos.filter(c => {
        const matchSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategoria = categoriaFilter === 'Todas' || c.categoria === categoriaFilter;
        return matchSearch && matchCategoria;
    });

    const totalComplementos = complementos.length;
    const activos = complementos.filter(c => c.estado === 'activo').length;
    const stockBajo = complementos.filter(c => c.stock < 10 && c.stock > 0).length;
    const sinStock = complementos.filter(c => c.stock === 0).length;

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({ nombre: '', descripcion: '', precio: 0, stock: 0, categoria: 'Bebidas' });
        setShowModal(true);
    };

    const openEditModal = (item: Complemento) => {
        setEditingItem(item);
        setFormData({
            nombre: item.nombre,
            descripcion: item.descripcion,
            precio: item.precio,
            stock: item.stock,
            categoria: item.categoria
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.nombre.trim()) {
            alert('El nombre es requerido');
            return;
        }

        if (editingItem) {
            // Editar existente
            setComplementos(complementos.map(c =>
                c.id === editingItem.id
                    ? { ...c, ...formData, estado: formData.stock > 0 ? 'activo' : 'inactivo' }
                    : c
            ));
        } else {
            // Crear nuevo
            const newId = `CMP-${String(complementos.length + 1).padStart(3, '0')}`;
            const newItem: Complemento = {
                id: newId,
                ...formData,
                estado: formData.stock > 0 ? 'activo' : 'inactivo',
                fechaCreacion: new Date().toISOString().split('T')[0]
            };
            setComplementos([...complementos, newItem]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar este complemento?')) {
            setComplementos(complementos.filter(c => c.id !== id));
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
                        onClick={() => alert('Exportando complementos...')}
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

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="kpi-card" style={{ borderLeftColor: 'var(--color-primary)' }}>
                    <p className="kpi-label">Total Complementos</p>
                    <p className="kpi-value">{totalComplementos}</p>
                </div>
                <div className="kpi-card" style={{ borderLeftColor: 'var(--color-success)' }}>
                    <p className="kpi-label">Activos</p>
                    <p className="kpi-value" style={{ color: 'var(--color-success)' }}>{activos}</p>
                </div>
                <div className="kpi-card" style={{ borderLeftColor: 'var(--color-warning)' }}>
                    <p className="kpi-label">Stock Bajo</p>
                    <p className="kpi-value" style={{ color: 'var(--color-warning)' }}>{stockBajo}</p>
                </div>
                <div className="kpi-card" style={{ borderLeftColor: 'var(--color-danger)' }}>
                    <p className="kpi-label">Sin Stock</p>
                    <p className="kpi-value" style={{ color: 'var(--color-danger)' }}>{sinStock}</p>
                </div>
            </div>

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
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{item.descripcion}</div>
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
                                        <span className={`badge ${item.estado === 'activo' ? 'badge-success' : 'badge-gray'}`}>
                                            {item.estado === 'activo' ? 'Activo' : 'Inactivo'}
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
                            <div>
                                <label className="label">Descripción</label>
                                <input
                                    type="text"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    className="input"
                                    placeholder="Descripción breve"
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
