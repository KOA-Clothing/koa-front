"use client";

import { useState } from "react";
import { ImageOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  calculatePriceBreakdown,
  formatPrice,
} from "@/components/shop-front/Product-details/product-info";
import { clothingSizeLabels } from "@/types/enum-labels";
import type { CartItem as CartItemData } from "@/types/cart";

interface CartItemProps {
  item: CartItemData;
  onRemove: (inventoryId: string) => void;
}

/**
 * A single cart line. Presentational only — quantity merging, clamping and
 * removal all live in the store, so this can be rendered anywhere.
 */
export default function CartItem({ item, onRemove }: CartItemProps) {
  const [hasFailed, setHasFailed] = useState(false);
  const { hasDiscount, finalPrice } = calculatePriceBreakdown(
    item.sellingPrice,
    item.discountPercentage
  );

  const variantLabel = [item.colorName, clothingSizeLabels[item.size]]
    .filter(Boolean)
    .join(" · ");

  const showImage = !!item.imageUrl && !hasFailed;

  return (
    <li className="flex gap-3 py-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
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
            <ImageOff className="size-5" aria-hidden="true" />
            <span className="sr-only">No image</span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {item.productName}
          </p>
          <button
            type="button"
            onClick={() => onRemove(item.inventoryId)}
            aria-label={`Remove ${item.productName} from cart`}
            className={cn(
              "-mt-1 -mr-1 shrink-0 rounded-md p-1 text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            )}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {variantLabel && (
          <p className="truncate text-xs text-muted-foreground">
            {variantLabel}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1.5">
          <div className="flex flex-col gap-0.5">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {formatPrice(hasDiscount ? finalPrice : item.sellingPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xs tabular-nums text-muted-foreground line-through">
                    {formatPrice(item.sellingPrice)}
                  </span>
                  <span className="rounded-full bg-foreground px-1.5 text-[10px] font-semibold leading-4 text-background">
                    −{Math.round(item.discountPercentage)}%
                  </span>
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              Qty {item.quantity}
            </span>
          </div>

          {item.quantity > 1 && (
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {formatPrice(finalPrice * item.quantity)}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
