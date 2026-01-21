'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
    const [requiereFactura, setRequiereFactura] = useState(false);
    const [datos, setDatos] = useState({ nombre: '', email: '', telefono: '', direccion: '', ciudad: '', cp: '', rfc: '', razonSocial: '', usoCfdi: '' });

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); alert('Redirigiendo a pasarela de pago...'); };

    return (
        <div className="checkout-page">
            <header className="header"><Link href="/" className="logo">Sell<span>ast</span></Link></header>
            <div className="container">
                <h1>Checkout</h1>
                <form onSubmit={handleSubmit} className="grid">
                    <div className="form-col">
                        <div className="panel">
                            <h2>Datos de Contacto</h2>
                            <div className="form-row">
                                <div className="field"><label>Nombre completo</label><input required value={datos.nombre} onChange={e => setDatos({ ...datos, nombre: e.target.value })} /></div>
                            </div>
                            <div className="form-row two">
                                <div className="field"><label>Email</label><input type="email" required value={datos.email} onChange={e => setDatos({ ...datos, email: e.target.value })} /></div>
                                <div className="field"><label>Teléfono</label><input required value={datos.telefono} onChange={e => setDatos({ ...datos, telefono: e.target.value })} /></div>
                            </div>
                        </div>
                        <div className="panel">
                            <h2>Dirección de Envío</h2>
                            <div className="field"><label>Dirección</label><input required value={datos.direccion} onChange={e => setDatos({ ...datos, direccion: e.target.value })} /></div>
                            <div className="form-row two">
                                <div className="field"><label>Ciudad</label><input required value={datos.ciudad} onChange={e => setDatos({ ...datos, ciudad: e.target.value })} /></div>
                                <div className="field"><label>C.P.</label><input required value={datos.cp} onChange={e => setDatos({ ...datos, cp: e.target.value })} /></div>
                            </div>
                        </div>
                        <div className="panel">
                            <label className="checkbox"><input type="checkbox" checked={requiereFactura} onChange={e => setRequiereFactura(e.target.checked)} /> Requiero factura</label>
                            {requiereFactura && (
                                <div className="factura-form">
                                    <div className="form-row two">
                                        <div className="field"><label>RFC</label><input required value={datos.rfc} onChange={e => setDatos({ ...datos, rfc: e.target.value.toUpperCase() })} placeholder="XAXX010101000" /></div>
                                        <div className="field"><label>Uso CFDI</label>
                                            <select required value={datos.usoCfdi} onChange={e => setDatos({ ...datos, usoCfdi: e.target.value })}>
                                                <option value="">Seleccionar...</option>
                                                <option value="G03">G03 - Gastos en general</option>
                                                <option value="G01">G01 - Adquisición de mercancías</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="field"><label>Razón Social</label><input required value={datos.razonSocial} onChange={e => setDatos({ ...datos, razonSocial: e.target.value.toUpperCase() })} /></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="summary-col">
                        <div className="panel summary">
                            <h2>Resumen del Pedido</h2>
                            <div className="item"><span>Rosa Elegante - Bordado x2</span><span>$178</span></div>
                            <div className="item"><span>Mariposa Monarca - DTF x1</span><span>$65</span></div>
                            <div className="divider"></div>
                            <div className="line"><span>Subtotal</span><span>$243</span></div>
                            <div className="line"><span>Envío</span><span>Gratis</span></div>
                            <div className="line total"><span>Total</span><span>$243 MXN</span></div>
                            <button type="submit" className="btn-pay">Pagar con Stripe</button>
                            <p className="secure">🔒 Pago seguro con encriptación SSL</p>
                        </div>
                    </div>
                </form>
            </div>
            <style jsx>{`
                .checkout-page{min-height:100vh;background:#f8fafc}
                .header{background:#1a1a2e;padding:1rem 2rem}
                .logo{font-size:1.5rem;font-weight:700;color:#fff;text-decoration:none}
                .logo span{color:#e94560}
                .container{max-width:1100px;margin:0 auto;padding:2rem}
                h1{font-size:2rem;margin-bottom:2rem;color:#1a1a2e}
                .grid{display:grid;grid-template-columns:1fr 380px;gap:2rem}
                .panel{background:#fff;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem}
                .panel h2{font-size:1.1rem;margin-bottom:1.25rem;color:#1a1a2e}
                .field{margin-bottom:1rem}
                .field label{display:block;font-size:0.875rem;color:#374151;margin-bottom:0.5rem}
                .field input,.field select{width:100%;padding:0.75rem;border:1px solid #e2e8f0;border-radius:8px}
                .field input:focus,.field select:focus{outline:none;border-color:#e94560}
                .form-row.two{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
                .checkbox{display:flex;align-items:center;gap:0.75rem;cursor:pointer;font-weight:500}
                .checkbox input{width:18px;height:18px;accent-color:#e94560}
                .factura-form{margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid #eee}
                .summary{position:sticky;top:100px}
                .item{display:flex;justify-content:space-between;padding:0.5rem 0;font-size:0.9rem;color:#64748b}
                .divider{border-top:1px solid #eee;margin:1rem 0}
                .line{display:flex;justify-content:space-between;padding:0.5rem 0}
                .total{font-size:1.25rem;font-weight:700;padding-top:1rem;border-top:1px solid #eee;margin-top:0.5rem}
                .btn-pay{width:100%;padding:1rem;background:linear-gradient(135deg,#e94560,#ff6b6b);color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;margin-top:1.5rem}
                .btn-pay:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(233,69,96,0.3)}
                .secure{text-align:center;font-size:0.8rem;color:#64748b;margin-top:1rem}
                @media(max-width:768px){.grid{grid-template-columns:1fr}}
            `}</style>
        </div>
    );
}
