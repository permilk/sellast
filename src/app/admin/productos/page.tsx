'use client';

// ============================================
// ADMIN - PRODUCTOS LISTADO (CONNECTED)
// ============================================

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getProductsAction } from './actions/product.actions';

// Tipo inferido (o importar interfaz)
type ProductItem = {
    id: string;
    sku: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: string;
};

export default function ProductosPage() {
    const [busqueda, setBusqueda] = useState('');
    const [productos, setProductos] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch data real
    useEffect(() => {
        loadProducts();
    }, [busqueda]); // Debounce sería ideal aquí

    const loadProducts = async () => {
        setLoading(true);
        const res = await getProductsAction(busqueda);
        if (res.success && res.data) {
            setProductos(res.data);
        } else {
            // Fallback a array vacío si falla (o mostrar toast)
            setProductos([]);
        }
        setLoading(false);
    };

    return (
        <div className="productos-page">
            <div className="page-header">
                <div className="title-section">
                    <h1>Productos</h1>
                </div>
                <div className="header-actions">
                    <button className="btn-cyan">
                        <span>+</span> Exportar
                    </button>
                    <Link href="/admin/productos/nuevo" className="btn-cyan">
                        <span>+</span> Registrar
                    </Link>
                </div>
            </div>

            {/* Search Card */}
            <div className="search-card">
                <div className="search-grid">
                    <div className="form-group main-input">
                        <label>NOMBRE</label>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="form-group status-input">
                        <label>ESTADO</label>
                        <select className="select-field">
                            <option>Todos</option>
                            <option>Activo</option>
                            <option>Inactivo</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>LÍNEA</label>
                        <select className="select-field">
                            <option>Todas</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>CATEGORÍA</label>
                        <select className="select-field">
                            <option>Todos</option>
                            {/* Map categories here */}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button className="btn-search">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            Buscar
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Area (Cleaned up) */}
            <div className="table-container">
                {/* ... Table content remains same but cleaner container ... */}
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Cargando productos...</div>
                ) : (
                    <table className="enterprise-table">
                        <thead>
                            <tr>
                                <th>CÓDIGO</th>
                                <th>NOMBRE</th>
                                <th>CATEGORÍA</th>
                                <th>PRECIO</th>
                                <th>STOCK</th>
                                <th>ESTADO</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.length > 0 ? productos.map(prod => (
                                <tr key={prod.id}>
                                    <td className="font-mono text-gray">{prod.sku}</td>
                                    <td className="font-medium">{prod.name}</td>
                                    <td>{prod.category}</td>
                                    <td className="font-medium">${prod.price.toFixed(2)}</td>
                                    <td>
                                        {prod.stock === 0 ? (
                                            <span className="stock-badge empty">⚠️ 0</span>
                                        ) : prod.stock < 5 ? (
                                            <span className="stock-badge low">⚠️ {prod.stock}</span>
                                        ) : (
                                            prod.stock
                                        )}
                                    </td>
                                    <td>
                                        <span className={`status-pill ${prod.status === 'Activo' ? 'active' : 'inactive'}`}>
                                            {prod.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="action-icon view">👁</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="text-center p-8 text-gray-500">
                                        No se encontraron productos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="page-footer">
                <button className="btn-import">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Importar
                </button>
            </div>

            <style jsx>{`
                .productos-page { width: 100%; font-family: 'Inter', sans-serif; color: #5f6c7b; }
                
                /* HEADER */
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .title-section h1 { font-size: 1.25rem; font-weight: 600; color: #5f6c7b; display: flex; align-items: center; gap: 0.5rem; }
                .divider { color: #cbd5e1; font-weight: 300; }
                .breadcrumb-icon { font-size: 1rem; opacity: 0.5; }
                .breadcrumb-chevron { font-size: 0.8rem; color: #94a3b8; }
                .breadcrumb-current { color: #3b82f6; font-weight: 400; font-size: 1rem; }
                
                .header-actions { display: flex; gap: 10px; }
                
                /* BUTTONS */
                .btn-cyan {
                    background-color: #5BC0DE; /* Cyan Mockup Color */
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-weight: 500;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    text-decoration: none;
                    transition: opacity 0.2s;
                }
                .btn-cyan:hover { opacity: 0.9; }
                
                .btn-search {
                    background-color: #5BC0DE;
                    color: white;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 4px;
                    font-weight: 500;
                    font-size: 0.95rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .btn-import {
                    background-color: #2ECC71; /* Green Mockup Color */
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-weight: 500;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                }

                /* SEARCH CARD - Light Theme Specific */
                .search-card {
                    background: white;
                    border-radius: 4px;
                    padding: 24px;
                    margin-bottom: 20px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05); /* Subtle shadow */
                }
                
                .search-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr; /* 2 Columns */
                    gap: 20px 40px; /* Row gap, Col gap */
                    align-items: end;
                }
                
                .form-group label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #64748b;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .input-field, .select-field {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    font-size: 0.95rem;
                    color: #334155;
                    outline: none;
                    background: #fff;
                    transition: border-color 0.2s;
                }
                .input-field:focus, .select-field:focus { border-color: #5BC0DE; }
                
                .main-input { grid-column: 1 / 2; }
                .status-input { grid-column: 2 / 3; }
                
                .form-actions {
                    grid-column: 2 / 3;
                    display: flex;
                    justify-content: flex-start; /* Aligned left within the column mostly */
                }

                /* TABLE Styles */
                .table-container { background: white; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
                .enterprise-table { width: 100%; border-collapse: collapse; }
                .enterprise-table th { text-align: left; padding: 12px 16px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
                .enterprise-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #334155; }
                
                .page-footer { display: flex; justify-content: flex-end; margin-top: 20px; }
                
                /* Badges */
                .status-pill.active { color: #16a34a; font-weight: 600; }
                .status-pill.inactive { color: #dc2626; font-weight: 600; }
                
                .stock-badge.empty { color: #dc2626; background: #fee2e2; padding: 2px 6px; border-radius: 4px; font-size: 0.85rem; }
                .stock-badge.low { color: #d97706; background: #fef3c7; padding: 2px 6px; border-radius: 4px; font-size: 0.85rem; }
            `}</style>
        </div>
    );
}
