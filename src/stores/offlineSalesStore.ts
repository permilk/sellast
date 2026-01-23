// ============================================
// OFFLINE SALES STORE - IndexedDB for offline queue
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OfflineSale {
    localId: string;
    data: any;
    timestamp: number;
    synced: boolean;
    syncError?: string;
}

interface OfflineSalesState {
    // Pending sales queue
    pendingSales: OfflineSale[];

    // Connection status
    isOnline: boolean;
    lastSyncAttempt: number | null;

    // Actions
    addOfflineSale: (saleData: any) => string;
    markAsSynced: (localId: string) => void;
    markAsFailed: (localId: string, error: string) => void;
    removeSale: (localId: string) => void;
    clearSyncedSales: () => void;
    setOnlineStatus: (status: boolean) => void;
    syncPendingSales: () => Promise<void>;
}

export const useOfflineSalesStore = create<OfflineSalesState>()(
    persist(
        (set, get) => ({
            pendingSales: [],
            isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
            lastSyncAttempt: null,

            addOfflineSale: (saleData) => {
                const localId = `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                set((state) => ({
                    pendingSales: [
                        ...state.pendingSales,
                        {
                            localId,
                            data: saleData,
                            timestamp: Date.now(),
                            synced: false
                        }
                    ]
                }));

                return localId;
            },

            markAsSynced: (localId) => {
                set((state) => ({
                    pendingSales: state.pendingSales.map(sale =>
                        sale.localId === localId ? { ...sale, synced: true } : sale
                    )
                }));
            },

            markAsFailed: (localId, error) => {
                set((state) => ({
                    pendingSales: state.pendingSales.map(sale =>
                        sale.localId === localId ? { ...sale, syncError: error } : sale
                    )
                }));
            },

            removeSale: (localId) => {
                set((state) => ({
                    pendingSales: state.pendingSales.filter(sale => sale.localId !== localId)
                }));
            },

            clearSyncedSales: () => {
                set((state) => ({
                    pendingSales: state.pendingSales.filter(sale => !sale.synced)
                }));
            },

            setOnlineStatus: (status) => {
                set({ isOnline: status });

                // Auto-sync when back online
                if (status) {
                    get().syncPendingSales();
                }
            },

            syncPendingSales: async () => {
                const { pendingSales, markAsSynced, markAsFailed, clearSyncedSales } = get();
                const unsynced = pendingSales.filter(s => !s.synced && !s.syncError);

                if (unsynced.length === 0) return;

                set({ lastSyncAttempt: Date.now() });

                for (const sale of unsynced) {
                    try {
                        const response = await fetch('/api/v1/sales', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(sale.data)
                        });

                        if (response.ok) {
                            markAsSynced(sale.localId);
                        } else {
                            const error = await response.json();
                            markAsFailed(sale.localId, error.error || 'Error de sincronización');
                        }
                    } catch (error) {
                        // Still offline, will retry later
                        console.log('[Offline] Sync failed, will retry:', error);
                    }
                }

                // Clean up synced sales
                setTimeout(() => clearSyncedSales(), 5000);
            }
        }),
        {
            name: 'sellast-offline-sales',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

// Hook for online/offline detection
export function useOnlineStatus() {
    const { isOnline, setOnlineStatus, pendingSales, syncPendingSales } = useOfflineSalesStore();

    if (typeof window !== 'undefined') {
        window.addEventListener('online', () => setOnlineStatus(true));
        window.addEventListener('offline', () => setOnlineStatus(false));
    }

    return {
        isOnline,
        pendingCount: pendingSales.filter(s => !s.synced).length,
        syncNow: syncPendingSales
    };
}
