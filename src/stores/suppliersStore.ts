'use client';

// ============================================
// SUPPLIERS STORE - LocalStorage based
// ============================================

export interface Supplier {
    id: string;
    nombre: string;
    rfc: string;
    contacto: string;
    telefono: string;
    giro: string;
    estado: 'activo' | 'inactivo';
    saldoPendiente: number;
}

const STORAGE_KEY = 'sellast_suppliers';

const initialSuppliers: Supplier[] = [
    { id: '1', nombre: 'Coca-Cola FEMSA', rfc: 'CCF-123456', contacto: 'Juan Pérez', telefono: '55 1234 5678', giro: 'Bebidas', estado: 'activo', saldoPendiente: 15000 },
    { id: '2', nombre: 'Distribuidora Nacional', rfc: 'DNA-789012', contacto: 'María García', telefono: '55 9876 5432', giro: 'Alimentos', estado: 'activo', saldoPendiente: 8500 },
    { id: '3', nombre: 'Licores Premium', rfc: 'LPR-345678', contacto: 'Carlos López', telefono: '55 5555 1234', giro: 'Licor', estado: 'activo', saldoPendiente: 0 },
];

export function getSuppliers(): Supplier[] {
    if (typeof window === 'undefined') return initialSuppliers;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSuppliers));
        return initialSuppliers;
    }
    return JSON.parse(stored);
}

export function addSupplier(supplier: Omit<Supplier, 'id'>): Supplier {
    const suppliers = getSuppliers();
    const id = Date.now().toString();

    const newSupplier: Supplier = { ...supplier, id };
    suppliers.push(newSupplier);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));

    return newSupplier;
}

export function updateSupplier(id: string, updates: Partial<Supplier>): Supplier | null {
    const suppliers = getSuppliers();
    const index = suppliers.findIndex(s => s.id === id);

    if (index === -1) return null;

    suppliers[index] = { ...suppliers[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));

    return suppliers[index];
}

export function deleteSupplier(id: string): boolean {
    const suppliers = getSuppliers();
    const filtered = suppliers.filter(s => s.id !== id);

    if (filtered.length === suppliers.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}
