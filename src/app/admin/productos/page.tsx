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
                {/* ... Header igual al anterior ... */}
                <div className="title-section">
                    <h1>Productos</h1>
                    <p>Gestiona el inventario y catálogo de venta</p>
                </div>
                <Link href="/admin/productos/nuevo" className="btn-primary">
                    Nuevo Producto
                </Link>
            </div>

            <div className="actions-bar">
                <div className="search-group">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    <input
                        type="search"
                        placeholder="Buscar por nombre o código..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                {/* ... Filters ... */}
            </div>

            <div className="table-container">
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
                                            {/* Actions... */}
                                            <button className="action-icon view">👁</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="text-center p-8 text-gray-500">
                                        No se encontraron productos. ¡Crea el primero!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination... */}
            <style jsx>{`
                /* ... Estilos Enterprise (mismos que antes) ... */
                .productos-page { max-width: 100%; }
                
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .title-section h1 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; }
                .title-section p { color: #64748b; font-size: 0.9rem; }
                
                .btn-primary { background: #2563eb; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; text-decoration: none; transition: background 0.2s; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
                .btn-primary:hover { background: #1d4ed8; }
                
                .actions-bar { background: #fff; padding: 1rem; border-radius: 12px 12px 0 0; border: 1px solid #e2e8f0; border-bottom: none; display: flex; gap: 1rem; align-items: center; justify-content: space-between; }
                
                .search-group { display: flex; align-items: center; gap: 0.75rem; background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.5rem 1rem; border-radius: 8px; flex: 1; max-width: 400px; }
                .search-group input { border: none; background: none; outline: none; width: 100%; font-size: 0.95rem; }
                
                .table-container { background: #fff; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; overflow: hidden; }
                
                .enterprise-table { width: 100%; border-collapse: collapse; }
                .enterprise-table th { text-align: left; padding: 1rem 1.5rem; background: #fff; border-bottom: 2px solid #f1f5f9; color: #64748b; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; }
                .enterprise-table td { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.9rem; vertical-align: middle; }
                .enterprise-table tr:hover td { background: #f8fafc; }
                
                .font-mono { font-family: monospace; }
                .text-gray { color: #64748b; }
                .font-medium { font-weight: 600; color: #1e293b; }
                
                .stock-badge { display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; }
                .stock-badge.empty { color: #ef4444; background: #fef2f2; padding: 0.1rem 0.5rem; border-radius: 4px; border: 1px solid #fecaca; }
                .stock-badge.low { color: #ea580c; background: #fff7ed; padding: 0.1rem 0.5rem; border-radius: 4px; border: 1px solid #fed7aa; }
                
                .status-pill { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
                .status-pill.active { background: #166534; color: #fff; }
                .status-pill.inactive { background: #ef4444; color: #fff; }
                
                .actions-cell { display: flex; gap: 0.5rem; }
                .action-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: none; background: none; border-radius: 6px; cursor: pointer; color: #64748b; transition: all 0.2s; }
                .action-icon:hover { background: #f1f5f9; }
                .p-8 { padding: 2rem; }
                .text-center { text-align: center; }
            `}</style>
        </div>
    );
}
