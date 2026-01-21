'use client';
import Link from 'next/link';

const productos = [
  { id: '1', slug: 'rosa-elegante-bordado', nombre: 'Rosa Elegante', categoria: 'Bordados', precio: 89, precioAnterior: 129, imagen: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop', badge: 'Popular' },
  { id: '2', slug: 'mariposa-monarca-dtf', nombre: 'Mariposa Monarca', categoria: 'DTF', precio: 65, imagen: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400&h=400&fit=crop' },
  { id: '3', slug: 'lettering-script-vinil', nombre: 'Lettering Script', categoria: 'Vinil', precio: 45, imagen: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop' },
  { id: '4', slug: 'mandala-floral-bordado', nombre: 'Mandala Floral', categoria: 'Bordados', precio: 149, imagen: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop', badge: 'Nuevo' },
];

const categorias = [
  { id: 'bordados', nombre: 'Bordados', desc: 'Diseños para máquina bordadora', imagen: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop' },
  { id: 'dtf', nombre: 'DTF', desc: 'Transfers de alta calidad', imagen: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop' },
  { id: 'vinil', nombre: 'Vinil', desc: 'Plantillas de corte', imagen: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop' },
];

export default function HomePage() {
  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <Link href="/" className="logo">Sell<span>ast</span></Link>
          <nav className="nav">
            <Link href="/productos">Catálogo</Link>
            <Link href="/productos?cat=bordados">Bordados</Link>
            <Link href="/productos?cat=dtf">DTF</Link>
            <Link href="/productos?cat=vinil">Vinil</Link>
          </nav>
          <Link href="/carrito" className="cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
            <span>0</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">Diseños Profesionales</span>
          <h1>Bordados, DTF y Corte de Vinil</h1>
          <p>Descarga diseños de alta calidad para tu negocio de personalización textil</p>
          <div className="hero-btns">
            <Link href="/productos" className="btn-primary">Ver Catálogo</Link>
            <Link href="/productos?cat=bordados" className="btn-secondary">Bordados</Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="section categorias">
        <h2>Nuestras Categorías</h2>
        <div className="cat-grid">
          {categorias.map(cat => (
            <Link href={`/productos?cat=${cat.id}`} key={cat.id} className="cat-card">
              <img src={cat.imagen} alt={cat.nombre} />
              <div className="cat-info"><h3>{cat.nombre}</h3><p>{cat.desc}</p></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="section productos">
        <h2>Productos Destacados</h2>
        <div className="prod-grid">
          {productos.map(p => (
            <Link href={`/productos/${p.slug}`} key={p.id} className="prod-card">
              <div className="prod-img">
                <img src={p.imagen} alt={p.nombre} />
                {p.badge && <span className="badge">{p.badge}</span>}
              </div>
              <div className="prod-info">
                <span className="prod-cat">{p.categoria}</span>
                <h3>{p.nombre}</h3>
                <div className="prod-price">
                  <span>${p.precio}</span>
                  {p.precioAnterior && <span className="old">${p.precioAnterior}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="section-cta"><Link href="/productos" className="btn-outline">Ver Todos →</Link></div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand"><span className="logo">Sell<span>ast</span></span><p>Diseños profesionales para tu negocio</p></div>
          <div className="footer-links">
            <h4>Catálogo</h4>
            <Link href="/productos?cat=bordados">Bordados</Link>
            <Link href="/productos?cat=dtf">DTF</Link>
            <Link href="/productos?cat=vinil">Vinil</Link>
          </div>
          <div className="footer-links">
            <h4>Soporte</h4>
            <Link href="/contacto">Contacto</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Sellast. Todos los derechos reservados.</div>
      </footer>

      <style jsx>{`
                .home{min-height:100vh}
                .header{background:#1a1a2e;padding:1rem 2rem;position:sticky;top:0;z-index:100}
                .header-container{max-width:1400px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
                .logo{font-size:1.5rem;font-weight:700;color:#fff;text-decoration:none}
                .logo span{color:#e94560}
                .nav{display:flex;gap:2rem}
                .nav a{color:rgba(255,255,255,0.8);text-decoration:none}
                .nav a:hover{color:#fff}
                .cart{position:relative;color:#fff}
                .cart span{position:absolute;top:-8px;right:-8px;background:#e94560;color:#fff;font-size:0.7rem;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center}
                .hero{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:6rem 2rem;text-align:center}
                .hero-content{max-width:800px;margin:0 auto}
                .hero-tag{display:inline-block;background:rgba(233,69,96,0.2);color:#e94560;padding:0.5rem 1rem;border-radius:20px;font-size:0.875rem;font-weight:600;margin-bottom:1.5rem}
                .hero h1{font-size:3rem;color:#fff;margin-bottom:1rem;line-height:1.2}
                .hero p{font-size:1.25rem;color:rgba(255,255,255,0.7);margin-bottom:2rem}
                .hero-btns{display:flex;gap:1rem;justify-content:center}
                .btn-primary{padding:1rem 2rem;background:linear-gradient(135deg,#e94560,#ff6b6b);color:#fff;text-decoration:none;border-radius:8px;font-weight:600}
                .btn-secondary{padding:1rem 2rem;background:rgba(255,255,255,0.1);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;border:1px solid rgba(255,255,255,0.2)}
                .section{max-width:1400px;margin:0 auto;padding:4rem 2rem}
                .section h2{font-size:2rem;color:#1a1a2e;margin-bottom:2rem;text-align:center}
                .cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
                .cat-card{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:4/3;text-decoration:none}
                .cat-card img{width:100%;height:100%;object-fit:cover;transition:transform 0.3s}
                .cat-card:hover img{transform:scale(1.05)}
                .cat-info{position:absolute;bottom:0;left:0;right:0;padding:2rem;background:linear-gradient(transparent,rgba(0,0,0,0.8))}
                .cat-info h3{color:#fff;font-size:1.5rem;margin-bottom:0.25rem}
                .cat-info p{color:rgba(255,255,255,0.7);font-size:0.9rem}
                .prod-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem}
                .prod-card{background:#fff;border-radius:12px;overflow:hidden;text-decoration:none;box-shadow:0 1px 3px rgba(0,0,0,0.1);transition:all 0.3s}
                .prod-card:hover{transform:translateY(-4px);box-shadow:0 12px 24px rgba(0,0,0,0.1)}
                .prod-img{position:relative;aspect-ratio:1}
                .prod-img img{width:100%;height:100%;object-fit:cover}
                .badge{position:absolute;top:0.75rem;left:0.75rem;background:#e94560;color:#fff;padding:0.25rem 0.75rem;border-radius:4px;font-size:0.75rem;font-weight:600}
                .prod-info{padding:1.25rem}
                .prod-cat{font-size:0.75rem;text-transform:uppercase;color:#e94560;font-weight:600}
                .prod-info h3{font-size:1rem;color:#1a1a2e;margin:0.5rem 0}
                .prod-price{display:flex;gap:0.5rem;align-items:center}
                .prod-price span{font-size:1.1rem;font-weight:700;color:#1a1a2e}
                .prod-price .old{font-size:0.9rem;color:#94a3b8;text-decoration:line-through;font-weight:400}
                .section-cta{text-align:center;margin-top:2rem}
                .btn-outline{padding:0.875rem 2rem;border:2px solid #e94560;color:#e94560;text-decoration:none;border-radius:8px;font-weight:600}
                .footer{background:#1a1a2e;color:#fff;padding:4rem 2rem 2rem}
                .footer-content{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem}
                .footer-brand p{color:rgba(255,255,255,0.6);margin-top:0.5rem}
                .footer-links h4{margin-bottom:1rem;color:#fff}
                .footer-links a{display:block;color:rgba(255,255,255,0.6);text-decoration:none;padding:0.25rem 0}
                .footer-bottom{max-width:1400px;margin:3rem auto 0;padding-top:2rem;border-top:1px solid rgba(255,255,255,0.1);text-align:center;color:rgba(255,255,255,0.5);font-size:0.875rem}
                @media(max-width:900px){.cat-grid{grid-template-columns:1fr}.prod-grid{grid-template-columns:repeat(2,1fr)}.footer-content{grid-template-columns:1fr}.nav{display:none}}
            `}</style>
    </div>
  );
}
