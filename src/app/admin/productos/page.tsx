'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { exportToExcel } from '@/utils/exportExcel';
import { KPISummary } from '@/components/admin/KPISummary';
import { getProducts, updateProduct, deleteProduct, Product } from '@/stores/productsStore';

const categories = ['Todas', 'Aguas', 'Complementos', 'Gaseosa', 'Licor', 'Tienda', 'Bebidas', 'Limpieza', 'Alimentos', 'Indumentaria'];

export default function ProductosPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todas');
    const [estadoFilter, setEstadoFilter] = useState('todos');

    // Modal states
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Product>>({});

    // Load products from localStorage on mount
    useEffect(() => {
        setProducts(getProducts());
    }, []);

    const refreshProducts = () => setProducts(getProducts());

    const filteredProducts = products.filter(prod => {
        const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prod.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'Todas' || prod.category === categoryFilter;
        const matchesEstado = estadoFilter === 'todos' || prod.estado === estadoFilter;
        return matchesSearch && matchesCategory && matchesEstado;
    });

    const handleViewProduct = (prod: Product) => {
        setSelectedProduct(prod);
        setShowDetailModal(true);
    };

    const handleEditProduct = (prod: Product) => {
        setSelectedProduct(prod);
        setEditForm({ ...prod });
        setShowEditModal(true);
    };

    const handleDeleteClick = (prod: Product) => {
        setSelectedProduct(prod);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (selectedProduct) {
            deleteProduct(selectedProduct.id);
            refreshProducts();
            setShowDeleteConfirm(false);
            setSelectedProduct(null);
        }
    };

    const saveEdit = () => {
        if (selectedProduct && editForm) {
            updateProduct(selectedProduct.id, editForm);
            refreshProducts();
            setShowEditModal(false);
            setSelectedProduct(null);
        }
    };

    const getEstadoBadge = (estado: string) => {
        const styles: Record<string, React.CSSProperties> = {
            activo: { background: '#10B981', color: 'white' },
            inactivo: { background: '#6B7280', color: 'white' },
            agotado: { background: '#EF4444', color: 'white' }
        };
        return {
            ...styles[estado],
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'capitalize' as const
        };
    };

    const modalOverlay: React.CSSProperties = {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    };

    const modalContent: React.CSSProperties = {
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
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
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        Gestión de Productos
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Administra tu catálogo de productos
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={() => exportToExcel(
                            filteredProducts.map(p => ({
                                SKU: p.sku,
                                Nombre: p.name,
                                Categoría: p.category,
                                Stock: p.stock,
                                Precio: `$${p.precio.toFixed(2)}`,
                                Estado: p.estado
                            })),
                            'Productos_Sellast',
                            'Productos'
                        )}
                        style={{
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
                    <Link href="/admin/productos/nuevo">
                        <button style={{
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
                            Nuevo Producto
                        </button>
                    </Link>
                </div>
            </div>

            {/* KPI Summary */}
            <KPISummary cards={[
                { label: 'Total Productos', value: products.length, color: 'blue' },
                { label: 'Activos', value: products.filter(p => p.estado === 'activo').length, color: 'green' },
                { label: 'Stock Bajo', value: products.filter(p => p.stock > 0 && p.stock < 15).length, color: 'amber' },
                { label: 'Agotados', value: products.filter(p => p.estado === 'agotado').length, color: 'red' }
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
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.35rem' }}>Buscar</label>
                    <input
                        type="text"
                        placeholder="Nombre o SKU..."
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
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.35rem' }}>Categoría</label>
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        style={{
                            padding: '0.6rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            minWidth: '140px'
                        }}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.35rem' }}>Estado</label>
                    <select
                        value={estadoFilter}
                        onChange={e => setEstadoFilter(e.target.value)}
                        style={{
                            padding: '0.6rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            minWidth: '120px'
                        }}
                    >
                        <option value="todos">Todos</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="agotado">Agotado</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280' }}>SKU</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280' }}>Producto</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280' }}>Categoría</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280' }}>Stock</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280' }}>Precio</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280' }}>Estado</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', color: '#6b7280' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(prod => (
                            <tr key={prod.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#6b7280' }}>{prod.sku}</td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{prod.name}</td>
                                <td style={{ padding: '1rem', color: '#6b7280' }}>{prod.category}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        background: prod.stock <= 10 ? '#FEE2E2' : '#D1FAE5',
                                        color: prod.stock <= 10 ? '#DC2626' : '#059669'
                                    }}>
                                        {prod.stock}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>$ {prod.precio.toFixed(2)}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={getEstadoBadge(prod.estado)}>{prod.estado}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                        <button
                                            onClick={() => handleViewProduct(prod)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#CFFAFE',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title="Ver"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleEditProduct(prod)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#FEF3C7',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title="Editar"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(prod)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#FEE2E2',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
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

                {filteredProducts.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                        No se encontraron productos
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedProduct && (
                <div style={modalOverlay} onClick={() => setShowDetailModal(false)}>
                    <div style={modalContent} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Detalle del Producto</h2>
                            <button onClick={() => setShowDetailModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <div><strong>SKU:</strong> {selectedProduct.sku}</div>
                            <div><strong>Nombre:</strong> {selectedProduct.name}</div>
                            <div><strong>Categoría:</strong> {selectedProduct.category}</div>
                            <div><strong>Precio:</strong> ${selectedProduct.precio.toFixed(2)}</div>
                            <div><strong>Stock:</strong> {selectedProduct.stock} unidades</div>
                            <div><strong>Estado:</strong> <span style={getEstadoBadge(selectedProduct.estado)}>{selectedProduct.estado}</span></div>
                            {selectedProduct.descripcion && <div><strong>Descripción:</strong> {selectedProduct.descripcion}</div>}
                            {selectedProduct.marca && <div><strong>Marca:</strong> {selectedProduct.marca}</div>}
                            {selectedProduct.codigoBarras && <div><strong>Código de Barras:</strong> {selectedProduct.codigoBarras}</div>}
                        </div>
                        <button
                            onClick={() => setShowDetailModal(false)}
                            style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', background: '#E5E7EB', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedProduct && (
                <div style={modalOverlay} onClick={() => setShowEditModal(false)}>
                    <div style={modalContent} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Editar Producto</h2>
                            <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Nombre</label>
                                <input
                                    type="text"
                                    value={editForm.name || ''}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Precio</label>
                                <input
                                    type="number"
                                    value={editForm.precio || 0}
                                    onChange={e => setEditForm({ ...editForm, precio: parseFloat(e.target.value) })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Stock</label>
                                <input
                                    type="number"
                                    value={editForm.stock || 0}
                                    onChange={e => setEditForm({ ...editForm, stock: parseInt(e.target.value) })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Categoría</label>
                                <select
                                    value={editForm.category || ''}
                                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                >
                                    {categories.filter(c => c !== 'Todas').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Estado</label>
                                <select
                                    value={editForm.estado || 'activo'}
                                    onChange={e => setEditForm({ ...editForm, estado: e.target.value as Product['estado'] })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="agotado">Agotado</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => setShowEditModal(false)}
                                style={{ flex: 1, padding: '0.75rem', background: '#E5E7EB', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveEdit}
                                style={{ flex: 1, padding: '0.75rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && selectedProduct && (
                <div style={modalOverlay} onClick={() => setShowDeleteConfirm(false)}>
                    <div style={modalContent} onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>¿Eliminar producto?</h2>
                            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                                Esta acción eliminará permanentemente <strong>{selectedProduct.name}</strong>. Esta acción no se puede deshacer.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                style={{ flex: 1, padding: '0.75rem', background: '#E5E7EB', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{ flex: 1, padding: '0.75rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
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
