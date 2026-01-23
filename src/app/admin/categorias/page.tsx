'use client';

// ============================================
// ADMIN - CATEGORÍAS (WITH PERSISTENCE)
// ============================================

import { useState, useEffect } from 'react';
import { KPISummary } from '@/components/admin/KPISummary';
import { getCategories, addCategory, updateCategory, deleteCategory, Category } from '@/stores/categoriesStore';

export default function CategoriasPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Activo');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', status: 'Activo' as 'Activo' | 'Inactivo' });

    // Load categories from store
    useEffect(() => {
        setCategories(getCategories());
    }, []);

    const filteredCategories = categories.filter(cat => {
        const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'Todos' || cat.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, status: category.status });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', status: 'Activo' });
        }
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            alert('Por favor ingresa el nombre de la categoría');
            return;
        }

        if (editingCategory) {
            updateCategory(editingCategory.id, formData);
        } else {
            addCategory(formData);
        }

        setCategories(getCategories());
        setShowModal(false);
        setFormData({ name: '', status: 'Activo' });
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`¿Eliminar la categoría "${name}"?`)) {
            deleteCategory(id);
            setCategories(getCategories());
        }
    };

    const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', borderRadius: '16px', padding: '1.5rem',
                        width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>
                            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                        </h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Nombre</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nombre de la categoría"
                                style={{
                                    width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb',
                                    borderRadius: '8px', fontSize: '0.95rem'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Estado</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as 'Activo' | 'Inactivo' })}
                                style={{
                                    width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb',
                                    borderRadius: '8px', fontSize: '0.95rem'
                                }}
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '0.75rem 1.5rem', background: '#f3f4f6', border: 'none',
                                    borderRadius: '8px', cursor: 'pointer', fontWeight: 500
                                }}
                            >Cancelar</button>
                            <button
                                onClick={handleSubmit}
                                style={{
                                    padding: '0.75rem 1.5rem', background: '#2563EB', color: 'white',
                                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
                                }}
                            >{editingCategory ? 'Guardar' : 'Crear'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '1.5rem', fontWeight: 700, color: '#1f2937',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        Gestión de Categorías
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Administra las categorías de productos</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        padding: '0.75rem 1rem', background: '#2563EB', color: 'white',
                        border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Nueva Categoría
                </button>
            </div>

            {/* KPI Summary */}
            <KPISummary cards={[
                { label: 'Total Categorías', value: categories.length, color: 'blue' },
                { label: 'Activas', value: categories.filter(c => c.status === 'Activo').length, color: 'green' },
                { label: 'Inactivas', value: categories.filter(c => c.status === 'Inactivo').length, color: 'gray' },
                { label: 'Productos', value: totalProducts, color: 'purple' }
            ]} />

            {/* Filters */}
            <div style={{
                background: 'white', borderRadius: '12px', padding: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem',
                display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end'
            }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Buscar</label>
                    <input
                        type="text"
                        placeholder="Nombre de categoría..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.6rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                </div>
                <div style={{ minWidth: '180px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Estado</label>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        style={{ padding: '0.6rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.9rem', minWidth: '130px' }}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Nombre</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Estado</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map(cat => (
                            <tr key={cat.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem', fontWeight: 500, color: '#374151' }}>{cat.name}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                                        background: cat.status === 'Activo' ? '#D1FAE5' : '#F3F4F6',
                                        color: cat.status === 'Activo' ? '#059669' : '#6B7280'
                                    }}>{cat.status}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                        <button onClick={() => handleOpenModal(cat)} style={{ width: '32px', height: '32px', background: '#FEF3C7', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Editar">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(cat.id, cat.name)} style={{ width: '32px', height: '32px', background: '#FEE2E2', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Eliminar">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCategories.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No se encontraron categorías</div>
                )}
            </div>
        </div>
    );
}
