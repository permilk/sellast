'use client';

// ============================================
// BANK RECONCILIATION STORE
// ============================================

export interface BankTransaction {
    id: string;
    fecha: string;
    concepto: string;
    referencia: string;
    monto: number;
    tipo: 'deposito' | 'retiro' | 'comision' | 'interes';
    conciliado: boolean;
    ventaId?: string;
    pagoId?: string;
}

export interface BankAccount {
    id: string;
    banco: string;
    cuenta: string;
    clabe: string;
    saldoInicial: number;
    saldoActual: number;
    ultimaConciliacion?: string;
}

export interface Conciliacion {
    id: string;
    cuentaId: string;
    fechaInicio: string;
    fechaFin: string;
    saldoBanco: number;
    saldoSistema: number;
    diferencia: number;
    estado: 'pendiente' | 'conciliada' | 'con_diferencias';
    transaccionesConciliadas: number;
    transaccionesPendientes: number;
}

const ACCOUNTS_KEY = 'sellast_bank_accounts';
const TRANSACTIONS_KEY = 'sellast_bank_transactions';
const CONCILIACIONES_KEY = 'sellast_conciliaciones';

const initialAccounts: BankAccount[] = [
    {
        id: '1',
        banco: 'BBVA',
        cuenta: '0123456789',
        clabe: '012180001234567890',
        saldoInicial: 50000,
        saldoActual: 68420.50
    }
];

const initialTransactions: BankTransaction[] = [
    { id: '1', fecha: '2026-01-22', concepto: 'Depósito Terminal TPV', referencia: 'TPV-001', monto: 2450.00, tipo: 'deposito', conciliado: true },
    { id: '2', fecha: '2026-01-22', concepto: 'Comisión TPV', referencia: 'COM-001', monto: -73.50, tipo: 'comision', conciliado: true },
    { id: '3', fecha: '2026-01-21', concepto: 'Transferencia Recibida', referencia: 'TRF-001', monto: 5000.00, tipo: 'deposito', conciliado: false },
    { id: '4', fecha: '2026-01-21', concepto: 'Pago Proveedor', referencia: 'PAG-001', monto: -12000.00, tipo: 'retiro', conciliado: true },
];

export function getBankAccounts(): BankAccount[] {
    if (typeof window === 'undefined') return initialAccounts;
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    if (!stored) {
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(initialAccounts));
        return initialAccounts;
    }
    return JSON.parse(stored);
}

export function getBankTransactions(): BankTransaction[] {
    if (typeof window === 'undefined') return initialTransactions;
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    if (!stored) {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(initialTransactions));
        return initialTransactions;
    }
    return JSON.parse(stored);
}

export function getPendingTransactions(): BankTransaction[] {
    return getBankTransactions().filter(t => !t.conciliado);
}

export function addBankTransaction(trans: Omit<BankTransaction, 'id'>): BankTransaction {
    const transactions = getBankTransactions();
    const newTrans: BankTransaction = { ...trans, id: Date.now().toString() };
    transactions.push(newTrans);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    return newTrans;
}

export function reconcileTransaction(id: string, ventaId?: string): boolean {
    const transactions = getBankTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return false;

    transactions[index].conciliado = true;
    if (ventaId) transactions[index].ventaId = ventaId;
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    return true;
}

export function getConciliaciones(): Conciliacion[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(CONCILIACIONES_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function createConciliacion(cuentaId: string, fechaInicio: string, fechaFin: string, saldoBanco: number): Conciliacion {
    const transactions = getBankTransactions().filter(t =>
        t.fecha >= fechaInicio && t.fecha <= fechaFin
    );

    const conciliadas = transactions.filter(t => t.conciliado).length;
    const pendientes = transactions.filter(t => !t.conciliado).length;
    const saldoSistema = transactions.reduce((sum, t) => sum + t.monto, 0);
    const diferencia = saldoBanco - saldoSistema;

    const conciliacion: Conciliacion = {
        id: Date.now().toString(),
        cuentaId,
        fechaInicio,
        fechaFin,
        saldoBanco,
        saldoSistema,
        diferencia,
        estado: diferencia === 0 ? 'conciliada' : pendientes > 0 ? 'pendiente' : 'con_diferencias',
        transaccionesConciliadas: conciliadas,
        transaccionesPendientes: pendientes
    };

    const all = getConciliaciones();
    all.push(conciliacion);
    localStorage.setItem(CONCILIACIONES_KEY, JSON.stringify(all));

    return conciliacion;
}

export function addBankAccount(account: Omit<BankAccount, 'id'>): BankAccount {
    const accounts = getBankAccounts();
    const newAccount: BankAccount = { ...account, id: Date.now().toString() };
    accounts.push(newAccount);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    return newAccount;
}
