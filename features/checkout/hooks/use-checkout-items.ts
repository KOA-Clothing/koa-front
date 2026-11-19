"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore, type CheckoutMode } from "@/stores/checkout-store";
import type { CartItem } from "@/types/cart";

interface CheckoutItems {
  items: CartItem[];
  mode: CheckoutMode;
  /**
   * False until both persisted stores have been rehydrated. The checkout page
   * renders a skeleton while this is false so it never flashes an "empty
   * checkout" before the cart lines are read from localStorage.
   */
  isReady: boolean;
}

/**
 * Resolves what the checkout page is actually ordering.
 *
 * - "cart"     → every line in the persisted cart.
 * - "buy-now"  → only the single item captured from the product page.
 *
 * Both stores use `skipHydration`, so they are rehydrated here rather than
 * during render (reading localStorage during render is a hydration mismatch).
 */
export function useCheckoutItems(): CheckoutItems {
  const [isReady, setIsReady] = useState(false);

  const mode = useCheckoutStore((state) => state.mode);
  const buyNowItem = useCheckoutStore((state) => state.buyNowItem);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    let active = true;

    void Promise.all([
      Promise.resolve(useCheckoutStore.persist.rehydrate()),
      Promise.resolve(useCartStore.persist.rehydrate()),
    ]).finally(() => {
      if (active) setIsReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  const items =
    mode === "buy-now" && buyNowItem ? [buyNowItem] : cartItems;

  return { items, mode, isReady };
}
