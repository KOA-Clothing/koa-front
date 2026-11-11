"use client";

import toast from "react-hot-toast";
import type { CartItem } from "@/types/cart";
import CartToast from "./cart-toast";

/**
 * Confirms a removal from the cart. Slightly shorter than the add toast — the
 * removal is already visible in the drawer that is open in front of it.
 *
 * `removeDelay` matches the card's 200 ms exit animation; see
 * `add-to-cart-toast.tsx` for why it is shortened from the 1000 ms default.
 */
export function showRemoveFromCartToast(item: CartItem) {
  toast.custom(
    (t) => (
      <CartToast
        variant="removed"
        item={item}
        visible={t.visible}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ),
    { duration: 3000, removeDelay: 250 }
  );
}
