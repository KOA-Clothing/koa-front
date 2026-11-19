"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

/**
 * "cart" checks out every line in `useCartStore`; "buy-now" checks out only
 * the single item captured from the product page. The cart stays the single
 * source of truth for cart lines — Buy Now never silently adds to it.
 */
export type CheckoutMode = "cart" | "buy-now";

interface CheckoutState {
  mode: CheckoutMode;
  buyNowItem: CartItem | null;
  /** Seeds checkout from the whole cart (the drawer's Checkout button). */
  startCartCheckout: () => void;
  /** Seeds checkout from one product-page selection (Buy Now). */
  startBuyNowCheckout: (item: CartItem) => void;
  /** Drops a stale buy-now selection once it is no longer being checked out. */
  resetCheckout: () => void;
}

/**
 * The order-in-progress. Persisted because a signed-out customer is sent
 * through Clerk and comes back on a fresh page load, where the in-memory store
 * would otherwise be empty.
 */
export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      mode: "cart",
      buyNowItem: null,

      startCartCheckout: () => set({ mode: "cart", buyNowItem: null }),
      startBuyNowCheckout: (item) => set({ mode: "buy-now", buyNowItem: item }),
      resetCheckout: () => set({ mode: "cart", buyNowItem: null }),
    }),
    {
      name: "koa-checkout",
      // Only the order selection survives; the actions are rebuilt on load.
      partialize: (state) => ({
        mode: state.mode,
        buyNowItem: state.buyNowItem,
      }),
      // Rehydrated in a client effect (see `useCheckoutItems`) so the server
      // HTML and the first client render agree.
      skipHydration: true,
    }
  )
);
