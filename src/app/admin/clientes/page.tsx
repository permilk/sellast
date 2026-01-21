'use client';

// ============================================
// ADMIN - CLIENTES
// ============================================

const clientesMock = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@gmail.com', telefono: '55 1234 5678', compras: 12, ultimaCompra: '19/01/2026', total: 15400 },
    { id: 2, nombre: 'María García', email: 'maria@outlook.com', telefono: '55 8765 4321', compras: 5, ultimaCompra: '15/01/2026', total: 4200 },
    { id: 3, nombre: 'Cliente Mostrador', email: '-', telefono: '-', compras: 154, ultimaCompra: 'Hoy', total: 89000 },
];

export default function ClientesPage() {
    return (
        <div className="clientes-page">
            <div className="page-header">
                <div className="title-section">
                    <h1>Clientes</h1>
                    <p>Base de datos de compradores</p>
                </div>
                <button className="btn-primary">Nuevo Cliente</button>
            </div>

            <div className="table-wrapper">
                <table className="clients-table">
                    <thead>
                        <tr>
                            <th>CLIENTE</th>
                            <th>CONTACTO</th>
                            <th>TOTAL COMPRAS</th>
                            <th>ÚLTIMA VEZ</th>
                            <th>TOTALGASTADO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientesMock.map(cli => (
                            <tr key={cli.id}>
                                <td>
                                    <div className="client-cell">
                                        <div className="avatar">{cli.nombre.charAt(0)}</div>
                                        <div className="info">
                                            <span className="name">{cli.nombre}</span>
                                            <span className="id">ID: #{cli.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-info">
                                        <div>{cli.email}</div>
                                        <div className="phone">{cli.telefono}</div>
                                    </div>
                                </td>
                                <td><span className="badge-gray">{cli.compras} Pedidos</span></td>
                                <td>{cli.ultimaCompra}</td>
                                <td className="font-bold">${cli.total.toLocaleString()}</td>
                                <td>
                                    <button className="btn-icon">⋮</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .btn-primary { background: #2563eb; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; border:none; font-weight: 600; cursor: pointer; }
                .page-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
                .title-section h1 { font-size: 1.8rem; margin-bottom: 0.25rem; font-weight: 700; color: #1e293b; }
                .title-section p { color: #64748b; }
                
                .table-wrapper { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
                .clients-table { width: 100%; border-collapse: collapse; }
                .clients-table th { text-align: left; padding: 1rem 1.5rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase; }
                .clients-table td { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
                
                .client-cell { display: flex; align-items: center; gap: 0.75rem; }
                .avatar { width: 40px; height: 40px; background: #bfdbfe; color: #1e40af; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
                .info { display: flex; flex-direction: column; }
                .name { font-weight: 600; color: #1e293b; }
                .id { font-size: 0.75rem; color: #94a3b8; }
                
                .contact-info { font-size: 0.9rem; }
                .phone { color: #64748b; font-size: 0.85rem; }
                .badge-gray { background: #f1f5f9; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; }
                .font-bold { font-weight: 700; color: #166534; }
                .btn-icon { background: none; border: none; font-size: 1.25rem; color: #94a3b8; cursor: pointer; }
            `}</style>
        </div>
    );
}
