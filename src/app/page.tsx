'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const featuredProducts = [
  { id: '1', name: 'Le Sac Noir', category: 'Handbags', price: 890, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80', badge: 'New Season' },
  { id: '2', name: 'Silk Écharpe', category: 'Accessories', price: 245, image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&q=80' },
  { id: '3', name: 'Gold Chrono', category: 'Watches', price: 1250, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80' },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home bg-cream selection:bg-black selection:text-white">
      {/* Sleek Navigation */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link href="/" className="logo text-4xl font-serif font-bold tracking-tighter text-black">
            Sellast<span className="text-gold">.</span>
          </Link>
          <nav className="nav hidden md:flex gap-12 text-sm uppercase tracking-widest font-medium text-neutral-500">
            <Link href="/catalog" className="hover:text-black transition-colors">Collection</Link>
            <Link href="/about" className="hover:text-black transition-colors">Maison</Link>
            <Link href="/journal" className="hover:text-black transition-colors">Journal</Link>
          </nav>
          <div className="flex gap-6 items-center">
            <button className="text-black hover:opacity-70 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <Link href="/cart" className="text-black hover:opacity-70 transition-opacity relative">
              <span className="absolute -top-1 -right-2 text-[10px] bg-black text-white w-4 h-4 rounded-full flex items-center justify-center">2</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/luxury-hero.png"
            alt="Luxury Background"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <span className="block text-gold text-xs uppercase tracking-[0.3em] mb-6 animate-fade-in-up">Est. 2026 — Premium Collection</span>
          <h1 className="text-6xl md:text-8xl font-serif font-medium text-black mb-8 leading-tight tracking-tight">
            Elegance is <br /><span className="italic font-light">Refusal.</span>
          </h1>
          <p className="text-neutral-600 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
            Discover our curated selection of timeless essentials, crafted for those who speak the language of quiet luxury.
          </p>

          {/* Custom Premium Button */}
          <Link href="/catalog">
            <button className="px-10 py-4 bg-black text-white tracking-widest uppercase text-xs transition-all duration-700 hover:bg-neutral-800 hover:px-12 hover:tracking-[0.25em] border border-black">
              Explorar Colección
            </button>
          </Link>
        </div>
      </section>

      {/* Invisible Grid Section */}
      <section className="py-32 px-6 md:px-12 max-w-[1600px] mx-auto bg-cream">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 gap-x-12 items-end">
          <div className="md:col-span-4 self-center">
            <h2 className="text-4xl font-serif mb-6 leading-snug">The <span className="italic text-gold">Curated</span><br />Edit.</h2>
            <p className="text-neutral-500 mb-8 leading-relaxed">
              Pieces defined by superior quality and clean lines. An aesthetic that transcends trends.
            </p>
            <div className="h-px w-24 bg-black/10"></div>
          </div>

          {featuredProducts.map((p, idx) => (
            <div key={p.id} className={`group md:col-span-4 ${idx === 1 ? 'md:translate-y-16' : ''}`}>
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-neutral-100">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                {p.badge && <span className="absolute top-4 left-4 bg-white/90 text-[10px] uppercase tracking-wider px-3 py-1">{p.badge}</span>}

                {/* Invisible Action Layer */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button className="bg-white text-black px-6 py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300">Quick View</button>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">{p.category}</p>
                <h3 className="text-xl font-serif mb-2">{p.name}</h3>
                <p className="font-mono text-sm opacity-60">$ {p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial / About Snippet */}
      <section className="py-32 bg-black text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-purple-900 to-transparent"></div> {/* Subtle depth */}
        <div className="container relative z-10">
          <span className="block text-gold text-xs uppercase tracking-[0.3em] mb-6">The Philosophy</span>
          <h2 className="text-5xl md:text-6xl font-serif mb-8 max-w-3xl mx-auto leading-tight">
            "We believe in the luxury of <span className="text-neutral-400 italic">simplicity</span>."
          </h2>
          <Link href="/about" className="inline-block border-b border-white pb-1 text-sm uppercase tracking-widest hover:text-gold hover:border-gold transition-colors">
            Read Our Story
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-20 bg-cream border-t border-black/5 text-center md:text-left">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="logo text-2xl font-serif font-bold tracking-tighter text-black mb-6 block">
              Sellast<span className="text-gold">.</span>
            </Link>
            <p className="text-neutral-500 text-sm max-w-sm leading-relaxed">
              A destination for refined aesthetics.
              Redefining luxury through the lens of modern minimalism.
            </p>
          </div>
          <div>
            <h4 className="font-serif mb-6 text-lg">Shop</h4>
            <ul className="space-y-4 text-sm text-neutral-500 uppercase tracking-wide">
              <li><Link href="#" className="hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Best Sellers</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif mb-6 text-lg">Client Services</h4>
            <ul className="space-y-4 text-sm text-neutral-500 uppercase tracking-wide">
              <li><Link href="#" className="hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
              <li><a href="#" className="hover:text-black transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="container mt-20 pt-8 border-t border-black/5 text-center text-xs text-neutral-400 uppercase tracking-widest">
          © 2026 Sellast Inc. All Rights Reserved.
        </div>
      </footer>

      <style jsx global>{`
        .text-gold { color: #D4AF37; }
        .bg-cream { background-color: #FDFCF8; }
        .bg-black { background-color: #0a0a0a; }
        .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
    </div>
  );
}
