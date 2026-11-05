"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageOff, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { shopHrefs } from "@/lib/configs/page-routes";
import { ProductStatusEnum } from "@/types/enums";
import { productStatusLabels } from "@/types/enum-labels";
import type { ProductCardDto } from "@/types/product";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Status is a property of the product, not of the tile, so it is stamped on
 * the media. `Available` is deliberately blank: a badge that says "everything
 * is fine" is noise on every card in the grid.
 */
const statusBadgeClasses: Record<ProductStatusEnum, string> = {
  [ProductStatusEnum.Draft]: "bg-foreground/90 text-background",
  [ProductStatusEnum.Discontinued]: "bg-destructive text-white",
  [ProductStatusEnum.OutOfStock]: "bg-amber-400 text-amber-950",
  [ProductStatusEnum.Available]: "",
};

interface ProductCardProps {
  product: ProductCardDto;
}

/**
 * One product tile on the shop-front search / catalogue grid.
 *
 * Customer-facing only: cover image, category, name, price, and the signals
 * that change a buying decision — a live discount, a non-available status, and
 * whether the piece is featured. Cost price, descriptions and inventory live on
 * the admin card, not here.
 *
 * `sellingPrice` is the pre-discount price (the same reading as
 * `calculatePriceBreakdown`), so a discounted tile shows the final price in
 * bold with the original struck through beside it.
 */
export default function ProductCard({ product }: ProductCardProps) {
  // Storage-hosted covers can 404. One dead tile in a live grid reads as a
  // bug, so it gets an explicit empty state instead of a broken-image icon.
  const [hasFailed, setHasFailed] = useState(false);

  const showImage = !!product.coverImageUrl && !hasFailed;
  const hasDiscount = product.discountPercentage > 0;
  const finalPrice = product.sellingPrice * (1 - product.discountPercentage / 100);
  const statusLabel =
    product.status === ProductStatusEnum.Available
      ? null
      : productStatusLabels[product.status];

  return (
    <Link
      href={shopHrefs.product(product.id)}
      className="group border border-transparent hover:border-border transition-colors duration-200 ease-in-out p-1 flex flex-col rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"    >
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-muted">
        {showImage ? (
          /* A plain <img> rather than `next/image`: covers are storage-hosted
             URLs and `next.config.ts` declares no `images.remotePatterns` for
             them, which `next/image` requires. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.coverImageUrl as string}
            alt={`${product.name} — ${product.category.name}`}
            onError={() => setHasFailed(true)}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-6" />
            <span className="text-xs">
              {hasFailed ? "Image unavailable" : "No image"}
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between gap-2">
          {/* Left stack: status and curation signals. An empty stack still
              occupies the left slot, keeping the discount pinned right. */}
          <div className="flex flex-col items-start gap-1.5">
            {statusLabel && (
              <Badge
                className={cn(
                  "h-5 border-transparent px-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] shadow-sm",
                  statusBadgeClasses[product.status]
                )}
              >
                {statusLabel}
              </Badge>
            )}

            {product.isFeatured && (
              <Badge className="h-5 gap-1 border-transparent bg-foreground px-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-background shadow-sm">
                <Sparkles aria-hidden="true" />
                Featured
              </Badge>
            )}
          </div>

          {hasDiscount && (
            <Badge className="h-5 border-transparent bg-white px-2.5 text-[0.65rem] font-semibold tabular-nums text-neutral-950 shadow-sm ring-1 ring-black/10">
              −{Math.round(product.discountPercentage)}%
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 pt-3 ml-2">
        <div className="flex min-w-0 items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span className="truncate">{product.category.name}</span>
        </div>

        <h3 className="line-clamp-2 text-sm font-medium leading-snug tracking-tight text-foreground decoration-1 underline-offset-4 group-hover:underline">
          {product.name}
        </h3>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {currencyFormatter.format(hasDiscount ? finalPrice : product.sellingPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs tabular-nums text-muted-foreground line-through">
              {currencyFormatter.format(product.sellingPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
