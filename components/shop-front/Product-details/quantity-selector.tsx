"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lower bound of the stepper. 0 reads as "nothing selected yet" — while the
 * count is 0 the parent keeps the Buy Now / Add to Cart actions disabled.
 */
const MIN_QUANTITY = 0;

const stepperButtonClass =
  "flex w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50";

interface QuantitySelectorProps {
  /** Currently selected quantity. */
  quantity: number;
  /**
   * Upper bound — the selected variant's available stock, i.e. its
   * `quantity` minus `reservedQuantity` (already computed by the backend as
   * `availableQuantity`).
   */
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

export default function QuantitySelector({
  quantity,
  maxQuantity,
  onQuantityChange,
}: QuantitySelectorProps) {
  const canDecrease = quantity > MIN_QUANTITY;
  const canIncrease = quantity < maxQuantity;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">Quantity</h3>
      <div
        role="group"
        aria-label="Quantity"
        className="inline-flex h-10 items-stretch self-start rounded-lg border border-border"
      >
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() =>
            onQuantityChange(Math.max(quantity - 1, MIN_QUANTITY))
          }
          disabled={!canDecrease}
          className={cn(stepperButtonClass, "rounded-l-lg")}
        >
          <Minus className="size-4" />
        </button>
        <span
          role="status"
          aria-live="polite"
          className="flex min-w-12 items-center justify-center border-x border-border px-2 text-sm font-semibold tabular-nums text-foreground select-none"
        >
          <span aria-hidden="true">{quantity}</span>
          <span className="sr-only">Quantity {quantity}</span>
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() =>
            onQuantityChange(Math.min(quantity + 1, maxQuantity))
          }
          disabled={!canIncrease}
          className={cn(stepperButtonClass, "rounded-r-lg")}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
