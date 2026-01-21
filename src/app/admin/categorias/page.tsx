'use client';

// ============================================
// ADMIN - CATEGORÍAS
// ============================================

import { useState } from 'react';

const categoriasMock = [
    { id: 1, nombre: 'Bebidas', items: 15, status: 'Activa' },
    { id: 2, nombre: 'Alimentos', items: 34, status: 'Activa' },
    { id: 3, nombre: 'Limpieza', items: 12, status: 'Activa' },
    { id: 4, nombre: 'Indumentaria', items: 8, status: 'Activa' },
    { id: 5, nombre: 'Cuidado Personal', items: 22, status: 'Inactiva' },
];

export default function CategoriasPage() {
    return (
        <div className="categorias-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Categorías</h1>
                    <p>Organiza tus productos en grupos</p>
                </div>
                <button className="btn-primary">Nueva Categoría</button>
            </div>

            <div className="cards-grid">
                {categoriasMock.map(cat => (
                    <div key={cat.id} className="cat-card">
                        <div className="cat-header">
                            <span className="cat-name">{cat.nombre}</span>
                            <div className="cat-actions">
                                <button className="icon-btn edit">✎</button>
                                <button className="icon-btn delete">🗑</button>
                            </div>
                        </div>
                        <div className="cat-body">
                            <div className="stat">
                                <span className="stat-val">{cat.items}</span>
                                <span className="stat-label">Productos</span>
                            </div>
                            <span className={`status-badge ${cat.status === 'Activa' ? 'active' : 'inactive'}`}>
                                {cat.status}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Add New Card (Visual) */}
                <div className="cat-card add-new">
                    <div className="add-content">
                        <span className="plus-icon">+</span>
                        <span>Crear nueva</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .categorias-page { max-width: 1200px; }
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .header-title h1 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; }
                .header-title p { color: #64748b; font-size: 0.9rem; }
                
                .btn-primary { background: #2563eb; color: #fff; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .btn-primary:hover { background: #1d4ed8; }

                .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }

                .cat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; transition: all 0.2s; }
                .cat-card:hover { transform: translateY(-3px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border-color: #cbd5e1; }
                
                .cat-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
                .cat-name { font-size: 1.1rem; font-weight: 700; color: #1e293b; }
                
                .cat-actions { display: flex; gap: 0.5rem; opacity: 0; transition: opacity 0.2s; }
                .cat-card:hover .cat-actions { opacity: 1; }
                .icon-btn { border: none; background: #f1f5f9; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 0.9rem; }
                .icon-btn.edit:hover { background: #dbeafe; color: #2563eb; }
                .icon-btn.delete:hover { background: #fee2e2; color: #dc2626; }

                .cat-body { display: flex; justify-content: space-between; align-items: flex-end; }
                .stat { display: flex; flex-direction: column; }
                .stat-val { font-size: 1.5rem; font-weight: 700; color: #1e293b; line-height: 1; }
                .stat-label { font-size: 0.8rem; color: #94a3b8; }

                .status-badge { font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 600; }
                .status-badge.active { background: #dcfce7; color: #166534; }
                .status-badge.inactive { background: #f1f5f9; color: #64748b; }

                .cat-card.add-new { border: 2px dashed #e2e8f0; background: #f8fafc; display: flex; align-items: center; justify-content: center; cursor: pointer; min-height: 160px; }
                .cat-card.add-new:hover { border-color: #2563eb; background: #eff6ff; }
                .add-content { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: #2563eb; font-weight: 600; }
                .plus-icon { font-size: 2rem; line-height: 1; }
            `}</style>
        </div>
    );
}
