"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { shopHrefs } from "@/lib/configs/page-routes";
import {
  calculatePriceBreakdown,
  formatPrice,
} from "@/components/shop-front/Product-details/product-info";
import { describeCartVariant, type CartItem as CartItemData } from "@/types/cart";

interface CartItemProps {
  item: CartItemData;
  onRemove: (inventoryId: string) => void;
  /**
   * Fired when the row is used to open the product page — the drawer passes
   * `closeCart` so the customer lands on the detail page, not on a page with
   * the cart still covering it.
   */
  onNavigate?: () => void;
}

/**
 * A single cart line. Quantity merging, clamping and removal all live in the
 * store; this only renders the snapshot and forwards the two user actions.
 *
 * The whole row is a link to the product detail page, with the remove button
 * kept as a sibling (not nested inside the link) so both stay valid HTML and
 * independently keyboard-reachable.
 */
export default function CartItem({
  item,
  onRemove,
  onNavigate,
}: CartItemProps) {
  const [hasFailed, setHasFailed] = useState(false);
  const { hasDiscount, finalPrice } = calculatePriceBreakdown(
    item.sellingPrice,
    item.discountPercentage
  );

  const variantLabel = describeCartVariant(item);
  const showImage = !!item.imageUrl && !hasFailed;

  return (
    <li className="group relative">
      <Link
        href={shopHrefs.product(item.productId)}
        onClick={onNavigate}
        aria-label={`View ${item.productName} details`}
        className="flex gap-3 py-4 pr-8 rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
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
          <p className="truncate text-sm font-semibold text-foreground group-hover:underline">
            {item.productName}
          </p>

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
      </Link>

      <Button
        type="button"
        variant="ghost"
        onClick={() => onRemove(item.inventoryId)}
        aria-label={`Remove ${item.productName} from cart`}
        className={cn(
          "absolute top-3 right-0 shrink-0 rounded-md p-1 text-muted-foreground transition-colors",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        )}
      >
        <X className="size-4" aria-hidden="true" />
      </Button>
    </li>
  );
}
