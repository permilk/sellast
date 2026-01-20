'use client';

// ============================================
// ADMIN - GESTIÓN DE CLIENTES
// ============================================

import { useState } from 'react';

const clientes = [
    { id: '1', nombre: 'María García', email: 'maria@email.com', telefono: '55 1234 5678', pedidos: 5, totalGastado: 12500, fechaRegistro: '2026-01-15' },
    { id: '2', nombre: 'Carlos López', email: 'carlos@email.com', telefono: '55 2345 6789', pedidos: 3, totalGastado: 8900, fechaRegistro: '2026-01-10' },
    { id: '3', nombre: 'Ana Martínez', email: 'ana@email.com', telefono: '55 3456 7890', pedidos: 8, totalGastado: 25600, fechaRegistro: '2025-12-20' },
    { id: '4', nombre: 'Pedro Sánchez', email: 'pedro@email.com', telefono: '55 4567 8901', pedidos: 2, totalGastado: 3200, fechaRegistro: '2026-01-18' },
    { id: '5', nombre: 'Laura Díaz', email: 'laura@empresa.com', rfc: 'DIAL850101ABC', pedidos: 12, totalGastado: 45000, fechaRegistro: '2025-11-05' },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default function ClientesPage() {
    const [busqueda, setBusqueda] = useState('');

    const clientesFiltrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="clientes-page">
            <div className="page-header">
                <div>
                    <h1>Clientes</h1>
                    <p>Base de datos de clientes registrados</p>
                </div>
                <button className="btn-export">📥 Exportar CSV</button>
            </div>

            <div className="filters-bar">
                <input
                    type="search"
                    placeholder="Buscar por nombre o email..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Teléfono</th>
                            <th>RFC</th>
                            <th>Pedidos</th>
                            <th>Total Gastado</th>
                            <th>Registro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientesFiltrados.map((cliente) => (
                            <tr key={cliente.id}>
                                <td>
                                    <div className="cell-cliente">
                                        <span className="cliente-nombre">{cliente.nombre}</span>
                                        <span className="cliente-email">{cliente.email}</span>
                                    </div>
                                </td>
                                <td>{cliente.telefono}</td>
                                <td>{cliente.rfc || '—'}</td>
                                <td className="cell-center">{cliente.pedidos}</td>
                                <td className="cell-total">{formatCurrency(cliente.totalGastado)}</td>
                                <td>{cliente.fechaRegistro}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .clientes-page { max-width: 1400px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.25rem; }
                .page-header p { color: #64748b; }
                .btn-export { padding: 0.75rem 1.5rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; }
                .filters-bar { margin-bottom: 1.5rem; }
                .search-input { width: 100%; max-width: 400px; padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; }
                .search-input:focus { outline: none; border-color: #e94560; }
                .table-container { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
                .data-table th { background: #f8fafc; font-size: 0.75rem; text-transform: uppercase; color: #64748b; }
                .cell-cliente { display: flex; flex-direction: column; }
                .cliente-nombre { font-weight: 500; color: #1a1a2e; }
                .cliente-email { font-size: 0.8rem; color: #64748b; }
                .cell-center { text-align: center; }
                .cell-total { font-family: monospace; font-weight: 600; }
            `}</style>
        </div>
    );
}
