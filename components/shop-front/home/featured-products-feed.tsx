"use client";

import FeaturedProductsSection, {
  FEATURED_PRODUCTS_SECTION_ID,
} from "./featured-products-section";
import { useFeaturedProducts } from "@/features/catalogue/hooks/use-featured-products";
import { useShowcasePage } from "@/features/catalogue/hooks/use-showcase-page";

/** Four columns × one row on the shop-front grid. */
const FEATURED_PRODUCTS_PAGE_SIZE = 4;

/**
 * Data container for the landing page's featured products.
 *
 * Owns the query so the section stays presentational, and hides the section
 * entirely when the backend has nothing featured — an empty "Featured
 * Products" block is worse than no block at all.
 */
export default function FeaturedProductsFeed() {
  const { pageIndex, goToPage } = useShowcasePage(FEATURED_PRODUCTS_SECTION_ID);

  const { data, isLoading, isFetching } = useFeaturedProducts({
    pageIndex,
    pageSize: FEATURED_PRODUCTS_PAGE_SIZE,
  });

  if (!isLoading && (data?.totalRecords ?? 0) === 0) {
    return null;
  }

  return (
    <FeaturedProductsSection
      products={data?.items ?? []}
      pageIndex={pageIndex}
      totalPages={Math.max(1, data?.totalPages ?? 1)}
      onPageChange={goToPage}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
}
