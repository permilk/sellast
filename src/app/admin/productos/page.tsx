'use client';

// ============================================
// ADMIN - PRODUCTOS LISTADO (ENTERPRISE)
// ============================================

import Link from 'next/link';
import { useState } from 'react';

const productosMock = [
    { id: '1', codigo: '7790895002113', nombre: 'Agua Mineral 500ml', categoria: 'Bebidas', precio: 700.00, stock: 92, status: 'Activo' },
    { id: '2', codigo: '7790895000119', nombre: 'Coca Cola 500ml', categoria: 'Bebidas', precio: 1200.00, stock: 44, status: 'Activo' },
    { id: '3', codigo: '7791234567890', nombre: 'Detergente Magistral 500ml', categoria: 'Limpieza', precio: 1400.00, stock: 13, status: 'Activo' },
    { id: '4', codigo: '7790580005678', nombre: 'Galletitas Oreo', categoria: 'Alimentos', precio: 850.00, stock: 38, status: 'Activo' },
    { id: '5', codigo: 'VIN-001', nombre: 'Vinil Textil Premium', categoria: 'Insumos', precio: 320.00, stock: 0, status: 'Activo' },
    { id: '6', codigo: 'GEN-001', nombre: 'Producto Genérico', categoria: '-', precio: 200.00, stock: 3, status: 'Inactivo' },
];

export default function ProductosPage() {
    const [busqueda, setBusqueda] = useState('');

    return (
        <div className="productos-page">
            <div className="page-header">
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
                <div className="filters-group">
                    <select className="select-filter">
                        <option>Estado: Todos</option>
                        <option>Activos</option>
                        <option>Inactivos</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
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
                        {productosMock.map(prod => (
                            <tr key={prod.id}>
                                <td className="font-mono text-gray">{prod.codigo}</td>
                                <td className="font-medium">{prod.nombre}</td>
                                <td>{prod.categoria}</td>
                                <td className="font-medium">${prod.precio.toFixed(2)}</td>
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
                                        <button className="action-icon view" title="Ver">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                        </button>
                                        <button className="action-icon edit" title="Editar">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                        </button>
                                        <button className="action-icon delete" title="Eliminar">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <span className="page-info">Filas por página: 10 ▼</span>
                <span className="page-control">1-6 de 6 <span className="arrows">‹ ›</span></span>
            </div>

            <style jsx>{`
                .productos-page { max-width: 100%; }
                
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .title-section h1 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; }
                .title-section p { color: #64748b; font-size: 0.9rem; }
                
                .btn-primary { background: #2563eb; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; text-decoration: none; transition: background 0.2s; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
                .btn-primary:hover { background: #1d4ed8; }
                
                .actions-bar { background: #fff; padding: 1rem; border-radius: 12px 12px 0 0; border: 1px solid #e2e8f0; border-bottom: none; display: flex; gap: 1rem; align-items: center; justify-content: space-between; }
                
                .search-group { display: flex; align-items: center; gap: 0.75rem; background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.5rem 1rem; border-radius: 8px; flex: 1; max-width: 400px; }
                .search-group input { border: none; background: none; outline: none; width: 100%; font-size: 0.95rem; }
                
                .select-filter { padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; color: #64748b; font-size: 0.9rem; outline: none; }
                
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
                .action-icon.view:hover { color: #2563eb; background: #eff6ff; }
                .action-icon.edit:hover { color: #d97706; background: #fffbeb; }
                .action-icon.delete:hover { color: #dc2626; background: #fef2f2; }
                
                .pagination { display: flex; justify-content: flex-end; align-items: center; padding: 1rem; gap: 2rem; color: #64748b; font-size: 0.85rem; }
                .arrows { letter-spacing: 5px; cursor: pointer; }
            `}</style>
        </div>
    );
}
