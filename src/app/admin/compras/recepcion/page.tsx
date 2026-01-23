'use client';

// ============================================
// ADMIN - RECEPCIÓN DE MERCANCÍA
// ============================================

import { useState, useEffect } from 'react';
import { KPISummary } from '@/components/admin/KPISummary';
import { getProducts, updateProduct } from '@/stores/productsStore';

interface OrdenCompra {
    id: string;
    proveedor: string;
    fecha: string;
    estado: 'pendiente' | 'parcial' | 'recibida';
    productos: {
        productoId: string;
        nombre: string;
        cantidadOrdenada: number;
        cantidadRecibida: number;
    }[];
}

const ordenesMock: OrdenCompra[] = [
    {
        id: 'OC-2026-0042',
        proveedor: 'Distribuidora Central',
        fecha: '2026-01-20',
        estado: 'pendiente',
        productos: [
            { productoId: '1', nombre: 'Whisky JackDaniels', cantidadOrdenada: 24, cantidadRecibida: 0 },
            { productoId: '2', nombre: 'Vodka Absolut', cantidadOrdenada: 12, cantidadRecibida: 0 },
        ]
    },
    {
        id: 'OC-2026-0040',
        proveedor: 'Bebidas Premium S.A.',
        fecha: '2026-01-18',
        estado: 'parcial',
        productos: [
            { productoId: '3', nombre: 'CocaCola', cantidadOrdenada: 48, cantidadRecibida: 24 },
            { productoId: '4', nombre: 'Agua San 1Lt', cantidadOrdenada: 100, cantidadRecibida: 100 },
        ]
    }
];

export default function RecepcionMercanciaPage() {
    const [ordenes, setOrdenes] = useState<OrdenCompra[]>(ordenesMock);
    const [selectedOrden, setSelectedOrden] = useState<OrdenCompra | null>(null);
    const [recepcionActiva, setRecepcionActiva] = useState(false);
    const [cantidadesRecibidas, setCantidadesRecibidas] = useState<Record<string, number>>({});

    useEffect(() => {
        // Load from localStorage if needed
    }, []);

    const iniciarRecepcion = (orden: OrdenCompra) => {
        setSelectedOrden(orden);
        setRecepcionActiva(true);
        const initial: Record<string, number> = {};
        orden.productos.forEach(p => {
            initial[p.productoId] = 0;
        });
        setCantidadesRecibidas(initial);
    };

    const confirmarRecepcion = () => {
        if (!selectedOrden) return;

        // Update product stock
        selectedOrden.productos.forEach(p => {
            const cantidad = cantidadesRecibidas[p.productoId] || 0;
            if (cantidad > 0) {
                const productos = getProducts();
                const prod = productos.find(pr => pr.id === p.productoId);
                if (prod) {
                    updateProduct(p.productoId, { stock: prod.stock + cantidad });
                }
            }
        });

        // Update order status
        setOrdenes(prev => prev.map(o => {
            if (o.id === selectedOrden.id) {
                const nuevosProductos = o.productos.map(p => ({
                    ...p,
                    cantidadRecibida: p.cantidadRecibida + (cantidadesRecibidas[p.productoId] || 0)
                }));
                const todoRecibido = nuevosProductos.every(p => p.cantidadRecibida >= p.cantidadOrdenada);
                const algunoRecibido = nuevosProductos.some(p => p.cantidadRecibida > 0);
                return {
                    ...o,
                    productos: nuevosProductos,
                    estado: todoRecibido ? 'recibida' as const : algunoRecibido ? 'parcial' as const : 'pendiente' as const
                };
            }
            return o;
        }));

        setRecepcionActiva(false);
        setSelectedOrden(null);
        alert('Recepción registrada. El inventario ha sido actualizado.');
    };

    const pendientes = ordenes.filter(o => o.estado === 'pendiente').length;
    const parciales = ordenes.filter(o => o.estado === 'parcial').length;
    const recibidas = ordenes.filter(o => o.estado === 'recibida').length;

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        Recepción de Mercancía
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Registra la llegada de productos y actualiza el inventario
                    </p>
                </div>
            </div>

            {/* KPIs */}
            <KPISummary cards={[
                { label: 'Órdenes Pendientes', value: pendientes, color: 'amber' },
                { label: 'Recepciones Parciales', value: parciales, color: 'blue' },
                { label: 'Completadas', value: recibidas, color: 'green' },
                { label: 'Total Órdenes', value: ordenes.length, color: 'purple' }
            ]} />

            {/* Orders Table */}
            {!recepcionActiva && (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Orden</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Proveedor</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fecha</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Productos</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Estado</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenes.map(orden => (
                                <tr key={orden.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 600 }}>{orden.id}</td>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{orden.proveedor}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{orden.fecha}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>{orden.productos.length}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: orden.estado === 'pendiente' ? '#FEF3C7' : orden.estado === 'parcial' ? '#DBEAFE' : '#D1FAE5',
                                            color: orden.estado === 'pendiente' ? '#D97706' : orden.estado === 'parcial' ? '#3B82F6' : '#10B981'
                                        }}>
                                            {orden.estado === 'pendiente' ? 'Pendiente' : orden.estado === 'parcial' ? 'Parcial' : 'Recibida'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {orden.estado !== 'recibida' && (
                                            <button
                                                onClick={() => iniciarRecepcion(orden)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: '#10B981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontWeight: 600,
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Recibir
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Reception Form */}
            {recepcionActiva && selectedOrden && (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    padding: '1.5rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                Recibiendo: {selectedOrden.id}
                            </h3>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{selectedOrden.proveedor}</p>
                        </div>
                        <button
                            onClick={() => setRecepcionActiva(false)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'white',
                                color: '#6B7280',
                                border: '1px solid #E5E7EB',
                                borderRadius: '6px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Producto</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Ordenado</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Ya Recibido</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Recibir Ahora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrden.productos.map(p => (
                                <tr key={p.productoId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{p.nombre}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>{p.cantidadOrdenada}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{p.cantidadRecibida}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <input
                                            type="number"
                                            min="0"
                                            max={p.cantidadOrdenada - p.cantidadRecibida}
                                            value={cantidadesRecibidas[p.productoId] || 0}
                                            onChange={e => setCantidadesRecibidas(prev => ({
                                                ...prev,
                                                [p.productoId]: parseInt(e.target.value) || 0
                                            }))}
                                            style={{
                                                width: '80px',
                                                padding: '0.5rem',
                                                border: '2px solid #10B981',
                                                borderRadius: '6px',
                                                textAlign: 'center',
                                                fontWeight: 600
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        onClick={confirmarRecepcion}
                        style={{
                            padding: '0.75rem 2rem',
                            background: '#10B981',
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
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Confirmar Recepción
                    </button>
                </div>
            )}
        </div>
    );
}
