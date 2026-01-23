'use client';

// ============================================
// ADMIN - DEVOLUCIONES
// ============================================

import { useState, useEffect } from 'react';
import { KPISummary } from '@/components/admin/KPISummary';
import { getSales, Sale } from '@/stores/salesStore';
import { getProducts, updateProduct, Product } from '@/stores/productsStore';

interface Devolucion {
    id: string;
    ventaFolio: string;
    fecha: string;
    cliente: string;
    items: { producto: string; cantidad: number; precio: number }[];
    total: number;
    motivo: string;
    estado: 'pendiente' | 'aprobada' | 'rechazada';
    tipo: 'reembolso' | 'cambio' | 'credito';
}

const motivosDevolucion = [
    'Producto defectuoso',
    'Producto incorrecto',
    'Cambio de opinión',
    'No cumple expectativas',
    'Duplicado',
    'Error en la venta',
    'Otro'
];

export default function DevolucionesPage() {
    const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
    const [ventas, setVentas] = useState<Sale[]>([]);
    const [productos, setProductos] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNuevaModal, setShowNuevaModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [selectedDevolucion, setSelectedDevolucion] = useState<Devolucion | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Form state for new devolution
    const [selectedVenta, setSelectedVenta] = useState<Sale | null>(null);
    const [selectedItems, setSelectedItems] = useState<{ producto: string; cantidad: number; precio: number; maxCantidad: number }[]>([]);
    const [motivo, setMotivo] = useState('');
    const [motivoCustom, setMotivoCustom] = useState('');
    const [tipoDevolucion, setTipoDevolucion] = useState<'reembolso' | 'cambio' | 'credito'>('reembolso');

    useEffect(() => {
        setVentas(getSales());
        setProductos(getProducts());
    }, []);

    const kpiCards = [
        { label: 'Total Devoluciones', value: devoluciones.length.toString(), color: 'blue' as const },
        { label: 'Pendientes', value: devoluciones.filter(d => d.estado === 'pendiente').length.toString(), color: 'amber' as const },
        { label: 'Aprobadas', value: devoluciones.filter(d => d.estado === 'aprobada').length.toString(), color: 'green' as const },
        { label: 'Monto Devuelto', value: `$${devoluciones.filter(d => d.estado === 'aprobada').reduce((sum, d) => sum + d.total, 0).toLocaleString()}`, color: 'red' as const },
    ];

    const handleSelectVenta = (venta: Sale) => {
        setSelectedVenta(venta);
        setSelectedItems(venta.items.map(item => ({
            producto: item.name,
            cantidad: 0,
            precio: item.price,
            maxCantidad: item.quantity
        })));
    };

    const handleItemQuantityChange = (index: number, cantidad: number) => {
        const updated = [...selectedItems];
        updated[index].cantidad = Math.min(cantidad, updated[index].maxCantidad);
        setSelectedItems(updated);
    };

    const calcularTotalDevolucion = () => {
        return selectedItems.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
    };

    const handleCrearDevolucion = () => {
        if (!selectedVenta) {
            alert('Selecciona una venta');
            return;
        }
        if (selectedItems.every(i => i.cantidad === 0)) {
            alert('Selecciona al menos un producto a devolver');
            return;
        }
        const motivoFinal = motivo === 'Otro' ? motivoCustom : motivo;
        if (!motivoFinal) {
            alert('Ingresa el motivo de devolución');
            return;
        }

        const nuevaDevolucion: Devolucion = {
            id: `DEV-${Date.now()}`,
            ventaFolio: selectedVenta.folio,
            fecha: new Date().toLocaleString('es-MX'),
            cliente: selectedVenta.cliente,
            items: selectedItems.filter(i => i.cantidad > 0).map(i => ({
                producto: i.producto,
                cantidad: i.cantidad,
                precio: i.precio
            })),
            total: calcularTotalDevolucion(),
            motivo: motivoFinal,
            estado: 'pendiente',
            tipo: tipoDevolucion
        };

        setDevoluciones([nuevaDevolucion, ...devoluciones]);
        setShowNuevaModal(false);
        resetForm();
        setSuccessMessage('Devolución registrada correctamente');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleAprobar = (dev: Devolucion) => {
        // Update devolution status
        setDevoluciones(devoluciones.map(d =>
            d.id === dev.id ? { ...d, estado: 'aprobada' as const } : d
        ));

        // Restore stock for returned items
        dev.items.forEach(item => {
            const producto = productos.find(p => p.name === item.producto);
            if (producto) {
                updateProduct(producto.id, { stock: producto.stock + item.cantidad });
            }
        });

        setSuccessMessage(`Devolución ${dev.id} aprobada. Stock restaurado.`);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleRechazar = (dev: Devolucion) => {
        setDevoluciones(devoluciones.map(d =>
            d.id === dev.id ? { ...d, estado: 'rechazada' as const } : d
        ));
        setSuccessMessage(`Devolución ${dev.id} rechazada.`);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const resetForm = () => {
        setSelectedVenta(null);
        setSelectedItems([]);
        setMotivo('');
        setMotivoCustom('');
        setTipoDevolucion('reembolso');
    };

    const filteredDevoluciones = devoluciones.filter(d =>
        d.ventaFolio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getEstadoBadge = (estado: string) => {
        const styles: Record<string, { bg: string; color: string; label: string }> = {
            pendiente: { bg: '#FEF3C7', color: '#D97706', label: 'Pendiente' },
            aprobada: { bg: '#D1FAE5', color: '#059669', label: 'Aprobada' },
            rechazada: { bg: '#FEE2E2', color: '#DC2626', label: 'Rechazada' }
        };
        const style = styles[estado] || styles.pendiente;
        return (
            <span style={{ background: style.bg, color: style.color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                {style.label}
            </span>
        );
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Success Toast */}
            {successMessage && (
                <div style={{
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem',
                    background: '#10B981',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    borderRadius: '8px',
                    zIndex: 1100,
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                    ✓ {successMessage}
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                        Devoluciones
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Gestión de devoluciones y reembolsos</p>
                </div>
                <button
                    onClick={() => setShowNuevaModal(true)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#2563EB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Nueva Devolución
                </button>
            </div>

            {/* KPIs */}
            <KPISummary cards={kpiCards} />

            {/* Search */}
            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    type="search"
                    placeholder="Buscar por folio o cliente..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '0.75rem 1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '0.95rem'
                    }}
                />
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>ID</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Venta</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Cliente</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Total</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Tipo</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Estado</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Fecha</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDevoluciones.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                                    No hay devoluciones registradas
                                </td>
                            </tr>
                        ) : filteredDevoluciones.map(dev => (
                            <tr key={dev.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 600 }}>{dev.id}</td>
                                <td style={{ padding: '1rem' }}>{dev.ventaFolio}</td>
                                <td style={{ padding: '1rem' }}>{dev.cliente}</td>
                                <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 600, color: '#EF4444' }}>
                                    -${dev.total.toFixed(2)}
                                </td>
                                <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{dev.tipo}</td>
                                <td style={{ padding: '1rem' }}>{getEstadoBadge(dev.estado)}</td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>{dev.fecha}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => { setSelectedDevolucion(dev); setShowDetalleModal(true); }}
                                            style={{ padding: '0.4rem 0.75rem', background: '#CFFAFE', color: '#0891B2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                        >
                                            Ver
                                        </button>
                                        {dev.estado === 'pendiente' && (
                                            <>
                                                <button
                                                    onClick={() => handleAprobar(dev)}
                                                    style={{ padding: '0.4rem 0.75rem', background: '#D1FAE5', color: '#059669', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                >
                                                    Aprobar
                                                </button>
                                                <button
                                                    onClick={() => handleRechazar(dev)}
                                                    style={{ padding: '0.4rem 0.75rem', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                >
                                                    Rechazar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Nueva Devolución */}
            {showNuevaModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                            color: 'white',
                            padding: '1.25rem 1.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Nueva Devolución</span>
                            <button onClick={() => { setShowNuevaModal(false); resetForm(); }} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        {/* Body */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                            {/* Seleccionar Venta */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Seleccionar Venta</label>
                                <select
                                    value={selectedVenta?.id || ''}
                                    onChange={e => {
                                        const venta = ventas.find(v => v.id === e.target.value);
                                        if (venta) handleSelectVenta(venta);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <option value="">Buscar venta por folio...</option>
                                    {ventas.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {v.folio} - {v.cliente} - ${v.total.toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Items de la venta */}
                            {selectedVenta && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Productos a Devolver</label>
                                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem' }}>
                                        {selectedItems.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                                <span style={{ flex: 1 }}>{item.producto}</span>
                                                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Max: {item.maxCantidad}</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={item.maxCantidad}
                                                    value={item.cantidad}
                                                    onChange={e => handleItemQuantityChange(idx, parseInt(e.target.value) || 0)}
                                                    style={{
                                                        width: '70px',
                                                        padding: '0.5rem',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '6px',
                                                        textAlign: 'center'
                                                    }}
                                                />
                                                <span style={{ fontFamily: 'monospace', fontWeight: 600, minWidth: '80px', textAlign: 'right' }}>
                                                    ${(item.cantidad * item.precio).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontWeight: 600 }}>Total a Devolver:</span>
                                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', color: '#EF4444' }}>
                                                ${calcularTotalDevolucion().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Motivo */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Motivo de Devolución</label>
                                <select
                                    value={motivo}
                                    onChange={e => setMotivo(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <option value="">Selecciona un motivo</option>
                                    {motivosDevolucion.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                {motivo === 'Otro' && (
                                    <input
                                        type="text"
                                        value={motivoCustom}
                                        onChange={e => setMotivoCustom(e.target.value)}
                                        placeholder="Especifica el motivo..."
                                        style={{
                                            width: '100%',
                                            marginTop: '0.5rem',
                                            padding: '0.75rem',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                )}
                            </div>

                            {/* Tipo de Devolución */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Tipo de Devolución</label>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {(['reembolso', 'cambio', 'credito'] as const).map(tipo => (
                                        <button
                                            key={tipo}
                                            onClick={() => setTipoDevolucion(tipo)}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                border: tipoDevolucion === tipo ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                background: tipoDevolucion === tipo ? '#eff6ff' : 'white',
                                                color: tipoDevolucion === tipo ? '#3b82f6' : '#6b7280',
                                                fontWeight: tipoDevolucion === tipo ? 600 : 400,
                                                cursor: 'pointer',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {tipo === 'credito' ? 'Nota de Crédito' : tipo}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                onClick={() => { setShowNuevaModal(false); resetForm(); }}
                                style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCrearDevolucion}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#EF4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Registrar Devolución
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detalle */}
            {showDetalleModal && selectedDevolucion && (
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
                        maxWidth: '450px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Detalle de Devolución</h3>
                            <button onClick={() => setShowDetalleModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ color: '#6b7280', fontSize: '0.85rem' }}>ID</label>
                                <p style={{ margin: 0, fontWeight: 600, fontFamily: 'monospace' }}>{selectedDevolucion.id}</p>
                            </div>
                            <div>
                                <label style={{ color: '#6b7280', fontSize: '0.85rem' }}>Venta Original</label>
                                <p style={{ margin: 0, fontWeight: 600 }}>{selectedDevolucion.ventaFolio}</p>
                            </div>
                            <div>
                                <label style={{ color: '#6b7280', fontSize: '0.85rem' }}>Cliente</label>
                                <p style={{ margin: 0 }}>{selectedDevolucion.cliente}</p>
                            </div>
                            <div>
                                <label style={{ color: '#6b7280', fontSize: '0.85rem' }}>Productos</label>
                                {selectedDevolucion.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                        <span>{item.cantidad}x {item.producto}</span>
                                        <span style={{ fontFamily: 'monospace' }}>${(item.cantidad * item.precio).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label style={{ color: '#6b7280', fontSize: '0.85rem' }}>Total</label>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem', color: '#EF4444', fontFamily: 'monospace' }}>
                                    -${selectedDevolucion.total.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <label style={{ color: '#6b7280', fontSize: '0.85rem' }}>Motivo</label>
                                <p style={{ margin: 0 }}>{selectedDevolucion.motivo}</p>
                            </div>
                            <div>
                                <label style={{ color: '#6b7280', fontSize: '0.85rem' }}>Estado</label>
                                <div>{getEstadoBadge(selectedDevolucion.estado)}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => setShowDetalleModal(false)}
                                style={{ padding: '0.5rem 1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
