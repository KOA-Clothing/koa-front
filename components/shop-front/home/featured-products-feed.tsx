"use client";

import { useState } from "react";
import FeaturedProductsSection, {
  FEATURED_PRODUCTS_SECTION_ID,
} from "./featured-products-section";
import { useFeaturedProducts } from "@/features/catalogue/hooks/use-featured-products";

/** Four columns × two rows on the shop-front grid. */
const FEATURED_PRODUCTS_PAGE_SIZE = 4;

/**
 * Data container for the landing page's featured products.
 *
 * Owns the page index and the query so the section below stays presentational,
 * and hides the section entirely when the backend has nothing featured — an
 * empty "Featured Essentials" block is worse than no block at all.
 */
export default function FeaturedProductsFeed() {
  const [pageIndex, setPageIndex] = useState(1);

  const { data, isLoading, isFetching } = useFeaturedProducts({
    pageIndex,
    pageSize: FEATURED_PRODUCTS_PAGE_SIZE,
  });

  const totalRecords = data?.totalRecords ?? 0;

  const handlePageChange = (nextPage: number) => {
    if (nextPage === pageIndex) return;

    setPageIndex(nextPage);

    // The pager sits below the grid, so without this the next page would load
    // off-screen above the shopper.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    document.getElementById(FEATURED_PRODUCTS_SECTION_ID)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  if (!isLoading && totalRecords === 0) {
    return null;
  }

  return (
    <FeaturedProductsSection
      products={data?.items ?? []}
      pageIndex={pageIndex}
      totalPages={Math.max(1, data?.totalPages ?? 1)}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
}
