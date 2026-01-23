'use client';

import { useState, useEffect } from 'react';

interface CuentaPorPagar {
    id: string;
    proveedorId: string;
    proveedorNombre: string;
    factura: string;
    fecha: string;
    fechaVencimiento: string;
    montoOriginal: number;
    montoPagado: number;
    saldoPendiente: number;
    estado: 'pendiente' | 'parcial' | 'pagada' | 'vencida';
    concepto: string;
    pagos: { fecha: string; monto: number; metodo: string; referencia: string }[];
}

interface AccountsPayableModalProps {
    isOpen: boolean;
    onClose: () => void;
    proveedores: { id: string; nombre: string }[];
}

const STORAGE_KEY = 'sellast_cuentas_por_pagar';

function getCuentas(): CuentaPorPagar[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveCuentas(cuentas: CuentaPorPagar[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cuentas));
}

export default function AccountsPayableModal({ isOpen, onClose, proveedores }: AccountsPayableModalProps) {
    const [cuentas, setCuentas] = useState<CuentaPorPagar[]>([]);
    const [showNueva, setShowNueva] = useState(false);
    const [showPago, setShowPago] = useState(false);
    const [selectedCuenta, setSelectedCuenta] = useState<CuentaPorPagar | null>(null);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroProveedor, setFiltroProveedor] = useState('');

    // Form state for new cuenta
    const [formData, setFormData] = useState({
        proveedorId: '',
        factura: '',
        monto: '',
        fechaVencimiento: '',
        concepto: ''
    });

    // Payment form
    const [pagoData, setPagoData] = useState({
        monto: '',
        metodo: 'Transferencia',
        referencia: ''
    });

    useEffect(() => {
        if (isOpen) {
            setCuentas(getCuentas());
        }
    }, [isOpen]);

    // Update status based on dates
    const updateEstados = (cuentasList: CuentaPorPagar[]): CuentaPorPagar[] => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return cuentasList.map(c => {
            if (c.saldoPendiente <= 0) return { ...c, estado: 'pagada' as const };
            if (c.montoPagado > 0 && c.saldoPendiente > 0) return { ...c, estado: 'parcial' as const };

            const venc = new Date(c.fechaVencimiento);
            if (venc < today) return { ...c, estado: 'vencida' as const };

            return { ...c, estado: 'pendiente' as const };
        });
    };

    const handleCrearCuenta = () => {
        const proveedor = proveedores.find(p => p.id === formData.proveedorId);
        if (!proveedor || !formData.monto || !formData.fechaVencimiento) {
            alert('Completa todos los campos requeridos');
            return;
        }

        const nuevaCuenta: CuentaPorPagar = {
            id: `CXP-${Date.now()}`,
            proveedorId: formData.proveedorId,
            proveedorNombre: proveedor.nombre,
            factura: formData.factura || 'S/F',
            fecha: new Date().toISOString().split('T')[0],
            fechaVencimiento: formData.fechaVencimiento,
            montoOriginal: parseFloat(formData.monto),
            montoPagado: 0,
            saldoPendiente: parseFloat(formData.monto),
            estado: 'pendiente',
            concepto: formData.concepto || 'Compra de mercancía',
            pagos: []
        };

        const updated = updateEstados([nuevaCuenta, ...cuentas]);
        setCuentas(updated);
        saveCuentas(updated);
        setShowNueva(false);
        setFormData({ proveedorId: '', factura: '', monto: '', fechaVencimiento: '', concepto: '' });
    };

    const handleRegistrarPago = () => {
        if (!selectedCuenta || !pagoData.monto) {
            alert('Ingresa el monto del pago');
            return;
        }

        const montoPago = parseFloat(pagoData.monto);
        if (montoPago > selectedCuenta.saldoPendiente) {
            alert('El pago no puede ser mayor al saldo pendiente');
            return;
        }

        const updatedCuentas = cuentas.map(c => {
            if (c.id === selectedCuenta.id) {
                const nuevoMontoPagado = c.montoPagado + montoPago;
                const nuevoSaldo = c.montoOriginal - nuevoMontoPagado;
                return {
                    ...c,
                    montoPagado: nuevoMontoPagado,
                    saldoPendiente: nuevoSaldo,
                    pagos: [...c.pagos, {
                        fecha: new Date().toISOString().split('T')[0],
                        monto: montoPago,
                        metodo: pagoData.metodo,
                        referencia: pagoData.referencia
                    }]
                };
            }
            return c;
        });

        const updated = updateEstados(updatedCuentas);
        setCuentas(updated);
        saveCuentas(updated);
        setShowPago(false);
        setSelectedCuenta(null);
        setPagoData({ monto: '', metodo: 'Transferencia', referencia: '' });
    };

    const filteredCuentas = cuentas.filter(c => {
        const matchEstado = !filtroEstado || c.estado === filtroEstado;
        const matchProveedor = !filtroProveedor || c.proveedorId === filtroProveedor;
        return matchEstado && matchProveedor;
    });

    // KPIs
    const totalPorPagar = cuentas.reduce((sum, c) => sum + c.saldoPendiente, 0);
    const totalVencido = cuentas.filter(c => c.estado === 'vencida').reduce((sum, c) => sum + c.saldoPendiente, 0);
    const porVencer7Dias = cuentas.filter(c => {
        const venc = new Date(c.fechaVencimiento);
        const today = new Date();
        const diff = (venc.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7 && c.estado === 'pendiente';
    }).reduce((sum, c) => sum + c.saldoPendiente, 0);

    const getEstadoBadge = (estado: string) => {
        const styles: Record<string, { bg: string; color: string; label: string }> = {
            pendiente: { bg: '#FEF3C7', color: '#D97706', label: 'Pendiente' },
            parcial: { bg: '#DBEAFE', color: '#2563EB', label: 'Parcial' },
            pagada: { bg: '#D1FAE5', color: '#059669', label: 'Pagada' },
            vencida: { bg: '#FEE2E2', color: '#DC2626', label: 'Vencida' }
        };
        const style = styles[estado] || styles.pendiente;
        return <span style={{ background: style.bg, color: style.color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>{style.label}</span>;
    };

    if (!isOpen) return null;

    return (
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
                maxWidth: '1000px',
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: 'white',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Cuentas por Pagar</h2>
                        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Gestión de deudas con proveedores</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', fontSize: '1.25rem', cursor: 'pointer' }}>×</button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {/* KPIs */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '180px', background: '#FEF3C7', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #F59E0B' }}>
                            <div style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 600, textTransform: 'uppercase' }}>Total por Pagar</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#92400E', fontFamily: 'monospace' }}>${totalPorPagar.toLocaleString()}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: '180px', background: '#FEE2E2', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #DC2626' }}>
                            <div style={{ fontSize: '0.75rem', color: '#991B1B', fontWeight: 600, textTransform: 'uppercase' }}>Vencido</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#991B1B', fontFamily: 'monospace' }}>${totalVencido.toLocaleString()}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: '180px', background: '#DBEAFE', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid #2563EB' }}>
                            <div style={{ fontSize: '0.75rem', color: '#1E40AF', fontWeight: 600, textTransform: 'uppercase' }}>Por Vencer (7 días)</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E40AF', fontFamily: 'monospace' }}>${porVencer7Dias.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Actions & Filters */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <select value={filtroProveedor} onChange={e => setFiltroProveedor(e.target.value)} style={{ padding: '0.5rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                <option value="">Todos los proveedores</option>
                                {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={{ padding: '0.5rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                <option value="">Todos los estados</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="parcial">Parcial</option>
                                <option value="vencida">Vencida</option>
                                <option value="pagada">Pagada</option>
                            </select>
                        </div>
                        <button onClick={() => setShowNueva(true)} style={{ padding: '0.6rem 1.25rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            Nueva Cuenta
                        </button>
                    </div>

                    {/* Table */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#e2e8f0' }}>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase' }}>Proveedor</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase' }}>Factura</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase' }}>Vencimiento</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase' }}>Monto</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase' }}>Saldo</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase' }}>Estado</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCuentas.length === 0 ? (
                                    <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No hay cuentas por pagar registradas</td></tr>
                                ) : filteredCuentas.map(cuenta => (
                                    <tr key={cuenta.id} style={{ borderTop: '1px solid #e2e8f0', background: 'white' }}>
                                        <td style={{ padding: '0.75rem', fontWeight: 500 }}>{cuenta.proveedorNombre}</td>
                                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>{cuenta.factura}</td>
                                        <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>{cuenta.fechaVencimiento}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontFamily: 'monospace' }}>${cuenta.montoOriginal.toLocaleString()}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: cuenta.saldoPendiente > 0 ? '#DC2626' : '#059669' }}>${cuenta.saldoPendiente.toLocaleString()}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>{getEstadoBadge(cuenta.estado)}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                            {cuenta.saldoPendiente > 0 && (
                                                <button onClick={() => { setSelectedCuenta(cuenta); setShowPago(true); }} style={{ padding: '0.4rem 0.75rem', background: '#D1FAE5', color: '#059669', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                                                    Pagar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Nueva Cuenta */}
            {showNueva && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', width: '90%', maxWidth: '450px' }}>
                        <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Nueva Cuenta por Pagar</h3>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Proveedor *</label>
                                <select value={formData.proveedorId} onChange={e => setFormData({ ...formData, proveedorId: e.target.value })} style={{ width: '100%', padding: '0.65rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <option value="">Seleccionar proveedor</option>
                                    {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>No. Factura</label>
                                    <input type="text" value={formData.factura} onChange={e => setFormData({ ...formData, factura: e.target.value })} placeholder="Ej: FAC-001" style={{ width: '100%', padding: '0.65rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Monto *</label>
                                    <input type="number" value={formData.monto} onChange={e => setFormData({ ...formData, monto: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '0.65rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Fecha de Vencimiento *</label>
                                <input type="date" value={formData.fechaVencimiento} onChange={e => setFormData({ ...formData, fechaVencimiento: e.target.value })} style={{ width: '100%', padding: '0.65rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Concepto</label>
                                <input type="text" value={formData.concepto} onChange={e => setFormData({ ...formData, concepto: e.target.value })} placeholder="Compra de mercancía" style={{ width: '100%', padding: '0.65rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowNueva(false)} style={{ padding: '0.65rem 1.25rem', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={handleCrearCuenta} style={{ padding: '0.65rem 1.25rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Pago */}
            {showPago && selectedCuenta && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', width: '90%', maxWidth: '400px' }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600 }}>Registrar Pago</h3>

                        <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Proveedor: <strong>{selectedCuenta.proveedorNombre}</strong></div>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Factura: <strong>{selectedCuenta.factura}</strong></div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#DC2626', marginTop: '0.5rem', fontFamily: 'monospace' }}>Saldo: ${selectedCuenta.saldoPendiente.toLocaleString()}</div>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Monto a Pagar *</label>
                                <input type="number" value={pagoData.monto} onChange={e => setPagoData({ ...pagoData, monto: e.target.value })} max={selectedCuenta.saldoPendiente} placeholder="0.00" style={{ width: '100%', padding: '0.65rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Método de Pago</label>
                                <select value={pagoData.metodo} onChange={e => setPagoData({ ...pagoData, metodo: e.target.value })} style={{ width: '100%', padding: '0.65rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <option>Transferencia</option>
                                    <option>Efectivo</option>
                                    <option>Cheque</option>
                                    <option>Tarjeta</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Referencia</label>
                                <input type="text" value={pagoData.referencia} onChange={e => setPagoData({ ...pagoData, referencia: e.target.value })} placeholder="No. transferencia, cheque, etc." style={{ width: '100%', padding: '0.65rem', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => { setShowPago(false); setSelectedCuenta(null); }} style={{ padding: '0.65rem 1.25rem', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={handleRegistrarPago} style={{ padding: '0.65rem 1.25rem', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Registrar Pago</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
