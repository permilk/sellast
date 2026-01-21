'use client';

// ============================================
// ADMIN - NUEVO PRODUCTO
// ============================================

import Link from 'next/link';
import { useState } from 'react';

const categorias = [
    { id: 'bordados', nombre: 'Diseños de Bordado' },
    { id: 'dtf', nombre: 'Transfers DTF' },
    { id: 'vinil', nombre: 'Corte de Vinil' },
    { id: 'combos', nombre: 'Paquetes y Combos' },
];

export default function NuevoProductoPage() {
    const [producto, setProducto] = useState({
        sku: '',
        nombre: '',
        descripcion: '',
        precio: '',
        precioComparar: '',
        stock: '100',
        categoria: '',
        peso: '',
        activo: true,
        destacado: false,
    });

    const [imagenes, setImagenes] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Enviar a API
        alert('Producto guardado (demo)');
    };

    return (
        <div className="nuevo-producto">
            <div className="page-header">
                <div>
                    <Link href="/admin/productos" className="back-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        Volver a Productos
                    </Link>
                    <h1>Nuevo Producto</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="producto-form">
                <div className="form-grid">
                    {/* Columna Principal */}
                    <div className="main-col">
                        <div className="panel">
                            <h3>Información Básica</h3>
                            <div className="form-group">
                                <label>Nombre del Producto *</label>
                                <input
                                    type="text"
                                    value={producto.nombre}
                                    onChange={e => setProducto({ ...producto, nombre: e.target.value })}
                                    placeholder="Ej: Diseño de Rosa con Hojas"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    rows={4}
                                    value={producto.descripcion}
                                    onChange={e => setProducto({ ...producto, descripcion: e.target.value })}
                                    placeholder="Describe el producto, formatos incluidos, medidas, etc."
                                />
                            </div>
                        </div>

                        <div className="panel">
                            <h3>Imágenes</h3>
                            <div className="upload-area">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="M21 15l-5-5L5 21" />
                                </svg>
                                <p>Arrastra imágenes aquí o haz clic para subir</p>
                                <span>PNG, JPG hasta 5MB</span>
                                <input type="file" accept="image/*" multiple hidden />
                            </div>
                            {imagenes.length > 0 && (
                                <div className="imagenes-preview">
                                    {imagenes.map((img, i) => (
                                        <div key={i} className="imagen-thumb">
                                            <img src={img} alt="" />
                                            <button type="button" onClick={() => setImagenes(imagenes.filter((_, idx) => idx !== i))}>×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="panel">
                            <h3>Precios</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Precio *</label>
                                    <div className="input-prefix">
                                        <span>$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={producto.precio}
                                            onChange={e => setProducto({ ...producto, precio: e.target.value })}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Precio Comparar (tachado)</label>
                                    <div className="input-prefix">
                                        <span>$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={producto.precioComparar}
                                            onChange={e => setProducto({ ...producto, precioComparar: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Lateral */}
                    <div className="side-col">
                        <div className="panel">
                            <h3>Organización</h3>
                            <div className="form-group">
                                <label>SKU *</label>
                                <input
                                    type="text"
                                    value={producto.sku}
                                    onChange={e => setProducto({ ...producto, sku: e.target.value.toUpperCase() })}
                                    placeholder="BOR-001"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Categoría *</label>
                                <select
                                    value={producto.categoria}
                                    onChange={e => setProducto({ ...producto, categoria: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar...</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="panel">
                            <h3>Inventario</h3>
                            <div className="form-group">
                                <label>Stock Disponible</label>
                                <input
                                    type="number"
                                    value={producto.stock}
                                    onChange={e => setProducto({ ...producto, stock: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="panel">
                            <h3>Visibilidad</h3>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={producto.activo}
                                    onChange={e => setProducto({ ...producto, activo: e.target.checked })}
                                />
                                <span>Producto activo</span>
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={producto.destacado}
                                    onChange={e => setProducto({ ...producto, destacado: e.target.checked })}
                                />
                                <span>Mostrar en destacados</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <Link href="/admin/productos" className="btn-cancel">Cancelar</Link>
                    <button type="submit" className="btn-primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                        Guardar Producto
                    </button>
                </div>
            </form>

            <style jsx>{`
                .nuevo-producto { max-width: 1200px; }
                .page-header { margin-bottom: 2rem; }
                .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #64748b; text-decoration: none; font-size: 0.875rem; margin-bottom: 0.5rem; }
                .back-link:hover { color: #e94560; }
                .page-header h1 { font-size: 1.5rem; font-weight: 700; color: #1a1a2e; }
                .form-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
                .panel { background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 1.5rem; }
                .panel h3 { font-size: 0.95rem; font-weight: 600; color: #1a1a2e; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0; }
                .form-group { margin-bottom: 1.25rem; }
                .form-group:last-child { margin-bottom: 0; }
                .form-group label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem; }
                .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; transition: border-color 0.2s; }
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #e94560; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .input-prefix { position: relative; }
                .input-prefix span { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #64748b; }
                .input-prefix input { padding-left: 1.75rem; }
                .upload-area { border: 2px dashed #e2e8f0; border-radius: 12px; padding: 2.5rem; text-align: center; cursor: pointer; transition: all 0.2s; }
                .upload-area:hover { border-color: #e94560; background: #fef2f2; }
                .upload-area p { margin: 0.75rem 0 0.25rem; color: #374151; font-weight: 500; }
                .upload-area span { font-size: 0.8rem; color: #94a3b8; }
                .checkbox-label { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.5rem 0; }
                .checkbox-label input { width: 18px; height: 18px; accent-color: #e94560; }
                .checkbox-label span { font-size: 0.9rem; color: #374151; }
                .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; }
                .btn-cancel { padding: 0.875rem 1.5rem; background: #f1f5f9; color: #64748b; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; text-decoration: none; }
                .btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1.75rem; background: linear-gradient(135deg, #e94560, #ff6b6b); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(233, 69, 96, 0.3); }
                @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
