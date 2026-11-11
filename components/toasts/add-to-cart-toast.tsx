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
 *
 * `removeDelay` is set to just past the card's 200 ms exit animation: it is the
 * window react-hot-toast keeps the dismissed node mounted for, and it defaults
 * to 1000 ms, which would leave the card invisible on screen for ~800 ms and
 * make the next toast feel laggy.
 */
export function showAddToCartToast(item: CartItem) {
  toast.custom(
    (t) => (
      <CartToast
        variant="added"
        item={item}
        visible={t.visible}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ),
    { duration: 3500, removeDelay: 250 }
  );
}
