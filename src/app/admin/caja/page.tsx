'use client';

// ============================================
// ADMIN - CAJA
// ============================================

import { useState, useMemo } from 'react';
import CashCloseModal, { CierreData } from './components/CashCloseModal';
import CashMovementModal, { MovementData } from './components/CashMovementModal';

const SALDO_INICIAL = 5000; // Saldo inicial de caja

interface Movimiento {
    id: string;
    tipo: 'VENTA' | 'EGRESO' | 'INGRESO' | 'RETIRO';
    concepto: string;
    monto: number;
    fecha: string;
    metodoPago: string;
}

const movimientosIniciales: Movimiento[] = [
    { id: '1', tipo: 'EGRESO', concepto: 'PAGO COCACOLA', monto: -12000, fecha: '19/01/2026, 07:17 p.m.', metodoPago: 'Transferencia' },
    { id: '2', tipo: 'VENTA', concepto: 'Venta 00000F', monto: 3800, fecha: '19/01/2026, 07:16 p.m.', metodoPago: 'Tarjeta' },
    { id: '3', tipo: 'VENTA', concepto: 'Venta 00000E', monto: 130600, fecha: '19/01/2026, 07:12 p.m.', metodoPago: 'Transferencia' },
    { id: '4', tipo: 'VENTA', concepto: 'Venta 00000D', monto: 1900, fecha: '19/01/2026, 07:11 p.m.', metodoPago: 'Efectivo' },
];

export default function CajaPage() {
    const [cajaAbierta, setCajaAbierta] = useState(true);
    const [movimientos, setMovimientos] = useState<Movimiento[]>(movimientosIniciales);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [showCierreModal, setShowCierreModal] = useState(false);
    const [showRetiroModal, setShowRetiroModal] = useState(false);
    const [showIngresoModal, setShowIngresoModal] = useState(false);
    const [selectedMovimiento, setSelectedMovimiento] = useState<Movimiento | null>(null);


    // Calculate values dynamically from transactions
    const { totalEfectivo, ingresos, egresos, pagoEfectivo, pagoTarjeta, pagoTransferencia } = useMemo(() => {
        let ingresosCalc = 0;
        let egresosCalc = 0;
        let pagoEfectivoCalc = 0;
        let pagoTarjetaCalc = 0;
        let pagoTransferenciaCalc = 0;

        movimientos.forEach((mov: Movimiento) => {
            if (mov.monto > 0) {
                ingresosCalc += mov.monto;
                if (mov.metodoPago === 'Efectivo') pagoEfectivoCalc += mov.monto;
                if (mov.metodoPago === 'Tarjeta') pagoTarjetaCalc += mov.monto;
                if (mov.metodoPago === 'Transferencia') pagoTransferenciaCalc += mov.monto;
            } else {
                egresosCalc += Math.abs(mov.monto);
            }
        });

        const totalEfectivoCalc = SALDO_INICIAL + ingresosCalc - egresosCalc;

        return {
            totalEfectivo: totalEfectivoCalc,
            ingresos: ingresosCalc,
            egresos: egresosCalc,
            pagoEfectivo: pagoEfectivoCalc,
            pagoTarjeta: pagoTarjetaCalc,
            pagoTransferencia: pagoTransferenciaCalc
        };
    }, [movimientos]);

    // Handle cash close
    const handleCierreCaja = (data: CierreData) => {
        console.log('Cierre de caja:', data);
        setCajaAbierta(false);
        setShowCierreModal(false);
        // Here you would save the close data
    };

    // Handle cash movements (retiros/ingresos)
    const handleMovimiento = (data: MovementData) => {
        const newMovimiento: Movimiento = {
            id: Date.now().toString(),
            tipo: data.tipo === 'retiro' ? 'RETIRO' : 'INGRESO',
            concepto: data.concepto,
            monto: data.tipo === 'retiro' ? -data.monto : data.monto,
            fecha: new Date().toLocaleString('es-MX'),
            metodoPago: data.metodoPago
        };
        setMovimientos([newMovimiento, ...movimientos]);
        setShowRetiroModal(false);
        setShowIngresoModal(false);
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div className="caja-page">
                <div className="page-header">
                    <div>
                        <h1 style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#1f2937'
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                            Caja
                        </h1>
                        <p className="subtitle" style={{ color: '#6b7280' }}>
                            {cajaAbierta ? 'Abierta: ' + new Date().toLocaleDateString('es-MX') : 'Cerrada'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {cajaAbierta && (
                            <>
                                <button
                                    onClick={() => setShowIngresoModal(true)}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        background: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="19" x2="12" y2="5" />
                                        <polyline points="5 12 12 5 19 12" />
                                    </svg>
                                    Ingreso
                                </button>
                                <button
                                    onClick={() => setShowRetiroModal(true)}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        background: '#f59e0b',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <polyline points="19 12 12 19 5 12" />
                                    </svg>
                                    Retiro
                                </button>
                                <button
                                    onClick={() => setShowCierreModal(true)}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        background: '#dc2626',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                    Cerrar Caja
                                </button>
                            </>
                        )}
                        <div className="status-badge" style={{
                            background: cajaAbierta ? '#22c55e' : '#6b7280',
                            color: '#fff',
                            padding: '0.35rem 1rem',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}>
                            {cajaAbierta ? 'Abierta' : 'Cerrada'}
                        </div>
                    </div>
                </div>

                {/* Dashboard Cards */}
                <div className="dashboard-row">
                    {/* Main: Efectivo en Caja */}
                    <div className="card-blue">
                        <h3>Efectivo en Caja</h3>
                        <div className="amount">$ {totalEfectivo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                    </div>

                    {/* Methods breakdown */}
                    <div className="card-white methods">
                        <h3>Métodos de Pago</h3>
                        <div className="method-row"><span>Efectivo</span><span className="font-mono">$ {pagoEfectivo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                        <div className="method-row"><span>Tarjeta</span><span className="font-mono">$ {pagoTarjeta.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                        <div className="method-row"><span>Transferencia</span><span className="font-mono">$ {pagoTransferencia.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                    </div>

                    {/* Day Summary */}
                    <div className="card-white summary">
                        <h3>Total del Día</h3>
                        <div className="summary-row"><span>Inicial</span><span className="font-mono">$ {SALDO_INICIAL.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                        <div className="summary-row green"><span>+ Ingresos</span><span className="font-mono">$ {ingresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                        <div className="summary-row red"><span>- Egresos</span><span className="font-mono">$ {egresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
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
                                {movimientos.map((mov: Movimiento) => (
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
                                                onClick={() => { setSelectedMovimiento(mov); setShowDetalleModal(true); }}
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

            {/* Modal Detalle de Movimiento */}
            {showDetalleModal && selectedMovimiento && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        width: '90%',
                        maxWidth: '400px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Detalle del Movimiento</h3>
                            <button
                                onClick={() => { setShowDetalleModal(false); setSelectedMovimiento(null); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
                            >×</button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Tipo</label>
                                <span style={{
                                    display: 'inline-block',
                                    marginLeft: '0.5rem',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: selectedMovimiento.tipo === 'EGRESO' ? '#FEE2E2' : '#D1FAE5',
                                    color: selectedMovimiento.tipo === 'EGRESO' ? '#DC2626' : '#059669'
                                }}>{selectedMovimiento.tipo}</span>
                            </div>

                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Concepto</label>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>{selectedMovimiento.concepto}</p>
                            </div>

                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Monto</label>
                                <p style={{
                                    margin: 0,
                                    fontWeight: 700,
                                    fontSize: '1.5rem',
                                    fontFamily: 'monospace',
                                    color: selectedMovimiento.tipo === 'EGRESO' ? '#DC2626' : '#059669'
                                }}>
                                    {selectedMovimiento.tipo === 'EGRESO' ? '-' : '+'} ${Math.abs(selectedMovimiento.monto).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <label style={{ color: '#64748b', fontSize: '0.875rem' }}>Fecha</label>
                                <p style={{ margin: 0, fontWeight: 500 }}>{selectedMovimiento.fecha}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => { setShowDetalleModal(false); setSelectedMovimiento(null); }}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    background: '#F1F5F9',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Cierre de Caja */}
            <CashCloseModal
                isOpen={showCierreModal}
                onClose={() => setShowCierreModal(false)}
                onConfirm={handleCierreCaja}
                cajaData={{
                    saldoInicial: SALDO_INICIAL,
                    ingresos,
                    egresos,
                    efectivoEsperado: totalEfectivo,
                    ventasEfectivo: pagoEfectivo,
                    ventasTarjeta: pagoTarjeta,
                    ventasTransferencia: pagoTransferencia
                }}
            />

            {/* Modal Retiro */}
            <CashMovementModal
                isOpen={showRetiroModal}
                onClose={() => setShowRetiroModal(false)}
                onConfirm={handleMovimiento}
                type="retiro"
            />

            {/* Modal Ingreso */}
            <CashMovementModal
                isOpen={showIngresoModal}
                onClose={() => setShowIngresoModal(false)}
                onConfirm={handleMovimiento}
                type="ingreso"
            />
        </div>
    );
}
