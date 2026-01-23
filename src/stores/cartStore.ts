'use client';

// ============================================
// CART STORE - ZUSTAND
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variantId?: string;
    variantName?: string;
}

interface CartState {
    items: CartItem[];

    // Actions
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;

    // Computed
    getTotal: () => number;
    getSubtotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (i) => i.id === item.id && i.variantId === item.variantId
                    );

                    if (existingIndex > -1) {
                        const newItems = [...state.items];
                        newItems[existingIndex].quantity += item.quantity;
                        return { items: newItems };
                    }

                    return { items: [...state.items, item] };
                });
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id)
                }));
            },

            updateQuantity: (id, quantity) => {
                if (quantity < 1) {
                    get().removeItem(id);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    )
                }));
            },

            clearCart: () => {
                set({ items: [] });
            },

            getSubtotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            getTotal: () => {
                const subtotal = get().getSubtotal();
                const tax = subtotal * 0.16; // IVA Mexico
                return subtotal + tax;
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            }
        }),
        {
            name: 'sellast-cart',
            storage: createJSONStorage(() => localStorage)
        }
    )
);
