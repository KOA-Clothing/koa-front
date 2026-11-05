"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPageItems } from "@/components/shop-front/product-pagination";
import { cn } from "@/lib/utils";

interface SectionPagerProps {
  pageIndex: number;
  totalPages: number;
  onPageChange: (pageIndex: number) => void;
  /** Accessible name for this pager, e.g. "Discounted Products pages". */
  label: string;
}

/**
 * Compact prev / numbered / next pager for a landing-page showcase.
 *
 * Renders nothing for a single page, and delegates the page change to the feed
 * so scrolling and query state stay in one place.
 */
export default function SectionPager({
  pageIndex,
  totalPages,
  onPageChange,
  label,
}: SectionPagerProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label={label} className="mt-12 flex flex-col items-center gap-3">
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
  );
}
