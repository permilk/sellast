'use client';

// ============================================
// ACTIVITY LOGS STORE - Registro de Actividad
// ============================================

export type ActivityType =
    | 'login' | 'logout'
    | 'sale_created' | 'sale_cancelled' | 'sale_refund'
    | 'product_created' | 'product_updated' | 'product_deleted'
    | 'inventory_adjusted' | 'inventory_count'
    | 'client_created' | 'client_updated'
    | 'cash_open' | 'cash_close' | 'cash_movement'
    | 'invoice_created' | 'invoice_cancelled'
    | 'user_created' | 'user_updated' | 'permission_changed'
    | 'config_changed' | 'backup_created';

export interface ActivityLog {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    type: ActivityType;
    module: string;
    action: string;
    details: string;
    ipAddress?: string;
    metadata?: Record<string, unknown>;
}

const STORAGE_KEY = 'sellast_activity_logs';
const MAX_LOGS = 1000; // Keep last 1000 logs

const activityLabels: Record<ActivityType, { label: string; icon: string; color: string }> = {
    login: { label: 'Inicio de Sesión', icon: '🔓', color: '#10B981' },
    logout: { label: 'Cierre de Sesión', icon: '🔒', color: '#6B7280' },
    sale_created: { label: 'Venta Registrada', icon: '💰', color: '#3B82F6' },
    sale_cancelled: { label: 'Venta Cancelada', icon: '❌', color: '#EF4444' },
    sale_refund: { label: 'Devolución', icon: '↩️', color: '#F59E0B' },
    product_created: { label: 'Producto Creado', icon: '📦', color: '#10B981' },
    product_updated: { label: 'Producto Actualizado', icon: '✏️', color: '#3B82F6' },
    product_deleted: { label: 'Producto Eliminado', icon: '🗑️', color: '#EF4444' },
    inventory_adjusted: { label: 'Ajuste de Inventario', icon: '📊', color: '#F59E0B' },
    inventory_count: { label: 'Conteo Físico', icon: '📋', color: '#7C3AED' },
    client_created: { label: 'Cliente Creado', icon: '👤', color: '#10B981' },
    client_updated: { label: 'Cliente Actualizado', icon: '✏️', color: '#3B82F6' },
    cash_open: { label: 'Apertura de Caja', icon: '🏦', color: '#10B981' },
    cash_close: { label: 'Cierre de Caja', icon: '🔐', color: '#6B7280' },
    cash_movement: { label: 'Movimiento de Caja', icon: '💵', color: '#F59E0B' },
    invoice_created: { label: 'Factura Emitida', icon: '📄', color: '#3B82F6' },
    invoice_cancelled: { label: 'Factura Cancelada', icon: '❌', color: '#EF4444' },
    user_created: { label: 'Usuario Creado', icon: '👥', color: '#10B981' },
    user_updated: { label: 'Usuario Actualizado', icon: '✏️', color: '#3B82F6' },
    permission_changed: { label: 'Permisos Modificados', icon: '🔑', color: '#7C3AED' },
    config_changed: { label: 'Configuración Cambiada', icon: '⚙️', color: '#6B7280' },
    backup_created: { label: 'Respaldo Creado', icon: '💾', color: '#10B981' }
};

export function getActivityLabel(type: ActivityType) {
    return activityLabels[type] || { label: type, icon: '📝', color: '#6B7280' };
}

export function getLogs(limit?: number): ActivityLog[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    const logs: ActivityLog[] = stored ? JSON.parse(stored) : [];
    return limit ? logs.slice(0, limit) : logs;
}

export function addLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog {
    const logs = getLogs();

    const newLog: ActivityLog = {
        ...log,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
    };

    logs.unshift(newLog);

    // Keep only last MAX_LOGS
    const trimmed = logs.slice(0, MAX_LOGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    return newLog;
}

export function getLogsByUser(userId: string, limit?: number): ActivityLog[] {
    const logs = getLogs();
    const filtered = logs.filter(l => l.userId === userId);
    return limit ? filtered.slice(0, limit) : filtered;
}

export function getLogsByType(type: ActivityType, limit?: number): ActivityLog[] {
    const logs = getLogs();
    const filtered = logs.filter(l => l.type === type);
    return limit ? filtered.slice(0, limit) : filtered;
}

export function getLogsByModule(module: string, limit?: number): ActivityLog[] {
    const logs = getLogs();
    const filtered = logs.filter(l => l.module === module);
    return limit ? filtered.slice(0, limit) : filtered;
}

export function getLogsByDateRange(startDate: string, endDate: string): ActivityLog[] {
    const logs = getLogs();
    return logs.filter(l => {
        const logDate = new Date(l.timestamp).toISOString().split('T')[0];
        return logDate >= startDate && logDate <= endDate;
    });
}

export function clearOldLogs(daysToKeep: number = 90): number {
    const logs = getLogs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const filtered = logs.filter(l => new Date(l.timestamp) >= cutoffDate);
    const removed = logs.length - filtered.length;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return removed;
}
