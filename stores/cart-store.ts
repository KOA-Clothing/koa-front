"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  /** Drawer visibility. Deliberately not persisted — a reload starts closed. */
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (inventoryId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        if (item.quantity <= 0) return;

        set((state) => {
          const existing = state.items.find(
            (entry) => entry.inventoryId === item.inventoryId
          );

          // The same inventory row is the same product/colour/size, so merge
          // the counts instead of stacking duplicate lines — clamped to the
          // stock ceiling captured when the line was first added.
          if (existing) {
            const maxQuantity = Math.min(
              existing.maxQuantity,
              item.maxQuantity
            );

            return {
              items: state.items.map((entry) =>
                entry.inventoryId === item.inventoryId
                  ? {
                      ...entry,
                      quantity: Math.min(
                        entry.quantity + item.quantity,
                        maxQuantity
                      ),
                      maxQuantity,
                    }
                  : entry
              ),
            };
          }

          return { items: [...state.items, item] };
        });
      },

      removeItem: (inventoryId) =>
        set((state) => ({
          items: state.items.filter(
            (entry) => entry.inventoryId !== inventoryId
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "koa-cart",
      // Only the lines survive a reload; the drawer must start closed.
      partialize: (state) => ({ items: state.items }),
      // Rehydrated in a client effect (see `CartSheet`) so the server HTML and
      // the first client render agree. Reading localStorage during render is
      // the classic Next.js hydration mismatch.
      skipHydration: true,
    }
  )
);
