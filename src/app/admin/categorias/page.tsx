'use client';

// ============================================
// ADMIN - CATEGORÍAS (REFINE UI)
// ============================================

import { useState } from 'react';

const categoriesMock = [
    { id: 1, name: 'ACCESORIO MUNDOPET', status: 'Activo' },
    { id: 2, name: 'Accesorio Panel SPC', status: 'Activo' },
    { id: 3, name: 'Alimentos', status: 'Activo' },
    { id: 4, name: 'Juguetes', status: 'Inactivo' },
];

export default function CategoriasPage() {
    return (
        <div className="categorias-page">
            <div className="page-header">
                <div className="title-section">
                    <h1>Categorías de Productos <span className="divider">|</span> <span className="breadcrumb-icon">🏠</span> <span className="breadcrumb-chevron">{'>'}</span> <span className="breadcrumb-current">Buscador</span></h1>
                </div>
                <button className="btn-cyan">
                    <span>+</span> Agregar
                </button>
            </div>

            {/* Search Card */}
            <div className="search-card">
                <p className="card-instruction">Puedes filtrar con los campos a continuación</p>
                <div className="search-grid">
                    <div className="form-group main-input">
                        <label>NOMBRE</label>
                        <input
                            type="text"
                            className="input-field"
                        />
                    </div>

                    <div className="form-group status-input">
                        <label>ESTADO</label>
                        <select className="select-field">
                            <option>Activo</option>
                            <option>Inactivo</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button className="btn-search">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            Buscar
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="enterprise-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>NOMBRE</th>
                            <th style={{ width: '30%' }}>ESTADO</th>
                            <th style={{ width: '30%' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoriesMock.map(cat => (
                            <tr key={cat.id}>
                                <td className="text-gray-dark">{cat.name}</td>
                                <td>
                                    <span className="text-gray">{cat.status}</span>
                                </td>
                                <td>
                                    <div className="actions-cell">
                                        <button className="action-btn edit" title="Editar">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button className="action-btn detail" title="Detalle">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg> {/* Simplified Detail Icon similar to mockup edit 2 */}
                                        </button>
                                        <button className="action-btn delete" title="Eliminar">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .categorias-page { width: 100%; font-family: 'Inter', sans-serif; color: #5f6c7b; }
                
                /* HEADER */
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .title-section h1 { font-size: 1.25rem; font-weight: 600; color: #5f6c7b; display: flex; align-items: center; gap: 0.5rem; }
                .divider { color: #cbd5e1; font-weight: 300; }
                .breadcrumb-icon { font-size: 1rem; opacity: 0.5; }
                .breadcrumb-chevron { font-size: 0.8rem; color: #94a3b8; }
                .breadcrumb-current { color: #3b82f6; font-weight: 400; font-size: 1rem; }
                
                /* BUTTONS */
                .btn-cyan {
                    background-color: #5BC0DE;
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

                /* SEARCH CARD */
                .search-card {
                    background: white;
                    border-radius: 4px;
                    padding: 24px;
                    margin-bottom: 20px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                .card-instruction {
                    color: #94a3b8;
                    font-size: 0.9rem;
                    margin-bottom: 1.5rem;
                }
                
                .search-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px 40px;
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
                
                .form-actions {
                    grid-column: 2 / 3;
                    display: flex;
                    justify-content: flex-end; /* Button aligned right as per screenshot */
                }

                /* TABLE Styles */
                .table-container { background: white; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; padding-top: 10px;}
                .enterprise-table { width: 100%; border-collapse: collapse; }
                .enterprise-table th { text-align: left; padding: 12px 16px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
                .enterprise-table td { padding: 16px 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #334155; vertical-align: middle; }
                
                .text-gray-dark { color: #64748b; font-weight: 500; font-size: 0.95rem; text-transform: uppercase;}
                .text-gray { color: #64748b; }

                /* ACTION BUTTONS */
                .actions-cell { display: flex; gap: 8px; }
                .action-btn {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .action-btn:hover { opacity: 0.8; }
                
                /* Edit: Yellow/Orangeish */
                .action-btn.edit {
                    background-color: #FEF3C7; /* Light Yellow */
                    color: #D97706; /* Amber 600 */
                }
                
                /* Detail: Blue */
                .action-btn.detail {
                    background-color: #DBEAFE; /* Blue 100 */
                    color: #2563EB; /* Blue 600 */
                }

                /* Delete: Red/Pink */
                .action-btn.delete {
                    background-color: #FEE2E2; /* Red 100 */
                    color: #DC2626; /* Red 600 */
                }
            `}</style>
        </div>
    );
}
