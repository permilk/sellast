// ============================================
// BRANCH-AWARE DEMO DATA
// ============================================

import { useBranchStore } from './branchStore';

// Demo products per branch (some shared, some unique)
export const DEMO_PRODUCTS_BY_BRANCH: Record<string, any[]> = {
    'branch-1': [ // Sucursal Centro
        { id: '1', name: 'Coca-Cola 600ml', price: 18, stock: 150, category: 'Bebidas' },
        { id: '2', name: 'Sabritas Original', price: 22, stock: 80, category: 'Snacks' },
        { id: '3', name: 'Pan Bimbo Grande', price: 45, stock: 40, category: 'Panadería' },
        { id: '4', name: 'Leche Lala 1L', price: 28, stock: 60, category: 'Lácteos' },
        { id: '5', name: 'Café Nescafé 200g', price: 85, stock: 25, category: 'Abarrotes' },
    ],
    'branch-2': [ // Sucursal Norte
        { id: '1', name: 'Coca-Cola 600ml', price: 18, stock: 200, category: 'Bebidas' },
        { id: '6', name: 'Doritos Nacho', price: 25, stock: 90, category: 'Snacks' },
        { id: '7', name: 'Galletas Marías', price: 18, stock: 55, category: 'Abarrotes' },
        { id: '4', name: 'Leche Lala 1L', price: 28, stock: 45, category: 'Lácteos' },
        { id: '8', name: 'Aceite 1-2-3 1L', price: 42, stock: 30, category: 'Abarrotes' },
    ],
    'branch-3': [ // Sucursal Sur
        { id: '1', name: 'Coca-Cola 600ml', price: 18, stock: 120, category: 'Bebidas' },
        { id: '9', name: 'Jugo Del Valle 1L', price: 24, stock: 65, category: 'Bebidas' },
        { id: '10', name: 'Atún Dolores', price: 22, stock: 100, category: 'Abarrotes' },
        { id: '3', name: 'Pan Bimbo Grande', price: 45, stock: 28, category: 'Panadería' },
        { id: '11', name: 'Huevo 30pz', price: 75, stock: 20, category: 'Básicos' },
    ]
};

// Demo sales per branch
export const DEMO_SALES_BY_BRANCH: Record<string, any[]> = {
    'branch-1': [
        { id: 's1', date: '2026-01-23', total: 245.50, items: 5, customer: 'Público General' },
        { id: 's2', date: '2026-01-23', total: 180.00, items: 3, customer: 'Juan Pérez' },
        { id: 's3', date: '2026-01-22', total: 520.00, items: 8, customer: 'María García' },
    ],
    'branch-2': [
        { id: 's4', date: '2026-01-23', total: 890.00, items: 12, customer: 'Distribuidora Norte' },
        { id: 's5', date: '2026-01-22', total: 145.50, items: 4, customer: 'Público General' },
    ],
    'branch-3': [
        { id: 's6', date: '2026-01-23', total: 320.00, items: 6, customer: 'Tienda Esquina' },
        { id: 's7', date: '2026-01-23', total: 95.00, items: 2, customer: 'Público General' },
        { id: 's8', date: '2026-01-22', total: 450.00, items: 7, customer: 'Restaurant Sur' },
    ]
};

// Demo KPIs per branch
export const DEMO_KPIS_BY_BRANCH: Record<string, {
    ventasHoy: number;
    ticketPromedio: number;
    productosVendidos: number;
    clientesAtendidos: number;
}> = {
    'branch-1': {
        ventasHoy: 12450.00,
        ticketPromedio: 285.50,
        productosVendidos: 145,
        clientesAtendidos: 38
    },
    'branch-2': {
        ventasHoy: 8750.00,
        ticketPromedio: 320.00,
        productosVendidos: 98,
        clientesAtendidos: 25
    },
    'branch-3': {
        ventasHoy: 6200.00,
        ticketPromedio: 195.00,
        productosVendidos: 82,
        clientesAtendidos: 31
    }
};

// Demo cash register per branch
export const DEMO_CAJA_BY_BRANCH: Record<string, {
    isOpen: boolean;
    openedAt: string;
    openingAmount: number;
    currentAmount: number;
    cashier: string;
}> = {
    'branch-1': {
        isOpen: true,
        openedAt: '08:00',
        openingAmount: 5000.00,
        currentAmount: 12450.00,
        cashier: 'Juan Carlos'
    },
    'branch-2': {
        isOpen: true,
        openedAt: '09:00',
        openingAmount: 3000.00,
        currentAmount: 8750.00,
        cashier: 'María López'
    },
    'branch-3': {
        isOpen: false,
        openedAt: '',
        openingAmount: 0,
        currentAmount: 0,
        cashier: ''
    }
};

// User assignments to branches
export const USER_BRANCH_ASSIGNMENTS: Record<string, {
    branches: string[];
    defaultBranch: string;
    canSwitchBranch: boolean;
}> = {
    'admin': {
        branches: ['branch-1', 'branch-2', 'branch-3'],
        defaultBranch: 'branch-1',
        canSwitchBranch: true
    },
    'gerente': {
        branches: ['branch-1', 'branch-2'],
        defaultBranch: 'branch-1',
        canSwitchBranch: true
    },
    'cajero': {
        branches: ['branch-1'],
        defaultBranch: 'branch-1',
        canSwitchBranch: false // Cajeros no pueden cambiar de sucursal
    }
};

// Branch managers
export const BRANCH_MANAGERS: Record<string, {
    name: string;
    email: string;
    phone: string;
}> = {
    'branch-1': {
        name: 'Roberto Sánchez',
        email: 'roberto@sellast.com',
        phone: '555-1001'
    },
    'branch-2': {
        name: 'Laura Martínez',
        email: 'laura@sellast.com',
        phone: '555-2001'
    },
    'branch-3': {
        name: 'Carlos Hernández',
        email: 'carlos@sellast.com',
        phone: '555-3001'
    }
};

// Helper function to get data for current branch
export function getProductsForBranch(branchId: string) {
    return DEMO_PRODUCTS_BY_BRANCH[branchId] || [];
}

export function getSalesForBranch(branchId: string) {
    return DEMO_SALES_BY_BRANCH[branchId] || [];
}

export function getKPIsForBranch(branchId: string) {
    return DEMO_KPIS_BY_BRANCH[branchId] || {
        ventasHoy: 0,
        ticketPromedio: 0,
        productosVendidos: 0,
        clientesAtendidos: 0
    };
}

export function getCajaForBranch(branchId: string) {
    return DEMO_CAJA_BY_BRANCH[branchId] || {
        isOpen: false,
        openedAt: '',
        openingAmount: 0,
        currentAmount: 0,
        cashier: ''
    };
}

export function getUserBranchPermissions(role: string) {
    return USER_BRANCH_ASSIGNMENTS[role] || {
        branches: [],
        defaultBranch: '',
        canSwitchBranch: false
    };
}

export function getBranchManager(branchId: string) {
    return BRANCH_MANAGERS[branchId] || null;
}
