'use client';

// ============================================
// COMPLEMENTS STORE - LocalStorage based
// ============================================

export interface Complement {
    id: string;
    codigo: string;
    nombre: string;
    categoria: string;
    stock: number;
    precio: number;
    estado: 'Disponible' | 'Stock Bajo' | 'Agotado';
}

const STORAGE_KEY = 'sellast_complements';

const initialComplements: Complement[] = [
    { id: '1', codigo: 'COMP-001', nombre: 'Limón', categoria: 'Frutas', stock: 50, precio: 2.00, estado: 'Disponible' },
    { id: '2', codigo: 'COMP-002', nombre: 'Hielo (bolsa)', categoria: 'Hielos', stock: 20, precio: 5.00, estado: 'Disponible' },
    { id: '3', codigo: 'COMP-003', nombre: 'Sal', categoria: 'Condimentos', stock: 5, precio: 1.00, estado: 'Stock Bajo' },
    { id: '4', codigo: 'COMP-004', nombre: 'Vasos desechables (50u)', categoria: 'Desechables', stock: 0, precio: 15.00, estado: 'Agotado' },
    { id: '5', codigo: 'COMP-005', nombre: 'Servilletas (100u)', categoria: 'Desechables', stock: 30, precio: 8.00, estado: 'Disponible' },
];

export function getComplements(): Complement[] {
    if (typeof window === 'undefined') return initialComplements;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialComplements));
        return initialComplements;
    }
    return JSON.parse(stored);
}

export function addComplement(complement: Omit<Complement, 'id' | 'codigo' | 'estado'>): Complement {
    const complements = getComplements();
    const id = Date.now().toString();
    const codigo = `COMP-${String(complements.length + 1).padStart(3, '0')}`;

    const newComplement: Complement = {
        ...complement,
        id,
        codigo,
        estado: complement.stock > 10 ? 'Disponible' : complement.stock > 0 ? 'Stock Bajo' : 'Agotado'
    };

    complements.push(newComplement);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complements));

    return newComplement;
}

export function updateComplement(id: string, updates: Partial<Complement>): Complement | null {
    const complements = getComplements();
    const index = complements.findIndex(c => c.id === id);

    if (index === -1) return null;

    complements[index] = { ...complements[index], ...updates };
    // Auto-update estado based on stock
    if (updates.stock !== undefined) {
        complements[index].estado = updates.stock > 10 ? 'Disponible' : updates.stock > 0 ? 'Stock Bajo' : 'Agotado';
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complements));

    return complements[index];
}

export function deleteComplement(id: string): boolean {
    const complements = getComplements();
    const filtered = complements.filter(c => c.id !== id);

    if (filtered.length === complements.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}
