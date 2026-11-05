"use client";

import CategoryCarousel from "./category-carousel";
import CategoryGridHeader from "./category-grid-header";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";
import { useShopCategories } from "@/features/catalogue/hooks/use-shop-categories";
import { useShowcasePage } from "@/features/catalogue/hooks/use-showcase-page";

/** Anchor the category section can be scrolled to from elsewhere. */
export const CATEGORY_GRID_SECTION_ID = "shop-by-category";

/** One carousel page: four tiles, matching the section's grid. */
const CATEGORY_GRID_PAGE_SIZE = 4;

/**
 * Landing-page "Shop By Category" section.
 *
 * Data container for the public category list: owns the page index and query,
 * and hides the section when there are no categories. Pagination lives in the
 * carousel's side arrows rather than a pager below the cards.
 */
export default function CategoryGrid() {
  const { pageIndex, goToPage } = useShowcasePage(CATEGORY_GRID_SECTION_ID, {
    scroll: false,
  });

  const { data, isLoading, isFetching } = useShopCategories({
    pageIndex,
    pageSize: CATEGORY_GRID_PAGE_SIZE,
  });

  if (!isLoading && (data?.totalRecords ?? 0) === 0) {
    return null;
  }

  return (
    <section
      id={CATEGORY_GRID_SECTION_ID}
      aria-busy={isFetching}
      className="w-full scroll-mt-24 border-t border-border bg-background py-8 md:py-12 border"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <CategoryGridHeader
          eyebrow="Wardrobe Essentials"
          title="Shop By Category"
          action={{
            label: "All Products →",
            href: PAGE_ROUTES.SHOP.SEARCH,
          }}
        />

        <CategoryCarousel
          categories={data?.items ?? []}
          pageIndex={pageIndex}
          loadedPageIndex={data?.pageIndex ?? pageIndex}
          totalPages={Math.max(1, data?.totalPages ?? 1)}
          onPageChange={goToPage}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </section>
  );
}
