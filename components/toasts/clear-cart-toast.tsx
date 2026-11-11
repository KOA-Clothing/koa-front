"use client";

import toast from "react-hot-toast";
import { BroomSparkles, BrushCleaning, Bubbles, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClearCartToastProps {
  /**
   * react-hot-toast mounts a `toast.custom` node already visible and only
   * flips `visible` to false when it is dismissed, keeping the node mounted
   * for `removeDelay` — that flip is what drives the exit animation.
   */
  visible?: boolean;
  /** Dismisses this toast (the caller wires `toast.dismiss(t.id)`). */
  onDismiss: () => void;
}

/**
 * Cart icon with a cleaning badge, matching the badge composition used by the
 * add/remove cart toasts. Lucide 1.31 has no `MopSparkles`, so the closest
 * cleaning glyph (`BroomSparkles`) stands in.
 */
function ClearCartIcon() {
  return (
    <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-100">
      <ShoppingCart className="size-5" aria-hidden="true" />
      <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 ring-2 ring-zinc-900">
        <Bubbles className="size-3" aria-hidden="true" />
      </span>
    </div>
  );
}

/**
 * Confirms that every line was removed from the cart. Same dark card and
 * enter/exit keyframes as `cart-toast.tsx`, but with nothing item-specific to
 * report.
 */
function ClearCartToast({ visible = true, onDismiss }: ClearCartToastProps) {
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-[min(92vw,22rem)] items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3 pr-1.5 text-zinc-100 shadow-2xl",
        visible
          ? "animate-in fade-in-0 zoom-in-95 slide-in-from-top-3 duration-300 ease-out motion-reduce:animate-none"
          : "animate-out fade-out-0 zoom-out-95 slide-out-to-top-3 duration-200 ease-in fill-mode-forwards motion-reduce:animate-none motion-reduce:opacity-0"
      )}
    >
      <ClearCartIcon />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-0.5">
        <p className="text-sm font-semibold text-zinc-100">Cart cleared</p>
        <p className="truncate text-sm text-zinc-300">
          All items have been removed from your cart.
        </p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="-mt-0.5 -mr-0.5 shrink-0 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
      >
        <X className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}

/**
 * Shown by the cart drawer's "Clear All" action. `removeDelay` matches the
 * card's 200 ms exit animation instead of react-hot-toast's 1000 ms default,
 * which would leave the dismissed node invisible on screen for ~800 ms.
 */
export function showClearCartToast() {
  toast.custom(
    (t) => (
      <ClearCartToast
        visible={t.visible}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ),
    { duration: 3000, removeDelay: 250 }
  );
}
