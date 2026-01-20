'use client';

// ============================================
// ADMIN - CONFIGURACIÓN
// ============================================

import { useState } from 'react';

export default function ConfiguracionPage() {
    const [tienda, setTienda] = useState({
        nombre: 'Sellast',
        email: 'ventas@sellast.com',
        telefono: '55 1234 5678',
        direccion: 'CDMX, México',
    });

    const [facturacion, setFacturacion] = useState({
        rfc: 'SEL123456ABC',
        razonSocial: 'SELLAST SA DE CV',
        regimenFiscal: '601',
        codigoPostal: '06600',
    });

    const [envio, setEnvio] = useState({
        envioGratis: 500,
        costoLocal: 0,
        costoNacional: 150,
        costoExpress: 250,
    });

    return (
        <div className="config-page">
            <div className="page-header">
                <h1>Configuración</h1>
                <p>Ajustes generales del sistema</p>
            </div>

            <div className="config-sections">
                {/* Datos de la Tienda */}
                <section className="config-section">
                    <h2>🏪 Datos de la Tienda</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nombre de la Tienda</label>
                            <input type="text" value={tienda.nombre} onChange={e => setTienda({ ...tienda, nombre: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Email de Contacto</label>
                            <input type="email" value={tienda.email} onChange={e => setTienda({ ...tienda, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input type="tel" value={tienda.telefono} onChange={e => setTienda({ ...tienda, telefono: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Dirección</label>
                            <input type="text" value={tienda.direccion} onChange={e => setTienda({ ...tienda, direccion: e.target.value })} />
                        </div>
                    </div>
                </section>

                {/* Datos Fiscales */}
                <section className="config-section">
                    <h2>🧾 Datos Fiscales (Facturación)</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>RFC</label>
                            <input type="text" value={facturacion.rfc} onChange={e => setFacturacion({ ...facturacion, rfc: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Razón Social</label>
                            <input type="text" value={facturacion.razonSocial} onChange={e => setFacturacion({ ...facturacion, razonSocial: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Régimen Fiscal</label>
                            <select value={facturacion.regimenFiscal} onChange={e => setFacturacion({ ...facturacion, regimenFiscal: e.target.value })}>
                                <option value="601">601 - General de Ley Personas Morales</option>
                                <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                                <option value="626">626 - Régimen Simplificado de Confianza</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Código Postal</label>
                            <input type="text" value={facturacion.codigoPostal} onChange={e => setFacturacion({ ...facturacion, codigoPostal: e.target.value })} />
                        </div>
                    </div>
                </section>

                {/* Configuración de Envío */}
                <section className="config-section">
                    <h2>🚚 Configuración de Envío</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Envío Gratis desde (MXN)</label>
                            <input type="number" value={envio.envioGratis} onChange={e => setEnvio({ ...envio, envioGratis: Number(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label>Costo Envío Local (MXN)</label>
                            <input type="number" value={envio.costoLocal} onChange={e => setEnvio({ ...envio, costoLocal: Number(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label>Costo Envío Nacional (MXN)</label>
                            <input type="number" value={envio.costoNacional} onChange={e => setEnvio({ ...envio, costoNacional: Number(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label>Costo Envío Express (MXN)</label>
                            <input type="number" value={envio.costoExpress} onChange={e => setEnvio({ ...envio, costoExpress: Number(e.target.value) })} />
                        </div>
                    </div>
                </section>

                <div className="config-footer">
                    <button className="btn-primary">💾 Guardar Cambios</button>
                </div>
            </div>

            <style jsx>{`
                .config-page { max-width: 900px; }
                .page-header { margin-bottom: 2rem; }
                .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.25rem; }
                .page-header p { color: #64748b; }
                .config-sections { display: flex; flex-direction: column; gap: 1.5rem; }
                .config-section { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                .config-section h2 { font-size: 1.1rem; font-weight: 600; color: #1a1a2e; margin-bottom: 1.5rem; }
                .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
                .form-group { display: flex; flex-direction: column; }
                .form-group label { font-size: 0.875rem; font-weight: 500; color: #1a1a2e; margin-bottom: 0.5rem; }
                .form-group input, .form-group select { padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; }
                .form-group input:focus, .form-group select:focus { outline: none; border-color: #e94560; }
                .config-footer { text-align: right; }
                .btn-primary { padding: 0.875rem 2rem; background: linear-gradient(135deg, #e94560, #ff6b6b); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(233, 69, 96, 0.3); }
            `}</style>
        </div>
    );
}
