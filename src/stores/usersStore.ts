'use client';

// ============================================
// USERS STORE - LocalStorage based with Roles
// ============================================

export type UserRole = 'admin' | 'gerente' | 'cajero' | 'almacenista' | 'contador';

export interface UserPermissions {
    pos: boolean;
    productos: boolean;
    inventario: boolean;
    clientes: boolean;
    proveedores: boolean;
    compras: boolean;
    ventas: boolean;
    caja: boolean;
    facturas: boolean;
    reportes: boolean;
    gastos: boolean;
    configuracion: boolean;
    usuarios: boolean;
}

export interface User {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    rol: UserRole;
    estado: 'activo' | 'inactivo';
    avatar?: string;
    fechaCreacion: string;
    ultimoAcceso?: string;
    permisos: UserPermissions;
}

const STORAGE_KEY = 'sellast_users';

// Default permissions by role
export const defaultPermissionsByRole: Record<UserRole, UserPermissions> = {
    admin: {
        pos: true, productos: true, inventario: true, clientes: true,
        proveedores: true, compras: true, ventas: true, caja: true,
        facturas: true, reportes: true, gastos: true, configuracion: true, usuarios: true
    },
    gerente: {
        pos: true, productos: true, inventario: true, clientes: true,
        proveedores: true, compras: true, ventas: true, caja: true,
        facturas: true, reportes: true, gastos: true, configuracion: false, usuarios: false
    },
    cajero: {
        pos: true, productos: false, inventario: false, clientes: true,
        proveedores: false, compras: false, ventas: true, caja: true,
        facturas: true, reportes: false, gastos: false, configuracion: false, usuarios: false
    },
    almacenista: {
        pos: false, productos: true, inventario: true, clientes: false,
        proveedores: true, compras: true, ventas: false, caja: false,
        facturas: false, reportes: false, gastos: false, configuracion: false, usuarios: false
    },
    contador: {
        pos: false, productos: false, inventario: false, clientes: true,
        proveedores: true, compras: true, ventas: true, caja: true,
        facturas: true, reportes: true, gastos: true, configuracion: false, usuarios: false
    }
};

const roleLabels: Record<UserRole, string> = {
    admin: 'Administrador',
    gerente: 'Gerente',
    cajero: 'Cajero',
    almacenista: 'Almacenista',
    contador: 'Contador'
};

export function getRoleLabel(role: UserRole): string {
    return roleLabels[role] || role;
}

const initialUsers: User[] = [
    {
        id: '1',
        nombre: 'Admin Principal',
        email: 'admin@sellast.com',
        telefono: '55 1234 5678',
        rol: 'admin',
        estado: 'activo',
        fechaCreacion: '2026-01-01',
        ultimoAcceso: '2026-01-23',
        permisos: defaultPermissionsByRole.admin
    },
    {
        id: '2',
        nombre: 'María García',
        email: 'maria@sellast.com',
        telefono: '55 9876 5432',
        rol: 'cajero',
        estado: 'activo',
        fechaCreacion: '2026-01-10',
        ultimoAcceso: '2026-01-22',
        permisos: defaultPermissionsByRole.cajero
    },
    {
        id: '3',
        nombre: 'Juan López',
        email: 'juan@sellast.com',
        telefono: '55 5555 1234',
        rol: 'almacenista',
        estado: 'activo',
        fechaCreacion: '2026-01-15',
        permisos: defaultPermissionsByRole.almacenista
    }
];

export function getUsers(): User[] {
    if (typeof window === 'undefined') return initialUsers;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
        return initialUsers;
    }
    return JSON.parse(stored);
}

export function getUserById(id: string): User | null {
    const users = getUsers();
    return users.find(u => u.id === id) || null;
}

export function addUser(user: Omit<User, 'id' | 'fechaCreacion' | 'permisos'>): User {
    const users = getUsers();
    const id = Date.now().toString();

    const newUser: User = {
        ...user,
        id,
        fechaCreacion: new Date().toISOString().split('T')[0],
        permisos: defaultPermissionsByRole[user.rol]
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

    return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return null;

    // If role changes, update permissions to default for new role
    if (updates.rol && updates.rol !== users[index].rol) {
        updates.permisos = defaultPermissionsByRole[updates.rol];
    }

    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

    return users[index];
}

export function updateUserPermissions(id: string, permisos: Partial<UserPermissions>): User | null {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return null;

    users[index].permisos = { ...users[index].permisos, ...permisos };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

    return users[index];
}

export function deleteUser(id: string): boolean {
    const users = getUsers();
    const filtered = users.filter(u => u.id !== id);

    if (filtered.length === users.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}

export function getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('sellast_current_user');
    return stored ? JSON.parse(stored) : getUsers()[0]; // Default to first user (admin)
}

export function setCurrentUser(user: User): void {
    localStorage.setItem('sellast_current_user', JSON.stringify(user));
}

export function hasPermission(permission: keyof UserPermissions): boolean {
    const user = getCurrentUser();
    return user?.permisos?.[permission] ?? false;
}
