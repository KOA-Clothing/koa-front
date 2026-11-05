"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/shop-front/product-card";
import { getPageItems } from "@/components/shop-front/product-pagination";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";
import { cn } from "@/lib/utils";
import type { ProductCardDto } from "@/types/product";

/** Anchor used by the feed's pager to bring the new page into view. */
export const FEATURED_PRODUCTS_SECTION_ID = "featured-products";

const GRID_CLASSES = "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4";

interface FeaturedProductsSectionProps {
  products: ProductCardDto[];
  pageIndex: number;
  totalPages: number;
  onPageChange: (pageIndex: number) => void;
  isLoading?: boolean;
  isFetching?: boolean;
}

/**
 * Landing-page "Featured Essentials" grid.
 *
 * Presentational by design: the feed container (`featured-products-feed.tsx`)
 * owns the query, the page index, and the decision to render this section at
 * all. That keeps this file free of fetch state and makes the pager a plain
 * callback rather than a second source of truth.
 */
export default function FeaturedProductsSection({
  products,
  pageIndex,
  totalPages,
  onPageChange,
  isLoading = false,
  isFetching = false,
}: FeaturedProductsSectionProps) {

  console.log(totalPages)
  return (
    <section
      id={FEATURED_PRODUCTS_SECTION_ID}
      aria-busy={isFetching}
      className="w-full scroll-mt-24 py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-primary" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground font-mono">
                Battle-Ready Gear · 2026 Release
              </p>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Featured Products
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Built for high exertion and timeless aesthetics. Heavyweight cottons, technical 4-way stretch, and zero shortcuts.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-10">
          {isLoading ? (
            <div className={GRID_CLASSES}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-4/5 w-full animate-pulse rounded-xl bg-muted" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Featured products pages"
            className="mt-12 flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onPageChange(pageIndex - 1)}
                disabled={pageIndex <= 1}
                aria-label="Go to previous page"
                className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-foreground/40 hover:bg-muted disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <ChevronLeft className="size-4" />
              </button>

              {getPageItems(pageIndex, totalPages).map((item, index) =>
                item === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    aria-hidden="true"
                    className="flex size-9 items-center justify-center text-xs text-muted-foreground"
                  >
                    &hellip;
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onPageChange(item)}
                    aria-label={`Go to page ${item}`}
                    aria-current={item === pageIndex ? "page" : undefined}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      item === pageIndex
                        ? "bg-foreground text-background"
                        : "border border-border bg-card text-foreground hover:border-foreground/40 hover:bg-muted"
                    )}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => onPageChange(pageIndex + 1)}
                disabled={pageIndex >= totalPages}
                aria-label="Go to next page"
                className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-foreground/40 hover:bg-muted disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <p className="text-xs tabular-nums text-muted-foreground">
              Page {pageIndex} of {totalPages}
            </p>
          </nav>
        )}

        {/* View All CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            href={PAGE_ROUTES.SHOP.SEARCH}
            className="group flex items-center gap-2 rounded-full border border-border bg-card px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-foreground transition-all hover:border-foreground/40 hover:bg-muted hover:shadow-sm"
          >
            Explore Full Catalogue
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
