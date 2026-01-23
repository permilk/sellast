'use client';

// ============================================
// LOYALTY STORE - Programa de Puntos/Lealtad
// ============================================

export interface LoyaltyProgram {
    enabled: boolean;
    pointsPerPeso: number; // Points earned per peso spent
    pesosPerPoint: number; // Peso value per point
    minPointsToRedeem: number;
    expirationDays: number;
}

export interface CustomerLoyalty {
    clientId: string;
    pointsBalance: number;
    totalEarned: number;
    totalRedeemed: number;
    transactions: LoyaltyTransaction[];
}

export interface LoyaltyTransaction {
    id: string;
    fecha: string;
    tipo: 'earned' | 'redeemed' | 'expired';
    puntos: number;
    ventaId?: string;
    descripcion: string;
}

const PROGRAM_KEY = 'sellast_loyalty_program';
const LOYALTY_KEY = 'sellast_customer_loyalty';

const defaultProgram: LoyaltyProgram = {
    enabled: true,
    pointsPerPeso: 1, // 1 point per peso
    pesosPerPoint: 0.10, // Each point worth $0.10
    minPointsToRedeem: 100,
    expirationDays: 365
};

export function getLoyaltyProgram(): LoyaltyProgram {
    if (typeof window === 'undefined') return defaultProgram;
    const stored = localStorage.getItem(PROGRAM_KEY);
    return stored ? JSON.parse(stored) : defaultProgram;
}

export function updateLoyaltyProgram(updates: Partial<LoyaltyProgram>): LoyaltyProgram {
    const current = getLoyaltyProgram();
    const updated = { ...current, ...updates };
    localStorage.setItem(PROGRAM_KEY, JSON.stringify(updated));
    return updated;
}

export function getCustomerLoyalty(clientId: string): CustomerLoyalty {
    if (typeof window === 'undefined') return { clientId, pointsBalance: 0, totalEarned: 0, totalRedeemed: 0, transactions: [] };

    const stored = localStorage.getItem(LOYALTY_KEY);
    const all: Record<string, CustomerLoyalty> = stored ? JSON.parse(stored) : {};

    return all[clientId] || { clientId, pointsBalance: 0, totalEarned: 0, totalRedeemed: 0, transactions: [] };
}

export function earnPoints(clientId: string, saleAmount: number, ventaId: string): number {
    const program = getLoyaltyProgram();
    if (!program.enabled) return 0;

    const pointsEarned = Math.floor(saleAmount * program.pointsPerPeso);

    const stored = localStorage.getItem(LOYALTY_KEY);
    const all: Record<string, CustomerLoyalty> = stored ? JSON.parse(stored) : {};

    const customer = all[clientId] || { clientId, pointsBalance: 0, totalEarned: 0, totalRedeemed: 0, transactions: [] };

    customer.pointsBalance += pointsEarned;
    customer.totalEarned += pointsEarned;
    customer.transactions.push({
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        tipo: 'earned',
        puntos: pointsEarned,
        ventaId,
        descripcion: `Puntos por compra de $${saleAmount.toFixed(2)}`
    });

    all[clientId] = customer;
    localStorage.setItem(LOYALTY_KEY, JSON.stringify(all));

    return pointsEarned;
}

export function redeemPoints(clientId: string, points: number): { success: boolean; discount: number } {
    const program = getLoyaltyProgram();
    const customer = getCustomerLoyalty(clientId);

    if (!program.enabled || points < program.minPointsToRedeem || points > customer.pointsBalance) {
        return { success: false, discount: 0 };
    }

    const discount = points * program.pesosPerPoint;

    const stored = localStorage.getItem(LOYALTY_KEY);
    const all: Record<string, CustomerLoyalty> = stored ? JSON.parse(stored) : {};

    customer.pointsBalance -= points;
    customer.totalRedeemed += points;
    customer.transactions.push({
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        tipo: 'redeemed',
        puntos: points,
        descripcion: `Canje de ${points} puntos por $${discount.toFixed(2)}`
    });

    all[clientId] = customer;
    localStorage.setItem(LOYALTY_KEY, JSON.stringify(all));

    return { success: true, discount };
}

export function getAllCustomersLoyalty(): CustomerLoyalty[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(LOYALTY_KEY);
    const all: Record<string, CustomerLoyalty> = stored ? JSON.parse(stored) : {};
    return Object.values(all);
}
