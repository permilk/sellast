'use client';

// ============================================
// ADMIN - DETALLE DE PEDIDO CON TRACKING
// ============================================

import Link from 'next/link';
import { use, useState } from 'react';

interface PageProps {
    params: Promise<{ id: string }>;
}

const pedidoData = {
    id: 'ORD-2026-00045',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    fecha: '2026-01-20 14:30',
    cliente: { nombre: 'María García', email: 'maria@email.com', telefono: '55 1234 5678' },
    direccion: { calle: 'Av. Insurgentes Sur 1234', colonia: 'Del Valle', ciudad: 'CDMX', cp: '03100' },
    items: [
        { nombre: 'Rosa Elegante - Bordado', sku: 'BOR-001', precio: 89, cantidad: 2, subtotal: 178 },
        { nombre: 'Mariposa Monarca - DTF', sku: 'DTF-001', precio: 65, cantidad: 1, subtotal: 65 },
    ],
    subtotal: 243,
    envio: 0,
    total: 243,
    tracking: {
        proveedor: '',
        numero: '',
        url: ''
    }
};

const statusOptions = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function PedidoDetallePage({ params }: PageProps) {
    const { id } = use(params);
    const [tracking, setTracking] = useState(pedidoData.tracking);
    const [status, setStatus] = useState(pedidoData.status);

    return (
        <div className="pedido-detalle">
            <div className="page-header">
                <div>
                    <Link href="/admin/pedidos" className="back-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                        Volver a Pedidos
                    </Link>
                    <h1>Pedido {id}</h1>
                    <span className="fecha">{pedidoData.fecha}</span>
                </div>
                <div className="header-actions">
                    <select className="status-select" value={status} onChange={e => setStatus(e.target.value)}>
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="btn-primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                        Guardar
                    </button>
                </div>
            </div>

            <div className="content-grid">
                <div className="main-col">
                    {/* Productos */}
                    <div className="panel">
                        <h3>Productos</h3>
                        <table className="items-table">
                            <thead><tr><th>Producto</th><th>Cant.</th><th>Total</th></tr></thead>
                            <tbody>
                                {pedidoData.items.map((item, i) => (
                                    <tr key={i}>
                                        <td><div className="item-info"><span className="item-name">{item.nombre}</span><span className="item-sku">{item.sku}</span></div></td>
                                        <td>{item.cantidad}</td>
                                        <td className="cell-total">${item.subtotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="totales">
                            <div className="total-row"><span>Total</span><span>${pedidoData.total}</span></div>
                        </div>
                    </div>

                    {/* TRACKING - NUEVA SECCIÓN */}
                    <div className="panel tracking-panel">
                        <div className="panel-header">
                            <h3>🚚 Despacho y Envío</h3>
                            <span className="badge-info">Requerido para el cliente</span>
                        </div>
                        <div className="form-grid-3">
                            <div className="form-group">
                                <label>Paquetería</label>
                                <div className="input-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                    <input
                                        type="text"
                                        placeholder="Ej: FedEx, DHL, Estafeta"
                                        value={tracking.proveedor}
                                        onChange={e => setTracking({ ...tracking, proveedor: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Número de Rastreo</label>
                                <div className="input-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                    <input
                                        type="text"
                                        placeholder="Ej: 1234567890"
                                        value={tracking.numero}
                                        onChange={e => setTracking({ ...tracking, numero: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>URL de Seguimiento</label>
                                <div className="input-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        value={tracking.url}
                                        onChange={e => setTracking({ ...tracking, url: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="tracking-actions">
                            <button className="btn-secondary">Enviar Notificación al Cliente</button>
                        </div>
                    </div>
                </div>

                <div className="side-col">
                    <div className="panel">
                        <h3>Cliente</h3>
                        <div className="customer-info">
                            <div className="avatar">{pedidoData.cliente.nombre.charAt(0)}</div>
                            <div>
                                <p className="info-name">{pedidoData.cliente.nombre}</p>
                                <p className="info-detail">{pedidoData.cliente.email}</p>
                            </div>
                        </div>
                        <div className="contact-actions">
                            <button title="Enviar Email">✉️</button>
                            <button title="Llamar">📞</button>
                            <button title="WhatsApp">💬</button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .pedido-detalle { max-width: 1200px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #64748b; text-decoration: none; margin-bottom: 0.5rem; }
                .btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #e94560; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
                .status-select { padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; }

                .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
                .panel { background: #fff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 1.5rem; }
                .panel h3 { font-size: 1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 1rem; }
                
                .items-table { width: 100%; border-collapse: collapse; }
                .items-table th, .items-table td { text-align: left; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
                .item-name { font-weight: 500; display: block; }
                .item-sku { font-size: 0.75rem; color: #94a3b8; font-family: monospace; }
                .cell-total { font-weight: 700; text-align: right; }
                .total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; margin-top: 1rem; }

                /* TRACKING STYLES */
                .tracking-panel { border-left: 4px solid #3b82f6; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
                .badge-info { background: #eff6ff; color: #3b82f6; font-size: 0.7rem; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 600; }
                .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
                .form-group label { display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem; }
                .input-icon { position: relative; }
                .input-icon svg { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); }
                .input-icon input { width: 100%; padding: 0.75rem 0.75rem 0.75rem 2.25rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; }
                .tracking-actions { margin-top: 1.25rem; border-top: 1px solid #f1f5f9; padding-top: 1rem; text-align: right; }
                .btn-secondary { background: #f1f5f9; color: #334155; border: none; padding: 0.6rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 500; }
                .btn-secondary:hover { background: #e2e8f0; }

                .customer-info { display: flex; gap: 1rem; align-items: center; }
                .avatar { width: 40px; height: 40px; background: #e9eaec; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #64748b; }
                .contact-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
                .contact-actions button { flex: 1; padding: 0.5rem; border: 1px solid #e2e8f0; background: #fff; border-radius: 6px; cursor: pointer; }
                .contact-actions button:hover { background: #f8fafc; border-color: #cbd5e1; }
            `}</style>
        </div>
    );
}
