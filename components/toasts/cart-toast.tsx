"use client";

import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { describeCartVariant, type CartItem } from "@/types/cart";

export type CartToastVariant = "added" | "removed";

interface CartToastProps {
  variant: CartToastVariant;
  item: Pick<CartItem, "productName" | "colorName" | "size" | "quantity">;
  /**
   * react-hot-toast never animates a `toast.custom` node itself: it mounts it
   * already visible and removes it outright. It does, however, keep the node
   * mounted for `removeDelay` after dismissal with `visible: false`, which is
   * the only signal available for playing an exit animation.
   */
  visible?: boolean;
  /** Dismisses this toast (the caller wires `toast.dismiss(t.id)`). */
  onDismiss: () => void;
}

const titles: Record<CartToastVariant, string> = {
  added: "Added to cart",
  removed: "Removed from cart",
};

/**
 * Lucide ships a plain `ShoppingCart` but no plus/minus cart glyphs, so the
 * action is a small badge on the cart icon instead of a second icon set.
 */
function CartActionIcon({ variant }: { variant: CartToastVariant }) {
  const ActionIcon = variant === "added" ? Plus : Minus;

  return (
    <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
      <ShoppingCart className="size-5" aria-hidden="true" />
      <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-foreground text-background ring-2 ring-popover">
        <ActionIcon className="size-3" strokeWidth={3} aria-hidden="true" />
      </span>
    </div>
  );
}

/**
 * Shared card for the add/remove cart toasts. Rendered through
 * `toast.custom`, so it owns the whole surface — border, background, shadow,
 * and its own enter/exit animation — and must keep `pointer-events-auto`,
 * because the toaster container disables pointer events.
 *
 * Animations are keyframes (`animate-in` / `animate-out` from
 * `tw-animate-css`), not transitions: a transition would never run on mount,
 * because the node is inserted at its final state and nothing changes
 * afterwards.
 */
export default function CartToast({
  variant,
  item,
  visible = true,
  onDismiss,
}: CartToastProps) {
  const meta = [describeCartVariant(item), `Qty ${item.quantity}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-[min(92vw,22rem)] items-center gap-5 rounded-xl border border-border bg-popover p-3 pr-1.5 text-popover-foreground shadow-lg",
        visible
          ? "animate-in fade-in-0 zoom-in-95 slide-in-from-top-3 duration-300 ease-out motion-reduce:animate-none"
          : "animate-out fade-out-0 zoom-out-95 slide-out-to-top-3 duration-200 ease-in fill-mode-forwards motion-reduce:animate-none motion-reduce:opacity-0"
      )}
    >
      <CartActionIcon variant={variant} />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-0.5">
        <p className="text-sm font-semibold text-foreground">
          {titles[variant]}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {item.productName}
        </p>
        <p className="truncate text-xs text-muted-foreground">{meta}</p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="-mt-0.5 -mr-0.5 shrink-0 text-muted-foreground"
      >
        <X className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}
