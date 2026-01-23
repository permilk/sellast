'use client';

import { useState, useEffect } from 'react';
import { KPISummary } from '@/components/admin/KPISummary';
import { getProducts, Product } from '@/stores/productsStore';

interface InventoryItem {
    id: string;
    producto: string;
    sku: string;
    stockActual: number;
    stockMinimo: number;
    stockMaximo: number;
    ultimoMovimiento: string;
    estado: 'normal' | 'bajo' | 'agotado' | 'exceso';
}

interface Movement {
    id: string;
    fecha: string;
    tipo: 'entrada' | 'salida' | 'ajuste';
    producto: string;
    cantidad: number;
    motivo: string;
}

const initialMovements: Movement[] = [
    { id: '1', fecha: '21/01/2026 14:30', tipo: 'salida', producto: 'CocaCola', cantidad: 12, motivo: 'Venta' },
    { id: '2', fecha: '21/01/2026 12:00', tipo: 'entrada', producto: 'Whisky JackDaniels', cantidad: 10, motivo: 'Compra a proveedor' },
    { id: '3', fecha: '21/01/2026 10:15', tipo: 'ajuste', producto: 'Preparado', cantidad: 5, motivo: 'Inventario físico' },
];

export default function InventarioPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [movements, setMovements] = useState<Movement[]>(initialMovements);
    const [activeTab, setActiveTab] = useState<'stock' | 'movimientos'>('stock');
    const [searchTerm, setSearchTerm] = useState('');
    const [showEntradaModal, setShowEntradaModal] = useState(false);
    const [showSalidaModal, setShowSalidaModal] = useState(false);
    const [showAjusteModal, setShowAjusteModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [movimiento, setMovimiento] = useState({ producto: '', cantidad: 1, motivo: '' });
    const [ajusteCantidad, setAjusteCantidad] = useState(0);
    const [ajusteMotivo, setAjusteMotivo] = useState('');
    const [editMinimo, setEditMinimo] = useState(10);
    const [editMaximo, setEditMaximo] = useState(100);

    // Load inventory from productsStore
    useEffect(() => {
        const products = getProducts();
        const inventoryItems: InventoryItem[] = products.map((p: Product) => {
            const stockMin = 10;
            const stockMax = 100;
            let estado: InventoryItem['estado'] = 'normal';
            if (p.stock === 0) estado = 'agotado';
            else if (p.stock < stockMin) estado = 'bajo';
            else if (p.stock > stockMax) estado = 'exceso';

            return {
                id: p.id,
                producto: p.name,
                sku: p.codigoBarras || `SKU-${p.id.slice(-3)}`,
                stockActual: p.stock,
                stockMinimo: stockMin,
                stockMaximo: stockMax,
                ultimoMovimiento: new Date().toLocaleDateString('es-MX'),
                estado
            };
        });
        setInventory(inventoryItems);
    }, []);

    const getEstadoBadge = (estado: string) => {
        const styles: Record<string, { bg: string; color: string; label: string }> = {
            normal: { bg: '#D1FAE5', color: '#059669', label: 'Normal' },
            bajo: { bg: '#FEF3C7', color: '#D97706', label: 'Stock Bajo' },
            agotado: { bg: '#FEE2E2', color: '#DC2626', label: 'Agotado' },
            exceso: { bg: '#DBEAFE', color: '#2563EB', label: 'Exceso' }
        };
        const style = styles[estado];
        return (
            <span style={{
                background: style.bg,
                color: style.color,
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600
            }}>
                {style.label}
            </span>
        );
    };

    const getMovimientoBadge = (tipo: string) => {
        const styles: Record<string, { bg: string; color: string }> = {
            entrada: { bg: '#10B981', color: 'white' },
            salida: { bg: '#EF4444', color: 'white' },
            ajuste: { bg: '#F59E0B', color: 'white' }
        };
        const style = styles[tipo];
        return (
            <span style={{
                background: style.bg,
                color: style.color,
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize'
            }}>
                {tipo}
            </span>
        );
    };

    const alertas = inventory.filter(i => i.estado === 'bajo' || i.estado === 'agotado').length;
    const productosActivos = inventory.length;

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#1f2937',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                        Control de Inventario
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Gestiona el stock y movimientos de productos
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => setShowEntradaModal(true)} style={{
                        padding: '0.75rem 1rem',
                        background: '#2563EB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Registrar Entrada
                    </button>
                    <button onClick={() => setShowSalidaModal(true)} style={{
                        padding: '0.75rem 1rem',
                        background: '#EF4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Registrar Salida
                    </button>
                </div>
            </div>

            {/* KPI Summary */}
            <KPISummary cards={[
                { label: 'Productos', value: productosActivos, color: 'blue' },
                { label: 'Alertas Stock', value: alertas, color: 'red' },
                { label: 'Entradas Hoy', value: 12, color: 'green' },
                { label: 'Salidas Hoy', value: 8, color: 'amber' }
            ]} />

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                    onClick={() => setActiveTab('stock')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: activeTab === 'stock' ? '#3B82F6' : 'white',
                        color: activeTab === 'stock' ? 'white' : '#6b7280',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Stock Actual
                </button>
                <button
                    onClick={() => setActiveTab('movimientos')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: activeTab === 'movimientos' ? '#3B82F6' : 'white',
                        color: activeTab === 'movimientos' ? 'white' : '#6b7280',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Movimientos
                </button>
            </div>

            {/* Search */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'flex-end'
            }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Buscar</label>
                    <input
                        type="text"
                        placeholder="Nombre o SKU del producto..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 1rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
            </div>

            {/* Stock Table */}
            {activeTab === 'stock' && (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>PRODUCTO</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>SKU</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>STOCK ACTUAL</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>MÍNIMO</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>MÁXIMO</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>ESTADO</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.filter(i => i.producto.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                                <tr key={item.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{item.producto}</td>
                                    <td style={{ padding: '1rem', color: '#7C3AED', fontWeight: 500 }}>{item.sku}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>{item.stockActual}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{item.stockMinimo}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{item.stockMaximo}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>{getEstadoBadge(item.estado)}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                            <button
                                                onClick={() => { setSelectedItem(item); setShowDetalleModal(true); }}
                                                style={{
                                                    width: '32px', height: '32px', background: '#CFFAFE', border: 'none',
                                                    borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}
                                                title="Ver"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => { setSelectedItem(item); setEditMinimo(item.stockMinimo); setEditMaximo(item.stockMaximo); setShowEditModal(true); }}
                                                style={{
                                                    width: '32px', height: '32px', background: '#FEF3C7', border: 'none',
                                                    borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}
                                                title="Editar"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => { setSelectedItem(item); setAjusteCantidad(0); setAjusteMotivo(''); setShowAjusteModal(true); }}
                                                style={{
                                                    width: '32px', height: '32px', background: '#DBEAFE', border: 'none',
                                                    borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}
                                                title="Ajustar Stock"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                                                    <path d="M12 2v20M2 12h20" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Movements Table */}
            {activeTab === 'movimientos' && (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>FECHA</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>TIPO</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>PRODUCTO</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>CANTIDAD</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>MOTIVO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.map(mov => (
                                <tr key={mov.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', color: '#6b7280' }}>{mov.fecha}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>{getMovimientoBadge(mov.tipo)}</td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{mov.producto}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>
                                        <span style={{ color: mov.tipo === 'entrada' ? '#10B981' : mov.tipo === 'salida' ? '#EF4444' : '#F59E0B' }}>
                                            {mov.tipo === 'entrada' ? '+' : mov.tipo === 'salida' ? '-' : ''}{mov.cantidad}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#6b7280' }}>{mov.motivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Registrar Entrada */}
            {showEntradaModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#2563EB' }}>Registrar Entrada</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Producto *</label>
                                <select value={movimiento.producto} onChange={e => setMovimiento({ ...movimiento, producto: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <option value="">Seleccionar producto...</option>
                                    {inventory.map(item => <option key={item.id} value={item.producto}>{item.producto}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Cantidad *</label>
                                <input type="number" min="1" value={movimiento.cantidad} onChange={e => setMovimiento({ ...movimiento, cantidad: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Motivo</label>
                                <input type="text" value={movimiento.motivo} onChange={e => setMovimiento({ ...movimiento, motivo: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} placeholder="Compra a proveedor" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowEntradaModal(false)} style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={() => {
                                if (!movimiento.producto || movimiento.cantidad < 1) { alert('Producto y cantidad son requeridos'); return; }
                                const newMov: Movement = { id: String(movements.length + 1), fecha: new Date().toLocaleString('es-MX'), tipo: 'entrada', producto: movimiento.producto, cantidad: movimiento.cantidad, motivo: movimiento.motivo || 'Sin especificar' };
                                setMovements([newMov, ...movements]);
                                // Update stock for the product
                                setInventory(prev => prev.map(item =>
                                    item.producto === movimiento.producto
                                        ? { ...item, stockActual: item.stockActual + movimiento.cantidad, estado: (item.stockActual + movimiento.cantidad) === 0 ? 'agotado' : (item.stockActual + movimiento.cantidad) < item.stockMinimo ? 'bajo' : (item.stockActual + movimiento.cantidad) > item.stockMaximo ? 'exceso' : 'normal' }
                                        : item
                                ));
                                const cantidadRegistrada = movimiento.cantidad;
                                const productoRegistrado = movimiento.producto;
                                setMovimiento({ producto: '', cantidad: 1, motivo: '' });
                                setShowEntradaModal(false);
                                alert(`Entrada de ${cantidadRegistrada} unidades de ${productoRegistrado} registrada`);
                            }} style={{ padding: '0.75rem 1.5rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Registrar Entrada</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Registrar Salida */}
            {showSalidaModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#EF4444' }}>Registrar Salida</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Producto *</label>
                                <select value={movimiento.producto} onChange={e => setMovimiento({ ...movimiento, producto: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <option value="">Seleccionar producto...</option>
                                    {inventory.map(item => <option key={item.id} value={item.producto}>{item.producto}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Cantidad *</label>
                                <input type="number" min="1" value={movimiento.cantidad} onChange={e => setMovimiento({ ...movimiento, cantidad: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Motivo</label>
                                <input type="text" value={movimiento.motivo} onChange={e => setMovimiento({ ...movimiento, motivo: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} placeholder="Venta, merma, ajuste..." />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowSalidaModal(false)} style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={() => {
                                if (!movimiento.producto || movimiento.cantidad < 1) { alert('Producto y cantidad son requeridos'); return; }
                                // Check if there's enough stock
                                const currentItem = inventory.find(i => i.producto === movimiento.producto);
                                if (currentItem && currentItem.stockActual < movimiento.cantidad) {
                                    alert(`Stock insuficiente. Stock actual: ${currentItem.stockActual}`);
                                    return;
                                }
                                const newMov: Movement = { id: String(movements.length + 1), fecha: new Date().toLocaleString('es-MX'), tipo: 'salida', producto: movimiento.producto, cantidad: movimiento.cantidad, motivo: movimiento.motivo || 'Sin especificar' };
                                setMovements([newMov, ...movements]);
                                // Update stock for the product (subtract)
                                setInventory(prev => prev.map(item =>
                                    item.producto === movimiento.producto
                                        ? { ...item, stockActual: item.stockActual - movimiento.cantidad, estado: (item.stockActual - movimiento.cantidad) === 0 ? 'agotado' : (item.stockActual - movimiento.cantidad) < item.stockMinimo ? 'bajo' : (item.stockActual - movimiento.cantidad) > item.stockMaximo ? 'exceso' : 'normal' }
                                        : item
                                ));
                                const cantidadRegistrada = movimiento.cantidad;
                                const productoRegistrado = movimiento.producto;
                                setMovimiento({ producto: '', cantidad: 1, motivo: '' });
                                setShowSalidaModal(false);
                                alert(`Salida de ${cantidadRegistrada} unidades de ${productoRegistrado} registrada`);
                            }} style={{ padding: '0.75rem 1.5rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Registrar Salida</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Ajuste de Stock */}
            {showAjusteModal && selectedItem && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#3B82F6' }}>Ajustar Stock - {selectedItem.producto}</h2>
                        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>Stock Actual: <strong style={{ color: '#111827', fontSize: '1.1rem' }}>{selectedItem.stockActual}</strong></p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Ajuste (+/-) *</label>
                                <input type="number" value={ajusteCantidad} onChange={e => setAjusteCantidad(Number(e.target.value))}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                    placeholder="Ej: +10 o -5" />
                                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>Nuevo stock: <strong>{selectedItem.stockActual + ajusteCantidad}</strong></p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Motivo *</label>
                                <input type="text" value={ajusteMotivo} onChange={e => setAjusteMotivo(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                    placeholder="Inventario físico, corrección, merma..." />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => { setShowAjusteModal(false); setSelectedItem(null); }}
                                style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={() => {
                                if (!ajusteMotivo) { alert('El motivo es requerido'); return; }
                                const newMov: Movement = { id: String(movements.length + 1), fecha: new Date().toLocaleString('es-MX'), tipo: 'ajuste', producto: selectedItem.producto, cantidad: Math.abs(ajusteCantidad), motivo: ajusteMotivo };
                                setMovements([newMov, ...movements]);
                                setInventory(prev => prev.map(i => i.id === selectedItem.id ? { ...i, stockActual: i.stockActual + ajusteCantidad } : i));
                                setShowAjusteModal(false);
                                setSelectedItem(null);
                            }} style={{ padding: '0.75rem 1.5rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Aplicar Ajuste</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detalle de Producto */}
            {showDetalleModal && selectedItem && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111827' }}>Detalle de Inventario</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>PRODUCTO</p>
                                <p style={{ fontWeight: 700, margin: 0 }}>{selectedItem.producto}</p>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>SKU</p>
                                <p style={{ fontWeight: 500, margin: 0, fontFamily: 'monospace', color: '#7C3AED' }}>{selectedItem.sku}</p>
                            </div>
                            <div style={{ background: '#DBEAFE', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#3B82F6', marginBottom: '0.25rem' }}>STOCK ACTUAL</p>
                                <p style={{ fontWeight: 700, fontSize: '1.5rem', margin: 0, color: '#3B82F6' }}>{selectedItem.stockActual}</p>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>ESTADO</p>
                                <p style={{ margin: 0 }}>{getEstadoBadge(selectedItem.estado)}</p>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>MÍNIMO</p>
                                <p style={{ fontWeight: 500, margin: 0 }}>{selectedItem.stockMinimo}</p>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>MÁXIMO</p>
                                <p style={{ fontWeight: 500, margin: 0 }}>{selectedItem.stockMaximo}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => { setShowDetalleModal(false); setSelectedItem(null); }}
                                style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cerrar</button>
                            <button onClick={() => { setShowDetalleModal(false); setAjusteCantidad(0); setAjusteMotivo(''); setShowAjusteModal(true); }}
                                style={{ padding: '0.75rem 1.5rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Ajustar Stock</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Editar Inventario */}
            {showEditModal && selectedItem && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#F59E0B' }}>Editar - {selectedItem.producto}</h2>
                        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>Stock Actual: <strong style={{ color: '#111827', fontSize: '1.1rem' }}>{selectedItem.stockActual}</strong></p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Stock Mínimo *</label>
                                <input type="number" min="0" value={editMinimo} onChange={e => setEditMinimo(Number(e.target.value))}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Stock Máximo *</label>
                                <input type="number" min="1" value={editMaximo} onChange={e => setEditMaximo(Number(e.target.value))}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => { setShowEditModal(false); setSelectedItem(null); }}
                                style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={() => {
                                if (editMaximo <= editMinimo) { alert('El máximo debe ser mayor que el mínimo'); return; }
                                setInventory(prev => prev.map(i => i.id === selectedItem.id ? {
                                    ...i,
                                    stockMinimo: editMinimo,
                                    stockMaximo: editMaximo,
                                    estado: i.stockActual === 0 ? 'agotado' : i.stockActual < editMinimo ? 'bajo' : i.stockActual > editMaximo ? 'exceso' : 'normal'
                                } : i));
                                setShowEditModal(false);
                                setSelectedItem(null);
                            }} style={{ padding: '0.75rem 1.5rem', background: '#F59E0B', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
