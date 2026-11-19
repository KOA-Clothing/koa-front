"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import {
  calculatePriceBreakdown,
  formatPrice,
} from "@/components/shop-front/Product-details/product-info";
import { describeCartVariant, type CartItem } from "@/types/cart";

interface OrderSummaryItemProps {
  item: CartItem;
}

/**
 * Read-only checkout line. Renders the stored cart snapshot — never re-fetches
 * a product — and shows the line total the customer is about to pay.
 */
export default function OrderSummaryItem({ item }: OrderSummaryItemProps) {
  const [hasFailed, setHasFailed] = useState(false);
  const { finalPrice } = calculatePriceBreakdown(
    item.sellingPrice,
    item.discountPercentage
  );

  const variantLabel = describeCartVariant(item);
  const showImage = !!item.imageUrl && !hasFailed;

  return (
    <li className="flex gap-3 py-3 first:pt-0 last:pb-0">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl!}
            alt={item.imageAlt}
            onError={() => setHasFailed(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-4" aria-hidden="true" />
            <span className="sr-only">No image</span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-sm font-medium text-foreground">
          {item.productName}
        </p>
        {variantLabel && (
          <p className="truncate text-xs text-muted-foreground">
            {variantLabel}
          </p>
        )}
        <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
      </div>

      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
        {formatPrice(finalPrice * item.quantity)}
      </span>
    </li>
  );
}
