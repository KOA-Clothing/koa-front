"use client";

import ProductCard from "@/components/shop-front/product-card";
import { cn } from "@/lib/utils";
import type { ProductCardDto } from "@/types/product";

const GRID_CLASSES =
  "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4";

/** Two rows of placeholders, matching the initial four-column layout. */
const SKELETON_COUNT = 8;

interface ProductShowcaseGridProps {
  products: ProductCardDto[];
  isLoading?: boolean;
  isFetching?: boolean;
}

/**
 * Product grid shared by the landing page's showcases.
 *
 * Shows skeletons for the first load and dims the current page while a new
 * one is in flight, so paging never blanks the section out.
 */
export default function ProductShowcaseGrid({
  products,
  isLoading = false,
  isFetching = false,
}: ProductShowcaseGridProps) {
  if (isLoading) {
    return (
      <div className={GRID_CLASSES} aria-hidden="true">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <div className="aspect-4/5 w-full animate-pulse rounded-xl bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        GRID_CLASSES,
        "transition-opacity duration-200",
        isFetching && "opacity-60"
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
