'use client';
import Link from 'next/link';
import { useState } from 'react';

const carritoInicial = [
    { id: '1', nombre: 'Rosa Elegante - Bordado', precio: 89, cantidad: 2, imagen: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=100&h=100&fit=crop' },
    { id: '2', nombre: 'Mariposa Monarca - DTF', precio: 65, cantidad: 1, imagen: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=100&h=100&fit=crop' },
];

export default function CarritoPage() {
    const [carrito, setCarrito] = useState(carritoInicial);
    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    return (
        <div className="carrito-page">
            <header className="header"><Link href="/" className="logo">Sell<span>ast</span></Link></header>
            <div className="container">
                <h1>Tu Carrito</h1>
                <div className="grid">
                    <div className="items">
                        {carrito.map(item => (
                            <div key={item.id} className="item">
                                <img src={item.imagen} alt="" />
                                <div className="info"><h3>{item.nombre}</h3><span>${item.precio}</span></div>
                                <div className="qty">
                                    <button onClick={() => setCarrito(carrito.map(i => i.id === item.id ? { ...i, cantidad: Math.max(1, i.cantidad - 1) } : i))}>−</button>
                                    <span>{item.cantidad}</span>
                                    <button onClick={() => setCarrito(carrito.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i))}>+</button>
                                </div>
                                <span className="subtotal">${item.precio * item.cantidad}</span>
                                <button className="remove" onClick={() => setCarrito(carrito.filter(i => i.id !== item.id))}>×</button>
                            </div>
                        ))}
                    </div>
                    <div className="summary">
                        <h2>Resumen</h2>
                        <div className="line"><span>Subtotal</span><span>${subtotal}</span></div>
                        <div className="line total"><span>Total</span><span>${subtotal}</span></div>
                        <Link href="/checkout" className="btn-checkout">Proceder al Pago →</Link>
                        <Link href="/productos" className="btn-back">← Seguir comprando</Link>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .carrito-page{min-height:100vh;background:#f8fafc}
                .header{background:#1a1a2e;padding:1rem 2rem}
                .logo{font-size:1.5rem;font-weight:700;color:#fff;text-decoration:none}
                .logo span{color:#e94560}
                .container{max-width:1200px;margin:0 auto;padding:2rem}
                h1{font-size:2rem;margin-bottom:2rem;color:#1a1a2e}
                .grid{display:grid;grid-template-columns:1fr 350px;gap:2rem}
                .items{background:#fff;border-radius:12px;padding:1rem}
                .item{display:flex;align-items:center;gap:1rem;padding:1rem;border-bottom:1px solid #eee}
                .item img{width:60px;height:60px;border-radius:8px;object-fit:cover}
                .info h3{font-size:1rem;margin:0}
                .info span{color:#64748b;font-size:0.9rem}
                .qty{display:flex;align-items:center;background:#f1f5f9;border-radius:6px}
                .qty button{width:32px;height:32px;border:none;background:none;cursor:pointer}
                .qty span{width:32px;text-align:center}
                .subtotal{font-weight:700;min-width:80px;text-align:right}
                .remove{background:none;border:none;font-size:1.5rem;color:#94a3b8;cursor:pointer}
                .summary{background:#fff;border-radius:12px;padding:1.5rem;height:fit-content}
                .summary h2{margin-bottom:1rem}
                .line{display:flex;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid #eee}
                .total{font-size:1.25rem;font-weight:700;border:none}
                .btn-checkout{display:block;text-align:center;padding:1rem;background:linear-gradient(135deg,#e94560,#ff6b6b);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;margin-top:1.5rem}
                .btn-back{display:block;text-align:center;color:#64748b;margin-top:1rem;text-decoration:none}
                @media(max-width:768px){.grid{grid-template-columns:1fr}}
            `}</style>
        </div>
    );
}
