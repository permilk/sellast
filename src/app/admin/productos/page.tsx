'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Product {
    id: string;
    sku: string;
    name: string;
    category: string;
    stock: number;
    precio: number;
    estado: 'activo' | 'inactivo' | 'agotado';
}

const mockProducts: Product[] = [
    { id: '1', sku: 'WJD-001', name: 'Whisky JackDaniels', category: 'Licor', stock: 24, precio: 85.00, estado: 'activo' },
    { id: '2', sku: 'VA-001', name: 'Vodka Absolut', category: 'Licor', stock: 18, precio: 75.00, estado: 'activo' },
    { id: '3', sku: 'CC-001', name: 'CocaCola', category: 'Gaseosa', stock: 48, precio: 18.00, estado: 'activo' },
    { id: '4', sku: 'AS-001', name: 'Agua San 1Lt', category: 'Aguas', stock: 100, precio: 7.00, estado: 'activo' },
    { id: '5', sku: 'PS-001', name: 'Pisco Suerño', category: 'Licor', stock: 0, precio: 10.00, estado: 'agotado' },
    { id: '6', sku: 'PR-001', name: 'Preparado', category: 'Complementos', stock: 12, precio: 107.00, estado: 'activo' },
    { id: '7', sku: 'TL-001', name: 'Tarro de leche gloria', category: 'Tienda', stock: 60, precio: 3.50, estado: 'activo' },
    { id: '8', sku: 'PM-001', name: 'Pomarola', category: 'Tienda', stock: 40, precio: 7.00, estado: 'inactivo' },
];

const categories = ['Todas', 'Aguas', 'Complementos', 'Gaseosa', 'Licor', 'Tienda'];

export default function ProductosPage() {
    const [products] = useState<Product[]>(mockProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todas');
    const [estadoFilter, setEstadoFilter] = useState('todos');

    const filteredProducts = products.filter(prod => {
        const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prod.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'Todas' || prod.category === categoryFilter;
        const matchesEstado = estadoFilter === 'todos' || prod.estado === estadoFilter;
        return matchesSearch && matchesCategory && matchesEstado;
    });

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
                        onClick={() => alert('Exportando productos...')}
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
                            minWidth: '150px'
                        }}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
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
                            minWidth: '130px'
                        }}
                    >
                        <option value="todos">Todos</option>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                        <option value="agotado">Agotados</option>
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
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>SKU</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Producto</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Categoría</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Stock</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Precio</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Estado</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(prod => (
                            <tr key={prod.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem', fontWeight: 500, color: '#7C3AED' }}>{prod.sku}</td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{prod.name}</td>
                                <td style={{ padding: '1rem', color: '#6b7280' }}>{prod.category}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '6px',
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
                                            onClick={() => alert(`Ver producto: ${prod.name}`)}
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
                                            onClick={() => alert(`Editar producto: ${prod.name}`)}
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
                                            onClick={() => alert(`Eliminar producto: ${prod.name}`)}
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
        </div>
    );
}
