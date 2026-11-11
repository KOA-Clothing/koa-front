"use client";

import toast from "react-hot-toast";
import type { CartItem } from "@/types/cart";
import CartToast from "./cart-toast";

/**
 * Confirms a removal from the cart. Slightly shorter than the add toast — the
 * removal is already visible in the drawer that is open in front of it.
 */
export function showRemoveFromCartToast(item: CartItem) {
  toast.custom(
    (t) => (
      <CartToast
        variant="removed"
        item={item}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ),
    { duration: 3000 }
  );
}
