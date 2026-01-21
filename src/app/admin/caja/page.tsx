'use client';

// ============================================
// ADMIN - CAJA
// ============================================

import { useState } from 'react';

const movimientosMock = [
    { id: '1', tipo: 'EGRESO', concepto: 'PAGO COCACOLA', monto: -12000, fecha: '19/01/2026, 07:17 p.m.' },
    { id: '2', tipo: 'VENTA', concepto: 'Venta 00000F', monto: 3800, fecha: '19/01/2026, 07:16 p.m.' },
    { id: '3', tipo: 'VENTA', concepto: 'Venta 00000E', monto: 130600, fecha: '19/01/2026, 07:12 p.m.' },
    { id: '4', tipo: 'VENTA', concepto: 'Venta 00000D', monto: 1900, fecha: '19/01/2026, 07:11 p.m.' },
];

export default function CajaPage() {
    const [cajaAbierta] = useState(true);

    return (
        <div className="caja-page">
            <div className="page-header">
                <div>
                    <h1>Caja</h1>
                    <p className="subtitle">Abierta: 17/01/2026, 12:25 p.m.</p>
                </div>
                <div className="status-badge">Abierta</div>
            </div>

            {/* Dashboard Cards */}
            <div className="dashboard-row">
                {/* Main: Efectivo en Caja */}
                <div className="card-blue">
                    <h3>Efectivo en Caja</h3>
                    <div className="amount">$ 79,900.00</div>
                </div>

                {/* Methods breakdown */}
                <div className="card-white methods">
                    <h3>Métodos de Pago</h3>
                    <div className="method-row"><span>Efectivo</span><span className="font-mono">$ 1,900.00</span></div>
                    <div className="method-row"><span>Tarjeta</span><span className="font-mono">$ 3,800.00</span></div>
                    <div className="method-row"><span>Transferencia</span><span className="font-mono">$ 130,600.00</span></div>
                </div>

                {/* Day Summary */}
                <div className="card-white summary">
                    <h3>Total del Día</h3>
                    <div className="summary-row"><span>Inicial</span><span className="font-mono">$ 90,000.00</span></div>
                    <div className="summary-row green"><span>+ Ingresos</span><span className="font-mono">$ 0,00</span></div>
                    <div className="summary-row red"><span>- Egresos</span><span className="font-mono">$ 12,000.00</span></div>
                </div>
            </div>

            {/* Movements Table */}
            <div className="movements-panel">
                <h3>Ventas y Movimientos</h3>
                <div className="table-responsive">
                    <table className="caja-table">
                        <thead>
                            <tr>
                                <th>TIPO</th>
                                <th>CONCEPTO</th>
                                <th>MONTO</th>
                                <th>FECHA</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientosMock.map(mov => (
                                <tr key={mov.id}>
                                    <td>
                                        <span className={`badge ${mov.tipo === 'EGRESO' ? 'red' : 'green'}`}>
                                            {mov.tipo === 'EGRESO' ? 'Egreso' : 'Venta'}
                                        </span>
                                    </td>
                                    <td>{mov.concepto}</td>
                                    <td className={`amount-cell ${mov.tipo === 'EGRESO' ? 'color-red' : 'color-green'}`}>
                                        {mov.tipo === 'EGRESO' ? '' : '+ '}${Math.abs(mov.monto).toLocaleString()}
                                    </td>
                                    <td>{mov.fecha}</td>
                                    <td>
                                        <button
                                            className="btn-view"
                                            onClick={() => alert(`Ver detalle: ${mov.concepto}`)}
                                            style={{
                                                padding: '0.5rem 0.75rem',
                                                background: '#CFFAFE',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: '#06B6D4',
                                                fontWeight: 600,
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination">
                    <span>Filas por página: 10</span>
                    <span>1-4 de 4</span>
                </div>
            </div>

            <style jsx>{`
                .caja-page { max-width: 100%; }
                
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .page-header h1 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; }
                .subtitle { color: #64748b; font-size: 0.9rem; }
                .status-badge { background: #22c55e; color: #fff; padding: 0.35rem 1rem; border-radius: 6px; font-weight: 600; font-size: 0.9rem; }

                .dashboard-row { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 1.5rem; margin-bottom: 2.5rem; }
                
                .card-blue { background: #2563eb; color: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); display: flex; flex-direction: column; justify-content: center; min-height: 140px; }
                .card-blue h3 { font-size: 1rem; opacity: 0.9; margin-bottom: 0.5rem; font-weight: 500; }
                .card-blue .amount { font-size: 2.5rem; font-weight: 700; }

                .card-white { background: #fff; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: center; min-height: 140px; }
                .card-white h3 { font-size: 0.9rem; color: #64748b; margin-bottom: 1rem; font-weight: 600; text-transform: uppercase; }
                
                .method-row, .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.95rem; color: #1e293b; }
                .font-mono { font-family: monospace; font-weight: 600; }
                
                .summary-row.green { color: #16a34a; }
                .summary-row.red { color: #dc2626; }

                .movements-panel { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 1.5rem; }
                .movements-panel h3 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; }

                .caja-table { width: 100%; border-collapse: separate; border-spacing: 0 0.5rem; }
                .caja-table th { text-align: left; font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; padding: 0 1rem 0.5rem 1rem; }
                .caja-table td { background: #fff; padding: 1rem; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #334155; }
                .caja-table tr:hover td { background: #f8fafc; }

                .badge { padding: 0.25rem 0.75rem; border-radius: 4px; color: #fff; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
                .badge.red { background: #ef4444; }
                .badge.green { background: #22c55e; }

                .amount-cell { font-family: monospace; font-weight: 600; }
                .color-red { color: #ef4444; }
                .color-green { color: #22c55e; }

                .btn-view { display: flex; align-items: center; gap: 0.5rem; border: none; background: none; color: #2563eb; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
                .btn-view:hover { text-decoration: underline; }

                .pagination { display: flex; justify-content: flex-end; gap: 2rem; margin-top: 1.5rem; color: #64748b; font-size: 0.85rem; }

                @media (max-width: 1024px) {
                    .dashboard-row { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
