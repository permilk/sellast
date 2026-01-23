'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addQuotation, QuotationItem } from '@/stores/quotationsStore';
import { getProducts } from '@/stores/productsStore';
import { getClients, addClient } from '@/stores/clientsStore';

interface CartItem {
    id: string;
    nombre: string;
    sku: string;
    precio: number;
    cantidad: number;
}

export default function NuevaCotizacionPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Client
    const [selectedClientId, setSelectedClientId] = useState('nuevo');
    const [clienteNombre, setClienteNombre] = useState('');
    const [clienteEmail, setClienteEmail] = useState('');
    const [clienteTelefono, setClienteTelefono] = useState('');

    // Quotation details
    const [validezDias, setValidezDias] = useState(15);
    const [descuentoGlobal, setDescuentoGlobal] = useState(0);
    const [notas, setNotas] = useState('');
    const [condicionesPago, setCondicionesPago] = useState('Contado');
    const [tiempoEntrega, setTiempoEntrega] = useState('Inmediata');

    // Load data
    useEffect(() => {
        setProducts(getProducts());
        setClients(getClients());
    }, []);

    // Filter products
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products.slice(0, 12);
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 12);
    }, [products, searchTerm]);

    // Calculations
    const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const descuentoAmount = descuentoGlobal;
    const baseImponible = subtotal - descuentoAmount;
    const iva = baseImponible * 0.16;
    const total = baseImponible + iva;

    // When selecting existing client
    useEffect(() => {
        if (selectedClientId && selectedClientId !== 'nuevo') {
            const client = clients.find(c => c.id === selectedClientId);
            if (client) {
                setClienteNombre(client.nombre);
                setClienteEmail(client.email || '');
                setClienteTelefono(client.telefono || '');
            }
        } else if (selectedClientId === 'nuevo') {
            setClienteNombre('');
            setClienteEmail('');
            setClienteTelefono('');
        }
    }, [selectedClientId, clients]);

    const handleAddToCart = (product: any) => {
        // Get the price - check multiple possible field names
        const price = product.price ?? product.precio ?? 0;

        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                id: product.id,
                nombre: product.name,
                sku: product.sku || '',
                precio: price,
                cantidad: 1
            }]);
        }
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.cantidad + delta;
                return newQty > 0 ? { ...item, cantidad: newQty } : item;
            }
            return item;
        }).filter(item => item.cantidad > 0));
    };

    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleSubmit = () => {
        if (cart.length === 0) {
            alert('Agrega al menos un producto a la cotización');
            return;
        }
        if (!clienteNombre.trim()) {
            alert('Ingresa el nombre del cliente');
            return;
        }

        let clientId = selectedClientId;
        if (selectedClientId === 'nuevo') {
            const newClient = addClient({
                documento: '',
                nombre: clienteNombre,
                tipo: 'minorista',
                telefono: clienteTelefono,
                email: clienteEmail,
                totalCompras: 0
            });
            clientId = newClient.id;
        }

        const items: QuotationItem[] = cart.map(item => ({
            productoId: item.id,
            nombre: item.nombre,
            sku: item.sku,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
            descuento: 0,
            subtotal: item.precio * item.cantidad
        }));

        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + validezDias);

        addQuotation({
            fechaVencimiento: fechaVencimiento.toISOString().slice(0, 10),
            cliente: {
                id: clientId,
                nombre: clienteNombre,
                email: clienteEmail,
                telefono: clienteTelefono
            },
            items,
            subtotal,
            descuentoGlobal: descuentoAmount,
            iva,
            total,
            estado: 'pendiente',
            notas,
            vendedor: 'Administrador',
            condicionesPago,
            tiempoEntrega
        });

        router.push('/admin/cotizaciones');
    };

    const formatCurrency = (amount: number) => {
        if (isNaN(amount) || amount === undefined || amount === null) {
            return '$0.00';
        }
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <Link href="/admin/cotizaciones" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Volver a Cotizaciones
                </Link>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#1F2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: 0
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="11" x2="12" y2="17" />
                        <line x1="9" y1="14" x2="15" y2="14" />
                    </svg>
                    Nueva Cotización
                </h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem' }}>
                {/* Left: Products Selection */}
                <div>
                    {/* Search */}
                    <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <label style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Buscar Productos</label>
                        <input
                            type="text"
                            placeholder="Nombre o SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.75rem',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>

                    {/* Products Grid */}
                    <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Productos Disponibles</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                            {filteredProducts.map(product => {
                                const price = product.price ?? product.precio ?? 0;
                                return (
                                    <button
                                        key={product.id}
                                        onClick={() => handleAddToCart(product)}
                                        style={{
                                            padding: '0.875rem',
                                            background: '#F9FAFB',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1F2937', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {product.name}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginBottom: '0.35rem' }}>
                                            {product.sku || 'Sin SKU'}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10B981' }}>
                                            {formatCurrency(price)}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        {filteredProducts.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '2rem', fontSize: '0.875rem' }}>No se encontraron productos</p>
                        )}
                    </div>
                </div>

                {/* Right: Cart & Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Client Selection */}
                    <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Datos del Cliente</h3>

                        <select
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.6rem 0.75rem',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                marginBottom: '0.75rem',
                                fontSize: '0.9rem'
                            }}
                        >
                            <option value="nuevo">+ Nuevo Cliente</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Nombre del cliente *"
                            value={clienteNombre}
                            onChange={(e) => setClienteNombre(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '0.5rem', fontSize: '0.9rem' }}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={clienteEmail}
                            onChange={(e) => setClienteEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '0.5rem', fontSize: '0.9rem' }}
                        />
                        <input
                            type="tel"
                            placeholder="Teléfono"
                            value={clienteTelefono}
                            onChange={(e) => setClienteTelefono(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.9rem' }}
                        />
                    </div>

                    {/* Cart */}
                    <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1 }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                            Productos Seleccionados ({cart.length})
                        </h3>

                        {cart.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '1.5rem', fontSize: '0.8rem' }}>
                                Haz clic en los productos para agregarlos
                            </p>
                        ) : (
                            <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                {cart.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #F3F4F6' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1F2937' }}>{item.nombre}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{formatCurrency(item.precio)} c/u</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <button onClick={() => updateQuantity(item.id, -1)} style={{ width: '22px', height: '22px', border: '1px solid #E5E7EB', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '0.8rem' }}>-</button>
                                            <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 600, fontSize: '0.8rem' }}>{item.cantidad}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} style={{ width: '22px', height: '22px', border: '1px solid #E5E7EB', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '0.8rem' }}>+</button>
                                            <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '0.35rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M18 6L6 18M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quotation Details */}
                    <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Detalles de Cotización</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block', marginBottom: '0.2rem' }}>Validez (días)</label>
                                <input type="number" value={validezDias} onChange={(e) => setValidezDias(parseInt(e.target.value) || 15)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block', marginBottom: '0.2rem' }}>Descuento ($)</label>
                                <input type="number" value={descuentoGlobal} onChange={(e) => setDescuentoGlobal(parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block', marginBottom: '0.2rem' }}>Condiciones de Pago</label>
                                <select value={condicionesPago} onChange={(e) => setCondicionesPago(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem' }}>
                                    <option>Contado</option>
                                    <option>Crédito 15 días</option>
                                    <option>Crédito 30 días</option>
                                    <option>50% anticipo</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block', marginBottom: '0.2rem' }}>Tiempo de Entrega</label>
                                <select value={tiempoEntrega} onChange={(e) => setTiempoEntrega(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem' }}>
                                    <option>Inmediata</option>
                                    <option>1-3 días</option>
                                    <option>1 semana</option>
                                    <option>2 semanas</option>
                                </select>
                            </div>
                        </div>

                        <textarea
                            placeholder="Notas adicionales..."
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '6px', minHeight: '50px', resize: 'vertical', fontSize: '0.8rem' }}
                        />
                    </div>

                    {/* Totals & Submit */}
                    <div style={{ background: '#1F2937', borderRadius: '12px', padding: '1.25rem', color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                            <span style={{ color: '#9CA3AF' }}>Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        {descuentoAmount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                                <span style={{ color: '#F87171' }}>Descuento</span>
                                <span style={{ color: '#F87171' }}>-{formatCurrency(descuentoAmount)}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                            <span style={{ color: '#9CA3AF' }}>IVA (16%)</span>
                            <span>{formatCurrency(iva)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem', paddingTop: '0.6rem', borderTop: '1px solid #374151' }}>
                            <span>Total</span>
                            <span style={{ color: '#A78BFA' }}>{formatCurrency(total)}</span>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={cart.length === 0}
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                padding: '0.875rem',
                                background: cart.length === 0 ? '#4B5563' : '#2563EB',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Guardar Cotización
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
