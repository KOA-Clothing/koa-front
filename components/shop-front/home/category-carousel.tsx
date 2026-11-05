"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoryCard from "./category-card";
import { shopHrefs } from "@/lib/configs/page-routes";
import { cn } from "@/lib/utils";
import type { CategoryDto } from "@/types/category";

const SKELETON_COUNT = 4;

/**
 * One line of cards that scrolls horizontally on narrow screens and lays out
 * as four equal columns on wider ones.
 */
const CARD_ROW_CLASSES =
  "flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0";

const CARD_SIZING_CLASSES = "w-40 shrink-0 snap-start md:w-auto";

interface CategoryCarouselProps {
  categories: CategoryDto[];
  /** Requested page, used for the arrow enabled state. */
  pageIndex: number;
  /** Page the visible cards belong to, used to key the slide animation. */
  loadedPageIndex: number;
  totalPages: number;
  onPageChange: (pageIndex: number) => void;
  isLoading?: boolean;
  isFetching?: boolean;
}

/**
 * Side-arrow carousel for the landing page's category tiles.
 *
 * The previous/next buttons sit at the outer corners instead of below the
 * grid, so paging reads as a horizontal swipe. Each page's cards are keyed to
 * the loaded page, which lets the incoming cards slide in from the direction
 * of travel once the new data arrives.
 */
export default function CategoryCarousel({
  categories,
  pageIndex,
  loadedPageIndex,
  totalPages,
  onPageChange,
  isLoading = false,
  isFetching = false,
}: CategoryCarouselProps) {
  // Set at click time so the incoming page's slide animation matches the
  // arrow that was pressed, without tracking the previous page in state.
  const [direction, setDirection] = useState<"next" | "previous">("next");

  const goToPage = (nextPage: number) => {
    setDirection(nextPage > pageIndex ? "next" : "previous");
    onPageChange(nextPage);
  };

  const canGoPrevious = pageIndex > 1;
  const canGoNext = pageIndex < totalPages;

  return (
    <div aria-busy={isFetching} className="flex items-center gap-2 md:gap-4">
      <button
        type="button"
        onClick={() => goToPage(pageIndex - 1)}
        disabled={!canGoPrevious}
        aria-label="Previous categories"
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-foreground/40 hover:bg-muted disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:size-10"
      >
        <ChevronLeft className="size-4" />
      </button>

      <div className="min-w-0 flex-1 overflow-hidden">
        {isLoading ? (
          <div className={CARD_ROW_CLASSES} aria-hidden="true">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  CARD_SIZING_CLASSES,
                  "min-h-44 animate-pulse rounded-xl border border-border bg-muted md:rounded-2xl"
                )}
              />
            ))}
          </div>
        ) : (
          <div
            key={loadedPageIndex}
            className={cn(
              CARD_ROW_CLASSES,
              "transition-opacity",
              isFetching && "opacity-60",
              direction === "next"
                ? "animate-in fade-in slide-in-from-right-4 duration-300 motion-reduce:animate-none"
                : "animate-in fade-in slide-in-from-left-4 duration-300 motion-reduce:animate-none"
            )}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                href={shopHrefs.searchByCategory(category.id)}
                title={category.name}
                subtitle={
                  category.description?.trim() ||
                  `Explore our ${category.name.toLowerCase()} range.`
                }
                className={CARD_SIZING_CLASSES}
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => goToPage(pageIndex + 1)}
        disabled={!canGoNext}
        aria-label="Next categories"
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-foreground/40 hover:bg-muted disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:size-10"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
