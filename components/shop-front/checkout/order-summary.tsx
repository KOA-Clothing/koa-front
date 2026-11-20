"use client";

import { useMemo } from "react";
import {
  CircleCheckBig,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  calculatePriceBreakdown,
  formatPrice,
} from "@/components/shop-front/Product-details/product-info";
import type { CartItem } from "@/types/cart";
import OrderSummaryItem from "./order-summary-item";

interface OrderSummaryProps {
  items: CartItem[];
  onPlaceOrder: () => void;
  canPlaceOrder: boolean;
  isBuyNow: boolean;
  /** An order is being created / the PayHere modal is open. */
  isProcessing: boolean;
  /** `window.payhere` has loaded. Place Order stays disabled until it has. */
  isSdkReady: boolean;
}

/**
 * The money column. Sticky on desktop so the total and the Place Order action
 * stay visible while the customer works through the address form.
 */
export default function OrderSummary({
  items,
  onPlaceOrder,
  canPlaceOrder,
  isBuyNow,
  isProcessing,
  isSdkReady,
}: OrderSummaryProps) {
  const { subtotal, itemsTotal, itemCount } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const { finalPrice } = calculatePriceBreakdown(
          item.sellingPrice,
          item.discountPercentage
        );

        acc.subtotal += item.sellingPrice * item.quantity;
        acc.itemsTotal += finalPrice * item.quantity;
        acc.itemCount += item.quantity;

        return acc;
      },
      { subtotal: 0, itemsTotal: 0, itemCount: 0 }
    );
  }, [items]);

  const savings = subtotal - itemsTotal;

  // Mirrors `PlaceOrderHandler`: free delivery above LKR 10,000, otherwise a
  // flat LKR 350. This must match the server's `TotalAmount`, because PayHere
  // charges the server-calculated amount, not this display value.
  const deliveryCharges = itemsTotal > 10000 ? 0 : 350;
  const grandTotal = itemsTotal + deliveryCharges;

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="flex flex-col rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-1 border-b border-border p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              Order summary
            </h2>
            {isBuyNow && <Badge variant="outline">Buy now</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>

        <ul className="divide-y divide-border p-4">
          {items.map((item) => (
            <OrderSummaryItem key={item.inventoryId} item={item} />
          ))}
        </ul>

        <div className="flex flex-col gap-4 border-t border-border p-4">
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums text-foreground">
                {formatPrice(subtotal)}
              </span>
            </div>

            {savings > 0 && (
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-muted-foreground">Discount</span>
                <span className="tabular-nums text-foreground">
                  −{formatPrice(savings)}
                </span>
              </div>
            )}

            <div className="flex items-baseline justify-between gap-2">
              <span className="text-muted-foreground">Delivery Charges</span>
              <span className="tabular-nums text-foreground">{formatPrice(deliveryCharges)}</span>
            </div>

            <div className="flex items-baseline justify-between gap-2 border-t border-border pt-2">
              <span className="text-base font-semibold text-foreground">
                Total
              </span>
              <span className="text-base font-semibold tabular-nums text-foreground">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={onPlaceOrder}
            disabled={!canPlaceOrder || isProcessing || !isSdkReady}
          >
            {isProcessing ? (
              <Loader2
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <CircleCheckBig className="mr-2 size-4" aria-hidden="true" />
            )}
            {isProcessing
              ? "Opening PayHere…"
              : !isSdkReady
                ? "Preparing secure payment…"
                : "Place order"}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" color="green" />
            {isSdkReady
              ? "Secure checkout - card details are entered in PayHere."
              : "Loading PayHere secure checkout…"}
          </p>
        </div>
      </div>
    </aside>
  );
}
