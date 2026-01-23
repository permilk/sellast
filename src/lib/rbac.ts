// ============================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// ============================================

export type Role = 'admin' | 'gerente' | 'cajero' | 'almacenista';

export interface Permission {
    module: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

// Definición de accesos por rol
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
    admin: [
        'dashboard',
        'pos',
        'ventas',
        'productos',
        'inventario',
        'clientes',
        'proveedores',
        'compras',
        'caja',
        'finanzas',
        'gastos',
        'reportes',
        'facturas',
        'cotizaciones',
        'usuarios',
        'configuracion',
        'lealtad',
        'lotes',
        'conciliacion',
        'actividad'
    ],
    gerente: [
        'dashboard',
        'pos',
        'ventas',
        'productos',
        'inventario',
        'clientes',
        'proveedores',
        'compras',
        'caja',
        'reportes',
        'facturas',
        'cotizaciones',
        'lealtad',
        'lotes'
    ],
    cajero: [
        'dashboard',
        'pos',
        'ventas',
        'clientes',
        'caja'
    ],
    almacenista: [
        'dashboard',
        'productos',
        'inventario',
        'proveedores',
        'compras',
        'lotes'
    ]
};

// Títulos legibles para cada rol
export const ROLE_TITLES: Record<Role, string> = {
    admin: 'Administrador',
    gerente: 'Gerente',
    cajero: 'Cajero',
    almacenista: 'Almacenista'
};

// Colores de badge por rol
export const ROLE_COLORS: Record<Role, { bg: string; text: string }> = {
    admin: { bg: 'rgba(99, 102, 241, 0.2)', text: '#818CF8' },
    gerente: { bg: 'rgba(16, 185, 129, 0.2)', text: '#34D399' },
    cajero: { bg: 'rgba(245, 158, 11, 0.2)', text: '#FBBF24' },
    almacenista: { bg: 'rgba(139, 92, 246, 0.2)', text: '#A78BFA' }
};

// Verificar si un rol tiene acceso a un módulo
export function hasAccess(role: Role, module: string): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    if (!permissions) return false;
    return permissions.includes(module);
}

// Obtener módulos accesibles para un rol
export function getAccessibleModules(role: Role): string[] {
    return ROLE_PERMISSIONS[role] || [];
}

// Mapeo de rutas a módulos
export const ROUTE_TO_MODULE: Record<string, string> = {
    '/admin': 'dashboard',
    '/admin/pos': 'pos',
    '/admin/ventas': 'ventas',
    '/admin/ventas/historial': 'ventas',
    '/admin/productos': 'productos',
    '/admin/productos/nuevo': 'productos',
    '/admin/categorias': 'productos',
    '/admin/atributos': 'productos',
    '/admin/caracteristicas': 'productos',
    '/admin/complementos': 'productos',
    '/admin/inventario': 'inventario',
    '/admin/inventario/conteo-fisico': 'inventario',
    '/admin/clientes': 'clientes',
    '/admin/proveedores': 'proveedores',
    '/admin/compras': 'compras',
    '/admin/compras/recepcion': 'compras',
    '/admin/caja': 'caja',
    '/admin/finanzas': 'finanzas',
    '/admin/gastos': 'gastos',
    '/admin/reportes': 'reportes',
    '/admin/facturas': 'facturas',
    '/admin/cotizaciones': 'cotizaciones',
    '/admin/cotizaciones/nuevo': 'cotizaciones',
    '/admin/usuarios': 'usuarios',
    '/admin/configuracion': 'configuracion',
    '/admin/lealtad': 'lealtad',
    '/admin/lotes': 'lotes',
    '/admin/conciliacion': 'conciliacion',
    '/admin/actividad': 'actividad',
    '/admin/pedidos': 'ventas',
    '/admin/devoluciones': 'ventas',
    '/admin/vencimientos': 'inventario'
};

// Verificar si un rol tiene acceso a una ruta
export function hasRouteAccess(role: Role, path: string): boolean {
    const module = ROUTE_TO_MODULE[path];
    if (!module) return true; // Si no está mapeado, permitir por defecto
    return hasAccess(role, module);
}
