'use client';

// ============================================
// CATEGORIES STORE - LocalStorage based
// ============================================

export interface Category {
    id: string;
    name: string;
    status: 'Activo' | 'Inactivo';
    productCount?: number;
}

const STORAGE_KEY = 'sellast_categories';

// Initial mock categories
const initialCategories: Category[] = [
    { id: '1', name: 'ACCESORIO MUNDOPET', status: 'Activo', productCount: 5 },
    { id: '2', name: 'Accesorio Panel SPC', status: 'Activo', productCount: 3 },
    { id: '3', name: 'Alimentos', status: 'Activo', productCount: 8 },
    { id: '4', name: 'Juguetes', status: 'Inactivo', productCount: 2 },
    { id: '5', name: 'Bebidas', status: 'Activo', productCount: 4 },
    { id: '6', name: 'Licor', status: 'Activo', productCount: 3 },
    { id: '7', name: 'Gaseosa', status: 'Activo', productCount: 1 },
    { id: '8', name: 'Aguas', status: 'Activo', productCount: 1 },
    { id: '9', name: 'Complementos', status: 'Activo', productCount: 1 },
    { id: '10', name: 'Tienda', status: 'Activo', productCount: 2 },
];

export function getCategories(): Category[] {
    if (typeof window === 'undefined') return initialCategories;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCategories));
        return initialCategories;
    }
    return JSON.parse(stored);
}

export function addCategory(category: Omit<Category, 'id'>): Category {
    const categories = getCategories();
    const id = Date.now().toString();

    const newCategory: Category = {
        ...category,
        id,
        productCount: category.productCount || 0
    };

    categories.push(newCategory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));

    return newCategory;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
    const categories = getCategories();
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) return null;

    categories[index] = { ...categories[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));

    return categories[index];
}

export function deleteCategory(id: string): boolean {
    const categories = getCategories();
    const filtered = categories.filter(c => c.id !== id);

    if (filtered.length === categories.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}

export function getCategoryNames(): string[] {
    return getCategories().filter(c => c.status === 'Activo').map(c => c.name);
}
