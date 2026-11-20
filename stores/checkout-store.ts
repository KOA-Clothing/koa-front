"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import type { CheckoutMode } from "@/types/checkout";

interface CheckoutState {
  mode: CheckoutMode;
  buyNowItem: CartItem | null;
  /**
   * The phone sent to PayHere. Persisted because the status page may retry the
   * payment after a reload, and Clerk profiles do not always have a phone.
   */
  contactPhone: string | null;
  /**
   * The order PayHere is currently collecting payment for, and the mode it was
   * started from. The status page uses this to clear the cart only for the
   * order that was actually placed — never for an older completed order the
   * customer happens to revisit.
   */
  pendingOrderId: string | null;
  pendingOrderMode: CheckoutMode | null;
  /** Seeds checkout from the whole cart (the drawer's Checkout button). */
  startCartCheckout: () => void;
  /** Seeds checkout from one product-page selection (Buy Now). */
  startBuyNowCheckout: (item: CartItem) => void;
  setContactPhone: (phone: string) => void;
  /** Records which order/mode the PayHere modal is paying for. */
  setPendingOrder: (orderId: string, mode: CheckoutMode) => void;
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
      contactPhone: null,
      pendingOrderId: null,
      pendingOrderMode: null,

      startCartCheckout: () =>
        set({
          mode: "cart",
          buyNowItem: null,
          contactPhone: null,
          pendingOrderId: null,
          pendingOrderMode: null,
        }),
      startBuyNowCheckout: (item) =>
        set({
          mode: "buy-now",
          buyNowItem: item,
          contactPhone: null,
          pendingOrderId: null,
          pendingOrderMode: null,
        }),
      setContactPhone: (phone) => set({ contactPhone: phone }),
      setPendingOrder: (orderId, mode) =>
        set({ pendingOrderId: orderId, pendingOrderMode: mode }),
      resetCheckout: () =>
        set({
          mode: "cart",
          buyNowItem: null,
          contactPhone: null,
          pendingOrderId: null,
          pendingOrderMode: null,
        }),
    }),
    {
      name: "koa-checkout",
      // Only the order selection, the contact phone and the in-flight order id
      // survive; the actions are rebuilt on load.
      partialize: (state) => ({
        mode: state.mode,
        buyNowItem: state.buyNowItem,
        contactPhone: state.contactPhone,
        pendingOrderId: state.pendingOrderId,
        pendingOrderMode: state.pendingOrderMode,
      }),
      // Rehydrated in a client effect (see `useCheckoutItems`) so the server
      // HTML and the first client render agree.
      skipHydration: true,
    }
  )
);
