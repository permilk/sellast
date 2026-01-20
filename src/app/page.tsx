import Link from "next/link";

// Datos de ejemplo para productos
const featuredProducts = [
  {
    id: 1,
    name: "Bolso Premium Leather",
    category: "Accesorios",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    badge: "Oferta",
  },
  {
    id: 2,
    name: "Reloj Clásico Dorado",
    category: "Joyería",
    price: 2499,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Zapatillas Urban Style",
    category: "Calzado",
    price: 1899,
    originalPrice: 2299,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    badge: "Nuevo",
  },
  {
    id: 4,
    name: "Lentes de Sol Aviator",
    category: "Accesorios",
    price: 799,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
  },
];

const categories = [
  {
    name: "Electrónica",
    count: 42,
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=500&fit=crop",
  },
  {
    name: "Moda",
    count: 128,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop",
  },
  {
    name: "Hogar",
    count: 67,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=500&fit=crop",
  },
  {
    name: "Deportes",
    count: 89,
    image: "https://images.unsplash.com/photo-1461896836934- voices0b95adc?w=400&h=500&fit=crop",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);
}

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <Link href="/" className="logo">
              Sell<span>ast</span>
            </Link>

            <nav className="nav">
              <Link href="/productos" className="nav-link">Productos</Link>
              <Link href="/categorias" className="nav-link">Categorías</Link>
              <Link href="/ofertas" className="nav-link">Ofertas</Link>
              <Link href="/nosotros" className="nav-link">Nosotros</Link>
            </nav>

            <div className="nav-icons">
              <button className="icon-btn" aria-label="Buscar">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <button className="icon-btn" aria-label="Favoritos">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button className="icon-btn" aria-label="Carrito">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className="cart-badge">3</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-badge">✨ Envío gratis arriba de $500</span>
              <h1 className="hero-title">
                Descubre el Estilo que te <span className="accent">Define</span>
              </h1>
              <p className="hero-description">
                Explora nuestra colección exclusiva de productos premium.
                Calidad excepcional, diseño único y la mejor experiencia de compra.
              </p>
              <div className="hero-cta">
                <Link href="/productos" className="btn btn-primary btn-lg">
                  Explorar Productos
                </Link>
                <Link href="/ofertas" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>
                  Ver Ofertas
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=700&fit=crop"
                alt="Colección Premium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">Envío Gratis</h3>
              <p className="feature-description">En compras mayores a $500</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Pago Seguro</h3>
              <p className="feature-description">Transacciones 100% protegidas</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3 className="feature-title">30 Días</h3>
              <p className="feature-description">Devolución sin preguntas</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Soporte 24/7</h3>
              <p className="feature-description">Estamos para ayudarte</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Lo más vendido</span>
            <h2 className="section-title">Productos Destacados</h2>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  <div className="product-actions">
                    <button className="product-action-btn" title="Añadir a favoritos">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    <button className="product-action-btn" title="Vista rápida">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">
                    <Link href={`/producto/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div className="product-price">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="original-price">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link href="/productos" className="btn btn-outline">
              Ver Todos los Productos →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Explora</span>
            <h2 className="section-title">Compra por Categoría</h2>
          </div>

          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link key={index} href={`/categoria/${category.name.toLowerCase()}`} className="category-card">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <h3 className="category-name">{category.name}</h3>
                  <span className="category-count">{category.count} productos</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section" style={{ background: 'var(--gradient-accent)', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: 'var(--space-md)' }}>
            ¿Quieres ofertas exclusivas?
          </h2>
          <p style={{ opacity: 0.9, marginBottom: 'var(--space-xl)', maxWidth: '500px', marginInline: 'auto' }}>
            Suscríbete a nuestro newsletter y recibe un 10% de descuento en tu primera compra.
          </p>
          <form style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '500px', marginInline: 'auto' }}>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              style={{
                flex: 1,
                minWidth: '250px',
                padding: 'var(--space-md) var(--space-lg)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '1rem',
              }}
            />
            <button type="submit" className="btn" style={{ background: 'var(--color-primary)', color: '#fff' }}>
              Suscribirse
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">Sell<span>ast</span></div>
              <p className="footer-description">
                Tu destino para productos premium. Calidad excepcional y la mejor experiencia de compra online.
              </p>
            </div>

            <div>
              <h4 className="footer-title">Tienda</h4>
              <div className="footer-links">
                <Link href="/productos" className="footer-link">Todos los Productos</Link>
                <Link href="/ofertas" className="footer-link">Ofertas</Link>
                <Link href="/nuevos" className="footer-link">Novedades</Link>
                <Link href="/categorias" className="footer-link">Categorías</Link>
              </div>
            </div>

            <div>
              <h4 className="footer-title">Ayuda</h4>
              <div className="footer-links">
                <Link href="/contacto" className="footer-link">Contacto</Link>
                <Link href="/envios" className="footer-link">Envíos</Link>
                <Link href="/devoluciones" className="footer-link">Devoluciones</Link>
                <Link href="/faq" className="footer-link">FAQ</Link>
              </div>
            </div>

            <div>
              <h4 className="footer-title">Legal</h4>
              <div className="footer-links">
                <Link href="/privacidad" className="footer-link">Privacidad</Link>
                <Link href="/terminos" className="footer-link">Términos</Link>
                <Link href="/cookies" className="footer-link">Cookies</Link>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-copyright">
              © 2026 Sellast. Todos los derechos reservados.
            </span>
            <div className="payment-icons">
              <span>💳</span>
              <span>🅿️</span>
              <span>💵</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
