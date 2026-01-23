'use client';

// ============================================
// ADMIN - CONTEO FÍSICO DE INVENTARIO
// ============================================

import { useState, useEffect } from 'react';
import { KPISummary } from '@/components/admin/KPISummary';
import { getProducts, Product, updateProduct } from '@/stores/productsStore';

interface ConteoItem {
    productId: string;
    producto: string;
    sku: string;
    stockSistema: number;
    stockFisico: number | null;
    diferencia: number;
    estado: 'pendiente' | 'contado' | 'ajustado';
}

export default function ConteoFisicoPage() {
    const [productos, setProductos] = useState<Product[]>([]);
    const [conteoItems, setConteoItems] = useState<ConteoItem[]>([]);
    const [conteoActivo, setConteoActivo] = useState(false);
    const [fechaConteo, setFechaConteo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        const prods = getProducts();
        setProductos(prods);
    }, []);

    const iniciarConteo = () => {
        const items: ConteoItem[] = productos.map(p => ({
            productId: p.id,
            producto: p.name,
            sku: p.sku,
            stockSistema: p.stock,
            stockFisico: null,
            diferencia: 0,
            estado: 'pendiente'
        }));
        setConteoItems(items);
        setConteoActivo(true);
        setFechaConteo(new Date().toISOString().split('T')[0]);
    };

    const actualizarConteoFisico = (productId: string, cantidad: number) => {
        setConteoItems(items =>
            items.map(item => {
                if (item.productId === productId) {
                    const dif = cantidad - item.stockSistema;
                    return {
                        ...item,
                        stockFisico: cantidad,
                        diferencia: dif,
                        estado: 'contado' as const
                    };
                }
                return item;
            })
        );
    };

    const aplicarAjustes = () => {
        conteoItems.forEach(item => {
            if (item.stockFisico !== null && item.diferencia !== 0) {
                updateProduct(item.productId, { stock: item.stockFisico });
            }
        });
        setConteoItems(items => items.map(i => ({ ...i, estado: 'ajustado' as const })));
        setShowConfirmModal(false);
        setConteoActivo(false);
        alert('Ajustes aplicados correctamente. El inventario ha sido actualizado.');
    };

    const filteredItems = conteoItems.filter(item =>
        item.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalContados = conteoItems.filter(i => i.stockFisico !== null).length;
    const totalDiferencias = conteoItems.filter(i => i.diferencia !== 0).length;
    const totalFaltantes = conteoItems.filter(i => i.diferencia < 0).reduce((sum, i) => sum + Math.abs(i.diferencia), 0);
    const totalSobrantes = conteoItems.filter(i => i.diferencia > 0).reduce((sum, i) => sum + i.diferencia, 0);

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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                            <rect x="9" y="3" width="6" height="4" rx="2" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                        Conteo Físico de Inventario
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Realiza conteos físicos y ajusta diferencias
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {!conteoActivo ? (
                        <button
                            onClick={iniciarConteo}
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
                            Iniciar Nuevo Conteo
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowConfirmModal(true)}
                                disabled={totalContados === 0}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: totalContados > 0 ? '#10B981' : '#9CA3AF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: totalContados > 0 ? 'pointer' : 'not-allowed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                Aplicar Ajustes
                            </button>
                            <button
                                onClick={() => { setConteoActivo(false); setConteoItems([]); }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'white',
                                    color: '#6B7280',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                        </>
                    )}
                </div>
            </div>

            {conteoActivo && (
                <>
                    {/* KPIs */}
                    <KPISummary cards={[
                        { label: 'Productos a Contar', value: conteoItems.length, color: 'blue' },
                        { label: 'Contados', value: totalContados, color: 'green' },
                        { label: 'Con Diferencias', value: totalDiferencias, color: 'amber' },
                        { label: 'Faltantes', value: totalFaltantes, color: 'red' }
                    ]} />

                    {/* Search */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        marginBottom: '1.5rem'
                    }}>
                        <input
                            type="text"
                            placeholder="Buscar producto o SKU..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    {/* Table */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>SKU</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Producto</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Stock Sistema</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Stock Físico</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Diferencia</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item, idx) => (
                                    <tr key={item.productId} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 500 }}>{item.sku}</td>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{item.producto}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>{item.stockSistema}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.stockFisico ?? ''}
                                                onChange={e => actualizarConteoFisico(item.productId, parseInt(e.target.value) || 0)}
                                                placeholder="—"
                                                style={{
                                                    width: '80px',
                                                    padding: '0.5rem',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '6px',
                                                    textAlign: 'center',
                                                    fontWeight: 600,
                                                    fontSize: '0.95rem'
                                                }}
                                            />
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            {item.stockFisico !== null && (
                                                <span style={{
                                                    fontWeight: 700,
                                                    color: item.diferencia === 0 ? '#10B981' : item.diferencia < 0 ? '#EF4444' : '#F59E0B'
                                                }}>
                                                    {item.diferencia > 0 ? '+' : ''}{item.diferencia}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                background: item.estado === 'pendiente' ? '#FEF3C7' : item.estado === 'contado' ? '#D1FAE5' : '#DBEAFE',
                                                color: item.estado === 'pendiente' ? '#D97706' : item.estado === 'contado' ? '#10B981' : '#3B82F6'
                                            }}>
                                                {item.estado === 'pendiente' ? 'Pendiente' : item.estado === 'contado' ? 'Contado' : 'Ajustado'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {!conteoActivo && (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                        <rect x="9" y="3" width="6" height="4" rx="2" />
                        <path d="M9 12l2 2 4-4" />
                    </svg>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                        No hay conteo activo
                    </h3>
                    <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
                        Inicia un nuevo conteo físico para comparar el inventario del sistema con el físico
                    </p>
                    <button
                        onClick={iniciarConteo}
                        style={{
                            padding: '0.75rem 2rem',
                            background: '#2563EB',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Iniciar Conteo
                    </button>
                </div>
            )}

            {/* Confirm Modal */}
            {showConfirmModal && (
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
                        padding: '2rem',
                        maxWidth: '450px',
                        width: '90%'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                            ¿Aplicar ajustes de inventario?
                        </h3>
                        <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
                            Se ajustarán {totalDiferencias} productos con diferencias:
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ flex: 1, padding: '1rem', background: '#FEE2E2', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#EF4444' }}>-{totalFaltantes}</div>
                                <div style={{ fontSize: '0.75rem', color: '#991B1B' }}>Faltantes</div>
                            </div>
                            <div style={{ flex: 1, padding: '1rem', background: '#FEF3C7', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#D97706' }}>+{totalSobrantes}</div>
                                <div style={{ fontSize: '0.75rem', color: '#92400E' }}>Sobrantes</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'white',
                                    color: '#6B7280',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={aplicarAjustes}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: '#10B981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Aplicar Ajustes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
