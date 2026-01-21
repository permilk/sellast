'use client';

// ============================================
// ADMIN - NUEVO PRODUCTO (FORMULARIO EMPRESARIAL)
// ============================================

import Link from 'next/link';
import { useState } from 'react';

export default function NuevoProductoPage() {
    const [tieneVariantes, setTieneVariantes] = useState(false);

    return (
        <div className="new-product-page">
            <div className="page-header">
                <div>
                    <Link href="/admin/productos" className="back-link">← Volver a Productos</Link>
                    <h1>Nuevo Producto</h1>
                </div>
                <div className="header-actions">
                    <Link href="/admin/productos" className="btn-cancel">Cancelar</Link>
                    <button className="btn-save">Crear producto</button>
                </div>
            </div>

            <div className="form-container">
                {/* GENERAL INFO */}
                <div className="form-section">
                    <div className="form-row split-2-1">
                        <div className="form-group">
                            <label>Nombre *</label>
                            <input type="text" placeholder="Ej. Agua Mineral 500ml" />
                        </div>
                        <div className="form-group">
                            <label>Código de Barras</label>
                            <div className="input-with-action">
                                <input type="text" placeholder="Escanea o escribe..." />
                                <button className="btn-icon-inside" title="Escanear">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Categoría</label>
                        <select>
                            <option>Seleccionar categoría...</option>
                            <option>Bebidas</option>
                            <option>Limpieza</option>
                            <option>Alimentos</option>
                            <option>Indumentaria</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea placeholder="Detalles del producto..." rows={3}></textarea>
                    </div>
                </div>

                {/* PRICING & STOCK */}
                <div className="form-section">
                    <div className="form-row split-2">
                        <div className="form-group">
                            <label>Precio de Compra * (Costo)</label>
                            <div className="money-input">
                                <span>$</span>
                                <input type="number" placeholder="0.00" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Precio de Venta *</label>
                            <div className="money-input">
                                <span>$</span>
                                <input type="number" placeholder="0.00" />
                            </div>
                        </div>
                    </div>

                    <div className="form-row split-2">
                        <div className="form-group">
                            <label>Stock Actual</label>
                            <input type="number" defaultValue="0" />
                        </div>
                        <div className="form-group">
                            <label>Stock Mínimo</label>
                            <input type="number" defaultValue="5" />
                        </div>
                    </div>
                </div>

                {/* ATTRIBUTES */}
                <div className="form-section">
                    <h3 className="section-title">Características (Opcional)</h3>
                    <div className="form-row split-2">
                        <div className="form-group">
                            <label>Marca</label>
                            <select><option>Seleccionar...</option><option>Coca Cola</option><option>Nike</option></select>
                        </div>
                        <div className="form-group">
                            <label>Género</label>
                            <select><option>Unisex</option><option>Hombre</option><option>Mujer</option></select>
                        </div>
                    </div>
                </div>

                {/* VARIANTS TOGGLE */}
                <div className="form-section variants-section">
                    <div className="toggle-row">
                        <div className="toggle-switch">
                            <input type="checkbox" id="variants" checked={tieneVariantes} onChange={e => setTieneVariantes(e.target.checked)} />
                            <label htmlFor="variants"></label>
                        </div>
                        <div className="toggle-label">
                            <span className="toggle-title">Producto con Variantes</span>
                            <span className="toggle-desc">Habilita tallas, colores u otras combinaciones</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .new-product-page { max-width: 900px; margin: 0 auto; }
                
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .back-link { font-size: 0.85rem; color: #64748b; text-decoration: none; margin-bottom: 0.5rem; display: block; }
                .page-header h1 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0; }
                
                .header-actions { display: flex; gap: 1rem; }
                .btn-cancel { padding: 0.75rem 1.5rem; border: 1px solid #e2e8f0; background: #fff; color: #64748b; border-radius: 8px; font-weight: 600; text-decoration: none; }
                .btn-save { padding: 0.75rem 1.5rem; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
                .btn-save:hover { background: #1d4ed8; }

                .form-container { display: flex; flex-direction: column; gap: 1.5rem; }
                
                .form-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .section-title { font-size: 0.9rem; color: #64748b; margin-bottom: 1rem; font-weight: 500; }

                .form-group { margin-bottom: 1.25rem; }
                .form-group:last-child { margin-bottom: 0; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500; color: #334155; }
                
                .form-group input, .form-group select, .form-group textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    color: #1e293b;
                    outline: none;
                    transition: all 0.2s;
                    background: #fff;
                }
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }

                .form-row { display: flex; gap: 1.5rem; }
                .split-2 { grid-template-columns: 1fr 1fr; display: grid; }
                .split-2-1 { display: grid; grid-template-columns: 2fr 1fr; }

                .input-with-action { position: relative; display: flex; }
                .input-with-action input { padding-right: 3rem; }
                .btn-icon-inside { position: absolute; right: 0; top: 0; bottom: 0; width: 3rem; background: none; border: none; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .btn-icon-inside:hover { color: #2563eb; }

                .money-input { position: relative; }
                .money-input span { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #64748b; font-weight: 600; }
                .money-input input { padding-left: 2rem; }

                .variants-section { background: #f8fafc; border: 1px solid #e2e8f0; }
                .toggle-row { display: flex; align-items: flex-start; gap: 1rem; }
                
                .toggle-switch { position: relative; width: 44px; height: 24px; }
                .toggle-switch input { opacity: 0; width: 0; height: 0; }
                .toggle-switch label { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
                .toggle-switch label:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
                .toggle-switch input:checked + label { background-color: #2563eb; }
                .toggle-switch input:checked + label:before { transform: translateX(20px); }

                .toggle-label { display: flex; flex-direction: column; }
                .toggle-title { font-weight: 600; color: #1e293b; font-size: 0.95rem; }
                .toggle-desc { font-size: 0.85rem; color: #64748b; }

                @media (max-width: 768px) {
                    .form-row, .split-2, .split-2-1 { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
