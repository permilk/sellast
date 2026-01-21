'use client';

// ============================================
// ADMIN - INVENTARIO
// ============================================

import { useState } from 'react';

// Datos actualizados para coincidir con Bordados/DTF/Vinil
const inventarioInicial = [
    { id: '1', sku: 'DTF-001', nombre: 'Mariposa Monarca - DTF', stock: 150, minimo: 20, status: 'ok' },
    { id: '2', sku: 'VIN-001', nombre: 'Lettering Script - Vinil', stock: 50, minimo: 10, status: 'ok' },
    { id: '3', sku: 'DTF-002', nombre: 'Tigre Realista - DTF', stock: 80, minimo: 15, status: 'ok' },
    { id: '4', sku: 'DTF-003', nombre: 'Flor Acuarela - DTF', stock: 5, minimo: 10, status: 'low' },
    { id: '5', sku: 'VIN-002', nombre: 'Corazón Geométrico - Vinil', stock: 0, minimo: 10, status: 'out' },
    // Los bordados son digitales, no suelen tener stock físico, pero lo incluimos por consistencia o venta de insumos
    { id: '6', sku: 'INS-001', nombre: 'Hilo Metálico Dorado', stock: 25, minimo: 5, status: 'ok' },
];

const movimientosIniciales = [
    { id: '1', tipo: 'SALE_WEB', producto: 'Mariposa Monarca - DTF', cantidad: -10, fecha: '2026-01-20 14:30' },
    { id: '2', tipo: 'RESTOCK', producto: 'Tigre Realista - DTF', cantidad: +50, fecha: '2026-01-20 10:15' },
    { id: '3', tipo: 'SALE_WEB', producto: 'Flor Acuarela - DTF', cantidad: -2, fecha: '2026-01-19 18:45' },
    { id: '4', tipo: 'ADJUSTMENT', producto: 'Corazón Geométrico - Vinil', cantidad: -1, fecha: '2026-01-19 09:20', motivo: 'Dañado' },
];

export default function InventarioPage() {
    const [inventario, setInventario] = useState(inventarioInicial);
    const [movimientos] = useState(movimientosIniciales);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="inventario-page">
            <div className="page-header">
                <div>
                    <h1>Inventario</h1>
                    <p>Control de stock y movimientos de insumos y productos físicos</p>
                </div>
                <button className="btn-primary" onClick={() => setModalOpen(true)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                    Ajustar Stock
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card ok">
                    <span className="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    </span>
                    <div className="stat-info">
                        <span className="value">{inventario.filter(i => i.status === 'ok').length}</span>
                        <span className="label">Stock OK</span>
                    </div>
                </div>
                <div className="stat-card low">
                    <span className="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    </span>
                    <div className="stat-info">
                        <span className="value">{inventario.filter(i => i.status === 'low').length}</span>
                        <span className="label">Stock Bajo</span>
                    </div>
                </div>
                <div className="stat-card out">
                    <span className="icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    </span>
                    <div className="stat-info">
                        <span className="value">{inventario.filter(i => i.status === 'out').length}</span>
                        <span className="label">Agotados</span>
                    </div>
                </div>
            </div>

            <div className="content-grid-inv">
                {/* Tabla Stock */}
                <div className="panel stock-panel">
                    <h3>Stock Actual</h3>
                    <table className="inv-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Producto</th>
                                <th>Stock</th>
                                <th>Mínimo</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventario.map(item => (
                                <tr key={item.id}>
                                    <td className="font-mono text-sm">{item.sku}</td>
                                    <td className="font-medium">{item.nombre}</td>
                                    <td className="font-bold">{item.stock}</td>
                                    <td className="text-gray-500">{item.minimo}</td>
                                    <td>
                                        <span className={`status-badge ${item.status}`}>
                                            {item.status === 'ok' ? 'OK' : item.status === 'low' ? 'Stock Bajo' : 'Agotado'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Movimientos */}
                <div className="panel history-panel">
                    <h3>Últimos Movimientos</h3>
                    <div className="timeline">
                        {movimientos.map(mov => (
                            <div key={mov.id} className="timeline-item">
                                <div className="tm-qty">
                                    <span className={mov.cantidad > 0 ? 'plus' : 'minus'}>
                                        {mov.cantidad > 0 ? `+${mov.cantidad}` : mov.cantidad}
                                    </span>
                                </div>
                                <div className="tm-content">
                                    <p className="tm-prod">{mov.producto}</p>
                                    <div className="tm-meta">
                                        <span className="tm-type">{mov.tipo}</span>
                                        <span className="tm-date">{mov.fecha}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal Simple (Visual) */}
            {modalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Ajustar Stock Manual</h2>
                        <div className="form-group">
                            <label>Producto / SKU</label>
                            <input type="text" placeholder="Buscar..." />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Cantidad</label>
                                <input type="number" />
                            </div>
                            <div className="form-group">
                                <label>Tipo</label>
                                <select><option>Entrada</option><option>Salida</option></select>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button className="btn-primary" onClick={() => { alert('Stock actualizado'); setModalOpen(false); }}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .inventario-page { max-width: 1400px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1a1a2e; }
                .page-header p { color: #64748b; }
                .btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #e94560; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }

                .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem; max-width: 800px; }
                .stat-card { background: #fff; padding: 1rem 1.5rem; border-radius: 12px; display: flex; align-items: center; gap: 1rem; border: 1px solid #e2e8f0; }
                .stat-card .icon { padding: 0.5rem; border-radius: 8px; display: flex; }
                .stat-card.ok .icon { background: #ecfdf5; color: #10b981; }
                .stat-card.low .icon { background: #fffbeb; color: #f59e0b; }
                .stat-card.out .icon { background: #fef2f2; color: #ef4444; }
                .stat-info { display: flex; flex-direction: column; }
                .stat-info .value { font-size: 1.5rem; font-weight: 700; color: #1a1a2e; line-height: 1; }
                .stat-info .label { font-size: 0.85rem; color: #64748b; }

                .content-grid-inv { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
                .panel { background: #fff; border-radius: 12px; padding: 1.5rem; border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .panel h3 { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 1.25rem; }

                .inv-table { width: 100%; border-collapse: collapse; }
                .inv-table th { text-align: left; font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9; }
                .inv-table td { padding: 1rem 0; border-bottom: 1px solid #f1f5f9; color: #334155; }
                .font-mono { font-family: monospace; }
                .font-bold { font-weight: 700; }
                .status-badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
                .status-badge.ok { background: #ecfdf5; color: #10b981; }
                .status-badge.low { background: #fffbeb; color: #f59e0b; }
                .status-badge.out { background: #fef2f2; color: #ef4444; }

                .timeline { display: flex; flex-direction: column; gap: 1rem; }
                .timeline-item { display: flex; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #f8fafc; }
                .tm-qty { font-weight: 700; font-size: 0.9rem; min-width: 40px; }
                .tm-qty .plus { color: #10b981; }
                .tm-qty .minus { color: #ef4444; }
                .tm-prod { font-size: 0.9rem; font-weight: 500; color: #1a1a2e; margin-bottom: 0.25rem; }
                .tm-meta { display: flex; gap: 0.5rem; font-size: 0.75rem; color: #94a3b8; }
                .tm-type { background: #f1f5f9; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 600; }

                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal-content { background: #fff; padding: 2rem; border-radius: 12px; width: 100%; max-width: 400px; }
                .form-group { margin-bottom: 1rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #64748b; }
                .form-group input, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
                .btn-cancel { background: none; border: none; color: #64748b; cursor: pointer; }
            `}</style>
        </div>
    );
}
