"use client";

import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUrlState, type UrlParamSchema } from "@/hooks/use-url-state";
import {
  SHOP_DEFAULT_PAGE_SIZE,
  SHOP_PAGE_SIZE_OPTIONS,
} from "@/types/pagination";

const PAGINATION_URL_SCHEMA = {
  pageIndex: { kind: "number", min: 1, default: 1 },
  pageSize: {
    kind: "number",
    in: SHOP_PAGE_SIZE_OPTIONS,
    default: SHOP_DEFAULT_PAGE_SIZE,
  },
} as const satisfies UrlParamSchema;

/** The results heading gets this id so paging returns the shopper to the grid. */
const RESULTS_SCROLL_TARGET_ID = "product-results";

interface ProductPaginationProps {
  /** 1-based, matching the .NET list endpoints. */
  pageIndex: number;
  pageSize: number;
  /** Total products across every page, from the search response. */
  totalRecords: number;
}

/**
 * Builds the visible page numbers: first, last, the current page and its
 * neighbours, with an ellipsis wherever the sequence skips more than one page.
 */
export function getPageItems(
  currentPage: number,
  pageCount: number
): (number | "ellipsis")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, pageCount])]
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];

  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) {
      items.push("ellipsis");
    }
    items.push(page);
  });

  return items;
}

/**
 * URL-backed paginator for the shop-front product grid.
 *
 * `?pageIndex=2&pageSize=24` is the single source of truth, which is exactly
 * what the future search hook will read. A page-size change resets the index
 * in the same write, and both actions scroll back to the results heading so
 * the new page doesn't open halfway down the old one.
 */
export default function ProductPagination({
  pageIndex,
  pageSize,
  totalRecords,
}: ProductPaginationProps) {
  const { setParams } = useUrlState(PAGINATION_URL_SCHEMA);

  const pageCount = Math.max(1, Math.ceil(totalRecords / pageSize));
  const canPreviousPage = pageIndex > 1;
  const canNextPage = pageIndex < pageCount;
  const firstItem = totalRecords === 0 ? 0 : (pageIndex - 1) * pageSize + 1;
  const lastItem = Math.min(pageIndex * pageSize, totalRecords);

  const scrollToResults = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    document.getElementById(RESULTS_SCROLL_TARGET_ID)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const goToPage = (page: number) => {
    if (page === pageIndex) return;
    setParams({ pageIndex: page });
    scrollToResults();
  };

  return (
    <nav
      aria-label="Product results pages"
      className="mt-12 flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm tabular-nums text-muted-foreground">
        {totalRecords === 0
          ? "No products to show"
          : `Showing ${firstItem}\u2013${lastItem} of ${totalRecords.toLocaleString()}`}
      </p>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>

          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setParams({ pageIndex: 1, pageSize: Number(value) });
              scrollToResults();
            }}
          >
            <SelectTrigger
              size="sm"
              className="h-9 w-30 rounded-lg"
              aria-label="Products per page"
            >
              {/* `SelectValue` renders the selected item's value by default;
                  pass the visible label explicitly so it always reads as a
                  count rather than a bare number. */}
              <SelectValue placeholder={`${pageSize}`}>
                {pageSize} / page
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="top" align="end">
              {SHOP_PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm tabular-nums text-muted-foreground sm:hidden">
            Page {pageIndex} of {pageCount}
          </span>

          <div className="hidden items-center gap-1 sm:flex">
            {getPageItems(pageIndex, pageCount).map((item, index) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  aria-hidden="true"
                  className="flex size-9 items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="size-4" />
                </span>
              ) : (
                <Button
                  key={item}
                  type="button"
                  variant={item === pageIndex ? "default" : "ghost"}
                  size="sm"
                  onClick={() => goToPage(item)}
                  aria-label={`Go to page ${item}`}
                  aria-current={item === pageIndex ? "page" : undefined}
                  className={cn(
                    "h-9 min-w-9 px-3 tabular-nums",
                    item === pageIndex && "pointer-events-none"
                  )}
                >
                  {item}
                </Button>
              )
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => goToPage(pageIndex - 1)}
              disabled={!canPreviousPage}
              aria-label="Go to previous page"
              className="size-9"
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => goToPage(pageIndex + 1)}
              disabled={!canNextPage}
              aria-label="Go to next page"
              className="size-9"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/** Matches the paginator's height so the footer doesn't jump on hydration. */
export function ProductPaginationFallback() {
  return (
    <div className="mt-12 flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-9 w-64" />
    </div>
  );
}
