"use client";

import toast from "react-hot-toast";
import type { CartItem } from "@/types/cart";
import CartToast from "./cart-toast";

/**
 * Confirms an add without opening the drawer.
 *
 * `toast.custom` renders only the given element — the dark `toastOptions.style`
 * from `ToasterProvider` (meant for plain admin toasts) is not applied — so the
 * card is fully styled by `CartToast`.
 */
export function showAddToCartToast(item: CartItem) {
  toast.custom(
    (t) => (
      <CartToast
        variant="added"
        item={item}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ),
    { duration: 3500 }
  );
}
