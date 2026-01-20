'use client';

// ============================================
// ADMIN - DETALLE DE PEDIDO
// ============================================

import Link from 'next/link';
import { use } from 'react';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Datos de ejemplo
const pedidoData = {
    id: 'ORD-2026-00045',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    fecha: '2026-01-20 14:30',
    cliente: { nombre: 'María García', email: 'maria@email.com', telefono: '55 1234 5678' },
    direccion: { calle: 'Av. Insurgentes Sur 1234', colonia: 'Del Valle', ciudad: 'CDMX', cp: '03100' },
    items: [
        { nombre: 'Bolso Premium Leather', sku: 'PROD-001', precio: 1299, cantidad: 1, subtotal: 1299 },
        { nombre: 'Lentes de Sol Aviator', sku: 'PROD-004', precio: 799, cantidad: 1, subtotal: 799 },
    ],
    subtotal: 2098,
    envio: 0,
    descuento: 0,
    total: 2098,
    factura: { solicitada: true, rfc: 'GARM850101ABC', razonSocial: 'MARÍA GARCÍA RAMÍREZ' },
};

const statusOptions = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pendiente', color: '#f59e0b' },
    CONFIRMED: { label: 'Confirmado', color: '#3b82f6' },
    PROCESSING: { label: 'Preparando', color: '#8b5cf6' },
    SHIPPED: { label: 'Enviado', color: '#06b6d4' },
    DELIVERED: { label: 'Entregado', color: '#10b981' },
    CANCELLED: { label: 'Cancelado', color: '#ef4444' },
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default function PedidoDetallePage({ params }: PageProps) {
    const { id } = use(params);

    return (
        <div className="pedido-detalle">
            <div className="page-header">
                <div>
                    <Link href="/admin/pedidos" className="back-link">← Volver a Pedidos</Link>
                    <h1>Pedido {id}</h1>
                    <span className="fecha">{pedidoData.fecha}</span>
                </div>
                <div className="header-actions">
                    <select className="status-select" defaultValue={pedidoData.status}>
                        {statusOptions.map(s => <option key={s} value={s}>{statusLabels[s].label}</option>)}
                    </select>
                    <button className="btn-primary">💾 Guardar</button>
                </div>
            </div>

            <div className="content-grid">
                {/* Columna Principal */}
                <div className="main-col">
                    {/* Items */}
                    <div className="panel">
                        <h3>Productos</h3>
                        <table className="items-table">
                            <thead><tr><th>Producto</th><th>Precio</th><th>Cant.</th><th>Subtotal</th></tr></thead>
                            <tbody>
                                {pedidoData.items.map((item, i) => (
                                    <tr key={i}>
                                        <td><div className="item-info"><span className="item-name">{item.nombre}</span><span className="item-sku">{item.sku}</span></div></td>
                                        <td>{formatCurrency(item.precio)}</td>
                                        <td>{item.cantidad}</td>
                                        <td className="cell-total">{formatCurrency(item.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="totales">
                            <div className="total-row"><span>Subtotal</span><span>{formatCurrency(pedidoData.subtotal)}</span></div>
                            <div className="total-row"><span>Envío</span><span>{pedidoData.envio === 0 ? 'Gratis' : formatCurrency(pedidoData.envio)}</span></div>
                            {pedidoData.descuento > 0 && <div className="total-row"><span>Descuento</span><span>-{formatCurrency(pedidoData.descuento)}</span></div>}
                            <div className="total-row total-final"><span>Total</span><span>{formatCurrency(pedidoData.total)}</span></div>
                        </div>
                    </div>

                    {/* Tracking */}
                    <div className="panel">
                        <h3>Envío</h3>
                        <div className="form-row">
                            <div className="form-group"><label>Número de Guía</label><input type="text" placeholder="Ej: 1234567890" /></div>
                            <div className="form-group"><label>URL de Rastreo</label><input type="url" placeholder="https://..." /></div>
                        </div>
                        <button className="btn-secondary">📧 Notificar Cliente</button>
                    </div>
                </div>

                {/* Columna Lateral */}
                <div className="side-col">
                    {/* Cliente */}
                    <div className="panel">
                        <h3>👤 Cliente</h3>
                        <p className="info-name">{pedidoData.cliente.nombre}</p>
                        <p className="info-detail">{pedidoData.cliente.email}</p>
                        <p className="info-detail">{pedidoData.cliente.telefono}</p>
                    </div>

                    {/* Dirección */}
                    <div className="panel">
                        <h3>📍 Dirección de Envío</h3>
                        <p className="info-detail">{pedidoData.direccion.calle}</p>
                        <p className="info-detail">{pedidoData.direccion.colonia}</p>
                        <p className="info-detail">{pedidoData.direccion.ciudad}, {pedidoData.direccion.cp}</p>
                    </div>

                    {/* Facturación */}
                    <div className="panel">
                        <h3>🧾 Facturación</h3>
                        {pedidoData.factura.solicitada ? (
                            <>
                                <p className="info-detail"><strong>RFC:</strong> {pedidoData.factura.rfc}</p>
                                <p className="info-detail">{pedidoData.factura.razonSocial}</p>
                                <button className="btn-factura">Generar Factura</button>
                            </>
                        ) : (
                            <p className="info-detail muted">No solicitó factura</p>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .pedido-detalle { max-width: 1200px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .back-link { color: #64748b; font-size: 0.875rem; text-decoration: none; display: block; margin-bottom: 0.5rem; }
                .back-link:hover { color: #e94560; }
                .page-header h1 { font-size: 1.5rem; font-weight: 700; color: #1a1a2e; }
                .fecha { font-size: 0.875rem; color: #64748b; }
                .header-actions { display: flex; gap: 1rem; align-items: center; }
                .status-select { padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; }
                .btn-primary { padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #e94560, #ff6b6b); color: #fff; border: none; border-radius: 8px; cursor: pointer; }
                .btn-secondary { padding: 0.6rem 1rem; background: #f1f5f9; border: none; border-radius: 6px; cursor: pointer; margin-top: 1rem; }
                .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
                .panel { background: #fff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 1.5rem; }
                .panel h3 { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: #1a1a2e; }
                .items-table { width: 100%; border-collapse: collapse; }
                .items-table th, .items-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
                .items-table th { font-size: 0.7rem; text-transform: uppercase; color: #64748b; }
                .item-info { display: flex; flex-direction: column; }
                .item-name { font-weight: 500; }
                .item-sku { font-size: 0.75rem; color: #64748b; font-family: monospace; }
                .cell-total { font-family: monospace; font-weight: 600; }
                .totales { border-top: 2px solid #e2e8f0; margin-top: 1rem; padding-top: 1rem; }
                .total-row { display: flex; justify-content: space-between; padding: 0.5rem 0; font-size: 0.95rem; }
                .total-final { font-weight: 700; font-size: 1.1rem; border-top: 1px solid #e2e8f0; padding-top: 0.75rem; margin-top: 0.5rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .form-group label { display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem; }
                .form-group input { width: 100%; padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 6px; }
                .info-name { font-weight: 600; color: #1a1a2e; margin-bottom: 0.25rem; }
                .info-detail { font-size: 0.9rem; color: #64748b; margin-bottom: 0.25rem; }
                .info-detail.muted { font-style: italic; }
                .btn-factura { width: 100%; padding: 0.75rem; background: #10b981; color: #fff; border: none; border-radius: 6px; cursor: pointer; margin-top: 1rem; }
            `}</style>
        </div>
    );
}
