'use client';

// ============================================
// CLIENTS STORE - LocalStorage based
// ============================================

export interface Client {
    id: string;
    documento: string;
    nombre: string;
    tipo: 'mayorista' | 'minorista';
    telefono: string;
    email: string;
    totalCompras: number;
    // Credit fields
    creditoHabilitado?: boolean;
    limiteCredito?: number;
    saldoCredito?: number; // Current credit balance (what they owe)
    diasCredito?: number; // Credit terms in days
}

const STORAGE_KEY = 'sellast_clients';

const initialClients: Client[] = [
    { id: '1', documento: '45214589', nombre: 'Cristiano Ronaldo', tipo: 'mayorista', telefono: '55 1234 5678', email: 'cr7@email.com', totalCompras: 1700.00 },
    { id: '2', documento: '42201458', nombre: 'Lionel Messi', tipo: 'minorista', telefono: '55 9876 5432', email: 'messi@email.com', totalCompras: 325.00 },
    { id: '3', documento: '45780205', nombre: 'Cristian Cueva', tipo: 'minorista', telefono: '55 5555 1234', email: 'cueva@email.com', totalCompras: 0.00 },
];

export function getClients(): Client[] {
    if (typeof window === 'undefined') return initialClients;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialClients));
        return initialClients;
    }
    return JSON.parse(stored);
}

export function addClient(client: Omit<Client, 'id'>): Client {
    const clients = getClients();
    const id = Date.now().toString();

    const newClient: Client = { ...client, id };
    clients.push(newClient);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));

    return newClient;
}

export function updateClient(id: string, updates: Partial<Client>): Client | null {
    const clients = getClients();
    const index = clients.findIndex(c => c.id === id);

    if (index === -1) return null;

    clients[index] = { ...clients[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));

    return clients[index];
}

export function deleteClient(id: string): boolean {
    const clients = getClients();
    const filtered = clients.filter(c => c.id !== id);

    if (filtered.length === clients.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}
