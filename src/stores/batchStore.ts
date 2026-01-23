'use client';

// ============================================
// BATCH/LOT STORE - Lotes y Caducidades
// ============================================

export interface Batch {
    id: string;
    productId: string;
    productName: string;
    lote: string;
    fechaProduccion?: string;
    fechaVencimiento: string;
    cantidadInicial: number;
    cantidadActual: number;
    costo?: number;
    proveedor?: string;
    estado: 'activo' | 'bajo' | 'vencido' | 'agotado';
}

const STORAGE_KEY = 'sellast_batches';

const initialBatches: Batch[] = [
    {
        id: '1',
        productId: '3',
        productName: 'CocaCola',
        lote: 'LOT-2026-001',
        fechaProduccion: '2025-11-01',
        fechaVencimiento: '2026-05-01',
        cantidadInicial: 48,
        cantidadActual: 36,
        estado: 'activo'
    },
    {
        id: '2',
        productId: '4',
        productName: 'Agua San 1Lt',
        lote: 'LOT-2026-002',
        fechaProduccion: '2025-12-15',
        fechaVencimiento: '2026-02-15',
        cantidadInicial: 100,
        cantidadActual: 45,
        estado: 'bajo'
    },
    {
        id: '3',
        productId: '7',
        productName: 'Tarro de leche gloria',
        lote: 'LOT-2025-050',
        fechaVencimiento: '2026-01-20',
        cantidadInicial: 24,
        cantidadActual: 8,
        estado: 'vencido'
    }
];

export function getBatches(): Batch[] {
    if (typeof window === 'undefined') return initialBatches;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBatches));
        return initialBatches;
    }
    return JSON.parse(stored);
}

export function getBatchById(id: string): Batch | null {
    return getBatches().find(b => b.id === id) || null;
}

export function getBatchesByProduct(productId: string): Batch[] {
    return getBatches().filter(b => b.productId === productId);
}

export function getExpiringBatches(daysAhead: number = 30): Batch[] {
    const today = new Date();
    const cutoff = new Date();
    cutoff.setDate(today.getDate() + daysAhead);

    return getBatches().filter(b => {
        const expDate = new Date(b.fechaVencimiento);
        return expDate <= cutoff && expDate >= today && b.cantidadActual > 0;
    }).sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime());
}

export function getExpiredBatches(): Batch[] {
    const today = new Date().toISOString().split('T')[0];
    return getBatches().filter(b => b.fechaVencimiento < today && b.cantidadActual > 0);
}

export function addBatch(batch: Omit<Batch, 'id' | 'estado'>): Batch {
    const batches = getBatches();
    const id = Date.now().toString();

    const today = new Date().toISOString().split('T')[0];
    let estado: Batch['estado'] = 'activo';
    if (batch.fechaVencimiento < today) {
        estado = 'vencido';
    } else if (batch.cantidadActual <= 0) {
        estado = 'agotado';
    } else if (batch.cantidadActual < batch.cantidadInicial * 0.2) {
        estado = 'bajo';
    }

    const newBatch: Batch = { ...batch, id, estado };
    batches.push(newBatch);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));

    return newBatch;
}

export function updateBatch(id: string, updates: Partial<Batch>): Batch | null {
    const batches = getBatches();
    const index = batches.findIndex(b => b.id === id);
    if (index === -1) return null;

    batches[index] = { ...batches[index], ...updates };

    // Update estado
    const batch = batches[index];
    const today = new Date().toISOString().split('T')[0];
    if (batch.fechaVencimiento < today) {
        batch.estado = 'vencido';
    } else if (batch.cantidadActual <= 0) {
        batch.estado = 'agotado';
    } else if (batch.cantidadActual < batch.cantidadInicial * 0.2) {
        batch.estado = 'bajo';
    } else {
        batch.estado = 'activo';
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
    return batch;
}

export function consumeBatch(id: string, cantidad: number): boolean {
    const batch = getBatchById(id);
    if (!batch || batch.cantidadActual < cantidad) return false;

    updateBatch(id, { cantidadActual: batch.cantidadActual - cantidad });
    return true;
}

export function deleteBatch(id: string): boolean {
    const batches = getBatches();
    const filtered = batches.filter(b => b.id !== id);
    if (filtered.length === batches.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}
