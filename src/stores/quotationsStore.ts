'use client';

export interface QuotationItem {
    productoId: string;
    nombre: string;
    sku: string;
    cantidad: number;
    precioUnitario: number;
    descuento: number;
    subtotal: number;
}

export interface Quotation {
    id: string;
    folio: string;
    fecha: string;
    fechaVencimiento: string;
    cliente: {
        id: string;
        nombre: string;
        email: string;
        telefono: string;
    };
    items: QuotationItem[];
    subtotal: number;
    descuentoGlobal: number;
    iva: number;
    total: number;
    estado: 'pendiente' | 'enviada' | 'aceptada' | 'rechazada' | 'expirada' | 'convertida';
    notas: string;
    vendedor: string;
    condicionesPago: string;
    tiempoEntrega: string;
}

const STORAGE_KEY = 'sellast_quotations';

// Generate folio: COT-YYYYMMDD-####
const generateFolio = (): string => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const stored = localStorage.getItem(STORAGE_KEY);
    const quotations: Quotation[] = stored ? JSON.parse(stored) : [];

    // Count quotations from today
    const todayPrefix = `COT-${dateStr}`;
    const todayCount = quotations.filter(q => q.folio.startsWith(todayPrefix)).length;
    const seq = String(todayCount + 1).padStart(4, '0');

    return `${todayPrefix}-${seq}`;
};

export const getQuotations = (): Quotation[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const getQuotationById = (id: string): Quotation | undefined => {
    const quotations = getQuotations();
    return quotations.find(q => q.id === id);
};

export const addQuotation = (data: Omit<Quotation, 'id' | 'folio' | 'fecha'>): Quotation => {
    const quotations = getQuotations();
    const newQuotation: Quotation = {
        ...data,
        id: `quot_${Date.now()}`,
        folio: generateFolio(),
        fecha: new Date().toISOString().slice(0, 10)
    };
    quotations.push(newQuotation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations));
    return newQuotation;
};

export const updateQuotation = (id: string, updates: Partial<Quotation>): Quotation | null => {
    const quotations = getQuotations();
    const index = quotations.findIndex(q => q.id === id);
    if (index === -1) return null;

    quotations[index] = { ...quotations[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations));
    return quotations[index];
};

export const deleteQuotation = (id: string): boolean => {
    const quotations = getQuotations();
    const filtered = quotations.filter(q => q.id !== id);
    if (filtered.length === quotations.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
};

export const updateQuotationStatus = (id: string, estado: Quotation['estado']): Quotation | null => {
    return updateQuotation(id, { estado });
};

// Check and mark expired quotations
export const checkExpiredQuotations = (): void => {
    const quotations = getQuotations();
    const today = new Date().toISOString().slice(0, 10);
    let updated = false;

    quotations.forEach(q => {
        if (q.estado === 'pendiente' || q.estado === 'enviada') {
            if (q.fechaVencimiento < today) {
                q.estado = 'expirada';
                updated = true;
            }
        }
    });

    if (updated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations));
    }
};
