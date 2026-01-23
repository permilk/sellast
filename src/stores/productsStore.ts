'use client';

// ============================================
// PRODUCTS STORE - LocalStorage based
// ============================================

export interface Product {
    id: string;
    sku: string;
    name: string;
    category: string;
    stock: number;
    precio: number;
    estado: 'activo' | 'inactivo' | 'agotado';
    codigoBarras?: string;
    descripcion?: string;
    precioCompra?: number;
    imagen?: string;
    marca?: string;
    genero?: string;
    // Wholesale pricing
    precioMayoreo?: number;
    cantidadMayoreo?: number; // Minimum qty for wholesale price
    // Units
    gramaje?: string;
    unidadMedida?: string;
}

const STORAGE_KEY = 'sellast_products';

// Initial mock products
const initialProducts: Product[] = [
    { id: '1', sku: 'WJD-001', name: 'Whisky JackDaniels', category: 'Licor', stock: 24, precio: 85.00, estado: 'activo' },
    { id: '2', sku: 'VA-001', name: 'Vodka Absolut', category: 'Licor', stock: 18, precio: 75.00, estado: 'activo' },
    { id: '3', sku: 'CC-001', name: 'CocaCola', category: 'Gaseosa', stock: 48, precio: 18.00, estado: 'activo' },
    { id: '4', sku: 'AS-001', name: 'Agua San 1Lt', category: 'Aguas', stock: 100, precio: 7.00, estado: 'activo' },
    { id: '5', sku: 'PS-001', name: 'Pisco Suerño', category: 'Licor', stock: 0, precio: 10.00, estado: 'agotado' },
    { id: '6', sku: 'PR-001', name: 'Preparado', category: 'Complementos', stock: 12, precio: 107.00, estado: 'activo' },
    { id: '7', sku: 'TL-001', name: 'Tarro de leche gloria', category: 'Tienda', stock: 60, precio: 3.50, estado: 'activo' },
    { id: '8', sku: 'PM-001', name: 'Pomarola', category: 'Tienda', stock: 40, precio: 7.00, estado: 'inactivo' },
];

export function getProducts(): Product[] {
    if (typeof window === 'undefined') return initialProducts;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        // Initialize with mock data on first load
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
        return initialProducts;
    }
    return JSON.parse(stored);
}

export function addProduct(product: Omit<Product, 'id' | 'sku' | 'estado'>): Product {
    const products = getProducts();

    // Generate ID and SKU
    const id = Date.now().toString();
    const categoryPrefix = (product.category || 'GEN').substring(0, 3).toUpperCase();
    const sku = `${categoryPrefix}-${String(products.length + 1).padStart(3, '0')}`;

    const newProduct: Product = {
        ...product,
        id,
        sku,
        estado: product.stock > 0 ? 'activo' : 'agotado'
    };

    products.push(newProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

    return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

    return products[index];
}

export function deleteProduct(id: string): boolean {
    const products = getProducts();
    const filtered = products.filter(p => p.id !== id);

    if (filtered.length === products.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}

export function resetProducts(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
}
