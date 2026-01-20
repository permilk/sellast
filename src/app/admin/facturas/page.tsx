'use client';

// ============================================
// ADMIN - GESTIÓN DE FACTURAS
// ============================================

import { useState } from 'react';

const facturas = [
    { id: '1', numero: 'A-000045', pedido: 'ORD-2026-00045', rfc: 'GARM850101ABC', razonSocial: 'MARÍA GARCÍA', total: 2450, status: 'stamped', fecha: '2026-01-20' },
    { id: '2', numero: 'A-000044', pedido: 'ORD-2026-00043', rfc: 'MAAN900215XYZ', razonSocial: 'ANA MARTÍNEZ NÚÑEZ', total: 3200, status: 'stamped', fecha: '2026-01-19' },
    { id: '3', numero: 'A-000043', pedido: 'ORD-2026-00041', rfc: 'DIAL850101ABC', razonSocial: 'LAURA DÍAZ ALMONTE', total: 1650, status: 'pending', fecha: '2026-01-19' },
    { id: '4', numero: 'A-000042', pedido: 'ORD-2026-00038', rfc: 'EMPRESA SA DE CV', razonSocial: 'EMPRESA COMERCIAL', total: 8500, status: 'stamped', fecha: '2026-01-18' },
];

const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: '#f59e0b' },
    stamped: { label: 'Timbrada', color: '#10b981' },
    cancelled: { label: 'Cancelada', color: '#ef4444' },
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default function FacturasPage() {
    const [busqueda, setBusqueda] = useState('');

    const facturasFiltradas = facturas.filter(f =>
        f.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
        f.rfc.toLowerCase().includes(busqueda.toLowerCase()) ||
        f.razonSocial.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="facturas-page">
            <div className="page-header">
                <div>
                    <h1>Facturas</h1>
                    <p>Gestión de facturas CFDI emitidas</p>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-mini"><span className="stat-value">{facturas.length}</span><span className="stat-label">Total</span></div>
                <div className="stat-mini"><span className="stat-value">{facturas.filter(f => f.status === 'stamped').length}</span><span className="stat-label">Timbradas</span></div>
                <div className="stat-mini"><span className="stat-value">{facturas.filter(f => f.status === 'pending').length}</span><span className="stat-label">Pendientes</span></div>
            </div>

            <div className="filters-bar">
                <input
                    type="search"
                    placeholder="Buscar por folio, RFC o razón social..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Folio</th>
                            <th>Pedido</th>
                            <th>RFC</th>
                            <th>Razón Social</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturasFiltradas.map((factura) => (
                            <tr key={factura.id}>
                                <td className="cell-id">{factura.numero}</td>
                                <td>{factura.pedido}</td>
                                <td className="cell-rfc">{factura.rfc}</td>
                                <td>{factura.razonSocial}</td>
                                <td className="cell-total">{formatCurrency(factura.total)}</td>
                                <td>
                                    <span className="status-badge" style={{ background: `${statusLabels[factura.status].color}20`, color: statusLabels[factura.status].color }}>
                                        {statusLabels[factura.status].label}
                                    </span>
                                </td>
                                <td>{factura.fecha}</td>
                                <td>
                                    <div className="actions">
                                        <button className="action-btn" title="Descargar XML">📄</button>
                                        <button className="action-btn" title="Descargar PDF">📑</button>
                                        <button className="action-btn" title="Reenviar">📧</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .facturas-page { max-width: 1400px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
                .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.25rem; }
                .page-header p { color: #64748b; }
                .stats-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
                .stat-mini { background: #fff; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; }
                .stat-mini .stat-value { font-size: 1.5rem; font-weight: 700; color: #1a1a2e; }
                .stat-mini .stat-label { font-size: 0.75rem; color: #64748b; }
                .filters-bar { margin-bottom: 1.5rem; }
                .search-input { width: 100%; max-width: 400px; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; }
                .table-container { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
                .data-table th { background: #f8fafc; font-size: 0.75rem; text-transform: uppercase; color: #64748b; }
                .cell-id { font-family: monospace; font-weight: 600; color: #1a1a2e; }
                .cell-rfc { font-family: monospace; font-size: 0.85rem; }
                .cell-total { font-family: monospace; font-weight: 600; }
                .status-badge { padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
                .actions { display: flex; gap: 0.5rem; }
                .action-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #f1f5f9; border: none; border-radius: 6px; cursor: pointer; }
                .action-btn:hover { background: #e94560; }
            `}</style>
        </div>
    );
}
