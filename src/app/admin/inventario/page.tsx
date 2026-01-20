'use client';

// ============================================
// ADMIN - INVENTARIO
// ============================================

import { useState } from 'react';

const inventario = [
    { id: '1', sku: 'PROD-001', nombre: 'Bolso Premium Leather', stock: 15, minimo: 5, status: 'ok' },
    { id: '2', sku: 'PROD-002', nombre: 'Reloj Clásico Dorado', stock: 8, minimo: 5, status: 'ok' },
    { id: '3', sku: 'PROD-003', nombre: 'Zapatillas Urban Style', stock: 3, minimo: 5, status: 'bajo' },
    { id: '4', sku: 'PROD-004', nombre: 'Lentes de Sol Aviator', stock: 25, minimo: 10, status: 'ok' },
    { id: '5', sku: 'PROD-005', nombre: 'Cartera Ejecutiva', stock: 0, minimo: 5, status: 'agotado' },
];

const movimientos = [
    { id: '1', tipo: 'SALE_WEB', producto: 'Bolso Premium Leather', cantidad: -2, fecha: '2026-01-20 14:30' },
    { id: '2', tipo: 'RESTOCK', producto: 'Reloj Clásico Dorado', cantidad: +10, fecha: '2026-01-20 10:15' },
    { id: '3', tipo: 'SALE_WEB', producto: 'Zapatillas Urban Style', cantidad: -1, fecha: '2026-01-19 18:45' },
    { id: '4', tipo: 'ADJUSTMENT', producto: 'Cartera Ejecutiva', cantidad: -5, fecha: '2026-01-19 09:00' },
];

const statusLabels: Record<string, { label: string; color: string }> = {
    ok: { label: 'OK', color: '#10b981' },
    bajo: { label: 'Stock Bajo', color: '#f59e0b' },
    agotado: { label: 'Agotado', color: '#ef4444' },
};

export default function InventarioPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="inventario-page">
            <div className="page-header">
                <div>
                    <h1>Inventario</h1>
                    <p>Control de stock y movimientos</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>➕ Ajustar Stock</button>
            </div>

            <div className="stats-row">
                <div className="stat-mini ok"><span>✅</span><span>{inventario.filter(p => p.status === 'ok').length} OK</span></div>
                <div className="stat-mini bajo"><span>⚠️</span><span>{inventario.filter(p => p.status === 'bajo').length} Stock Bajo</span></div>
                <div className="stat-mini agotado"><span>❌</span><span>{inventario.filter(p => p.status === 'agotado').length} Agotados</span></div>
            </div>

            <div className="content-grid">
                {/* Stock Actual */}
                <div className="panel">
                    <h3>Stock Actual</h3>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr><th>SKU</th><th>Producto</th><th>Stock</th><th>Mínimo</th><th>Estado</th></tr>
                            </thead>
                            <tbody>
                                {inventario.map(p => (
                                    <tr key={p.id}>
                                        <td className="cell-id">{p.sku}</td>
                                        <td>{p.nombre}</td>
                                        <td className="cell-center">{p.stock}</td>
                                        <td className="cell-center">{p.minimo}</td>
                                        <td><span className="status-badge" style={{ background: `${statusLabels[p.status].color}20`, color: statusLabels[p.status].color }}>{statusLabels[p.status].label}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Últimos Movimientos */}
                <div className="panel">
                    <h3>Últimos Movimientos</h3>
                    <div className="movimientos-list">
                        {movimientos.map(m => (
                            <div key={m.id} className="movimiento-item">
                                <span className={`mov-cantidad ${m.cantidad > 0 ? 'positivo' : 'negativo'}`}>
                                    {m.cantidad > 0 ? '+' : ''}{m.cantidad}
                                </span>
                                <div className="mov-info">
                                    <span className="mov-producto">{m.producto}</span>
                                    <span className="mov-fecha">{m.fecha}</span>
                                </div>
                                <span className="mov-tipo">{m.tipo}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Ajustar Stock</h2>
                        <div className="form-group">
                            <label>Producto</label>
                            <select><option>Seleccionar producto...</option>{inventario.map(p => <option key={p.id}>{p.nombre}</option>)}</select>
                        </div>
                        <div className="form-group">
                            <label>Cantidad (+/-)</label>
                            <input type="number" placeholder="Ej: +10 o -5" />
                        </div>
                        <div className="form-group">
                            <label>Motivo</label>
                            <select><option>Reabastecimiento</option><option>Ajuste manual</option><option>Devolución</option><option>Producto dañado</option></select>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn-primary">Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .inventario-page { max-width: 1400px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
                .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1a1a2e; }
                .page-header p { color: #64748b; }
                .btn-primary { padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #e94560, #ff6b6b); color: #fff; border: none; border-radius: 8px; cursor: pointer; }
                .stats-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
                .stat-mini { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
                .panel { background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem; }
                .panel h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; }
                .table-container { overflow-x: auto; }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table th, .data-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
                .data-table th { font-size: 0.7rem; text-transform: uppercase; color: #64748b; }
                .cell-id { font-family: monospace; font-size: 0.8rem; }
                .cell-center { text-align: center; }
                .status-badge { padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.7rem; font-weight: 600; }
                .movimientos-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .movimiento-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 8px; }
                .mov-cantidad { font-family: monospace; font-weight: 700; width: 50px; }
                .mov-cantidad.positivo { color: #10b981; }
                .mov-cantidad.negativo { color: #ef4444; }
                .mov-info { flex: 1; display: flex; flex-direction: column; }
                .mov-producto { font-weight: 500; font-size: 0.9rem; }
                .mov-fecha { font-size: 0.75rem; color: #64748b; }
                .mov-tipo { font-size: 0.7rem; color: #64748b; background: #e2e8f0; padding: 0.25rem 0.5rem; border-radius: 4px; }
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal { background: #fff; border-radius: 12px; padding: 1.5rem; width: 400px; }
                .modal h2 { margin-bottom: 1.5rem; }
                .form-group { margin-bottom: 1rem; }
                .form-group label { display: block; font-size: 0.875rem; margin-bottom: 0.5rem; }
                .form-group input, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; }
                .modal-footer { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
                .btn-secondary { padding: 0.75rem 1.5rem; background: #f1f5f9; border: none; border-radius: 8px; cursor: pointer; }
            `}</style>
        </div>
    );
}
