"use client";

import DiscountedProductsSection, {
  DISCOUNTED_PRODUCTS_SECTION_ID,
} from "./discounted-products-section";
import { useDiscountedProducts } from "@/features/catalogue/hooks/use-discounted-products";
import { useShowcasePage } from "@/features/catalogue/hooks/use-showcase-page";

/** Four columns × one row on the shop-front grid. */
const DISCOUNTED_PRODUCTS_PAGE_SIZE = 4;

/**
 * Data container for the landing page's discounted products.
 *
 * Mirrors the featured feed: owns the query and page index, and hides the
 * section entirely when nothing is discounted rather than rendering an empty
 * "Discounted Products" block.
 */
export default function DiscountedProductsFeed() {
  const { pageIndex, goToPage } = useShowcasePage(
    DISCOUNTED_PRODUCTS_SECTION_ID
  );

  const { data, isLoading, isFetching } = useDiscountedProducts({
    pageIndex,
    pageSize: DISCOUNTED_PRODUCTS_PAGE_SIZE,
  });

  if (!isLoading && (data?.totalRecords ?? 0) === 0) {
    return null;
  }

  return (
    <DiscountedProductsSection
      products={data?.items ?? []}
      pageIndex={pageIndex}
      totalPages={Math.max(1, data?.totalPages ?? 1)}
      onPageChange={goToPage}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
}
