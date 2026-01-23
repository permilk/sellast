// ============================================
// BRANCH STORE - Multi-Sucursal State
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Branch {
    id: string;
    name: string;
    code: string;
    address?: string;
    phone?: string;
    isMain: boolean;
    isActive: boolean;
}

interface BranchState {
    // All available branches
    branches: Branch[];

    // Currently selected branch
    currentBranchId: string | null;
    currentBranch: Branch | null;

    // Actions
    setBranches: (branches: Branch[]) => void;
    setCurrentBranch: (branchId: string) => void;
    addBranch: (branch: Branch) => void;
    updateBranch: (id: string, data: Partial<Branch>) => void;
    deleteBranch: (id: string) => void;
}

// Demo branches
const DEMO_BRANCHES: Branch[] = [
    {
        id: 'branch-1',
        name: 'Sucursal Centro',
        code: 'SUC001',
        address: 'Av. Principal #123, Centro',
        phone: '555-1234',
        isMain: true,
        isActive: true
    },
    {
        id: 'branch-2',
        name: 'Sucursal Norte',
        code: 'SUC002',
        address: 'Blvd. Norte #456, Col. Industrial',
        phone: '555-5678',
        isMain: false,
        isActive: true
    },
    {
        id: 'branch-3',
        name: 'Sucursal Sur',
        code: 'SUC003',
        address: 'Calle Sur #789, Zona Comercial',
        phone: '555-9012',
        isMain: false,
        isActive: true
    }
];

export const useBranchStore = create<BranchState>()(
    persist(
        (set, get) => ({
            branches: DEMO_BRANCHES,
            currentBranchId: DEMO_BRANCHES[0].id,
            currentBranch: DEMO_BRANCHES[0],

            setBranches: (branches) => set({ branches }),

            setCurrentBranch: (branchId) => {
                const branch = get().branches.find(b => b.id === branchId);
                set({
                    currentBranchId: branchId,
                    currentBranch: branch || null
                });
            },

            addBranch: (branch) => set((state) => ({
                branches: [...state.branches, branch]
            })),

            updateBranch: (id, data) => set((state) => ({
                branches: state.branches.map(b =>
                    b.id === id ? { ...b, ...data } : b
                )
            })),

            deleteBranch: (id) => set((state) => ({
                branches: state.branches.filter(b => b.id !== id)
            }))
        }),
        {
            name: 'sellast-branch-store'
        }
    )
);
