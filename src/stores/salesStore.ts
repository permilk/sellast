'use client';

// ============================================
// SALES STORE - LocalStorage based
// ============================================

export interface SaleItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Sale {
    id: string;
    folio: string;
    items: SaleItem[];
    subtotal: number;
    descuento: number;
    iva: number;
    total: number;
    metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
    cliente: string;
    fecha: string;
    hora: string;
    cajero: string;
}

const STORAGE_KEY = 'sellast_sales';

// Get all sales
export function getSales(): Sale[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return [];
    }
    return JSON.parse(stored);
}

// Generate next folio
function generateFolio(): string {
    const sales = getSales();
    const today = new Date();
    const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const todaySales = sales.filter(s => s.folio.startsWith(`V-${dateStr}`));
    const nextNum = todaySales.length + 1;
    return `V-${dateStr}-${String(nextNum).padStart(4, '0')}`;
}

// Process a new sale
export function processSale(data: {
    items: SaleItem[];
    subtotal: number;
    descuento: number;
    iva: number;
    total: number;
    metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
    cliente: string;
}): Sale {
    const sales = getSales();
    const now = new Date();

    const newSale: Sale = {
        id: Date.now().toString(),
        folio: generateFolio(),
        items: data.items,
        subtotal: data.subtotal,
        descuento: data.descuento,
        iva: data.iva,
        total: data.total,
        metodoPago: data.metodoPago,
        cliente: data.cliente,
        fecha: now.toLocaleDateString('es-MX'),
        hora: now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        cajero: 'Administrador'
    };

    sales.unshift(newSale);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));

    return newSale;
}

// Get today's sales summary
export function getTodaySummary() {
    const sales = getSales();
    const today = new Date().toLocaleDateString('es-MX');
    const todaySales = sales.filter(s => s.fecha === today);

    return {
        totalVentas: todaySales.length,
        totalIngresos: todaySales.reduce((sum, s) => sum + s.total, 0),
        efectivo: todaySales.filter(s => s.metodoPago === 'EFECTIVO').reduce((sum, s) => sum + s.total, 0),
        tarjeta: todaySales.filter(s => s.metodoPago === 'TARJETA').reduce((sum, s) => sum + s.total, 0),
        transferencia: todaySales.filter(s => s.metodoPago === 'TRANSFERENCIA').reduce((sum, s) => sum + s.total, 0)
    };
}
