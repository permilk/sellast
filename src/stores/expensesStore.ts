'use client';

// ============================================
// EXPENSES STORE - LocalStorage based
// ============================================

export interface Expense {
    id: string;
    concepto: string;
    monto: number;
    categoria: string;
    fecha: string;
    metodoPago: string;
}

const STORAGE_KEY = 'sellast_expenses';

const initialExpenses: Expense[] = [
    { id: '1', concepto: 'Pago a proveedor Coca-Cola', monto: 12000, categoria: 'Proveedores', fecha: '22/01/2026, 10:30 a.m.', metodoPago: 'Transferencia' },
    { id: '2', concepto: 'Pago de luz', monto: 2500, categoria: 'Servicios', fecha: '21/01/2026, 03:15 p.m.', metodoPago: 'Efectivo' },
    { id: '3', concepto: 'Compra de insumos limpieza', monto: 850, categoria: 'Operativos', fecha: '20/01/2026, 11:00 a.m.', metodoPago: 'Efectivo' },
    { id: '4', concepto: 'Renta local Enero', monto: 15000, categoria: 'Renta', fecha: '19/01/2026, 09:00 a.m.', metodoPago: 'Transferencia' },
];

export function getExpenses(): Expense[] {
    if (typeof window === 'undefined') return initialExpenses;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialExpenses));
        return initialExpenses;
    }
    return JSON.parse(stored);
}

export function addExpense(expense: Omit<Expense, 'id'>): Expense {
    const expenses = getExpenses();
    const id = Date.now().toString();

    const newExpense: Expense = { ...expense, id };
    expenses.unshift(newExpense); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));

    return newExpense;
}

export function updateExpense(id: string, updates: Partial<Expense>): Expense | null {
    const expenses = getExpenses();
    const index = expenses.findIndex(e => e.id === id);

    if (index === -1) return null;

    expenses[index] = { ...expenses[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));

    return expenses[index];
}

export function deleteExpense(id: string): boolean {
    const expenses = getExpenses();
    const filtered = expenses.filter(e => e.id !== id);

    if (filtered.length === expenses.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}
