import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import ProductCard from "@/components/shop-front/product-card";
import ProductPagination, {
  ProductPaginationFallback,
} from "@/components/shop-front/product-pagination";
import ProductSearchBar, {
  ProductSearchBarFallback,
} from "@/components/shop-front/product-search-bar";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";
import { mockProductCards } from "@/lib/mock/products";
import {
  SHOP_DEFAULT_PAGE_SIZE,
  SHOP_PAGE_SIZE_OPTIONS,
} from "@/types/pagination";

export const metadata: Metadata = {
  title: "Search | KOA Clothing",
  description:
    "Search the KOA Clothing wardrobe — performance layers, denim, and everyday essentials built to move with you.",
};

function readString(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

function readPageIndex(value: string | string[] | undefined, fallback = 1) {
  const parsed = Number(readString(value));
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : fallback;
}

function readPageSize(value: string | string[] | undefined) {
  const parsed = Number(readString(value));
  return (SHOP_PAGE_SIZE_OPTIONS as readonly number[]).includes(parsed)
    ? parsed
    : SHOP_DEFAULT_PAGE_SIZE;
}

export default async function ProductSearchPage({
  searchParams,
}: PageProps<"/search">) {
  const params = await searchParams;

  const searchTerm = readString(params.search).trim();
  const normalizedSearch = searchTerm.toLowerCase();
  const requestedPageIndex = readPageIndex(params.pageIndex);
  const pageSize = readPageSize(params.pageSize);

  /**
   * Temporary local search over the mock catalogue. The real endpoint will
   * replace this block; everything below it (clamping, slicing, pagination
   * props) is already in the shape the API page will return.
   */
  const matchingProducts = normalizedSearch
    ? mockProductCards.filter((product) =>
        `${product.name} ${product.category.name}`
          .toLowerCase()
          .includes(normalizedSearch)
      )
    : mockProductCards;

  const totalRecords = matchingProducts.length;
  const pageCount = Math.max(1, Math.ceil(totalRecords / pageSize));
  const pageIndex = Math.min(requestedPageIndex, pageCount);
  const startIndex = (pageIndex - 1) * pageSize;
  const products = matchingProducts.slice(startIndex, startIndex + pageSize);
  const resultNoun = totalRecords === 1 ? "product" : "products";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<ProductSearchBarFallback />}>
        <ProductSearchBar />
      </Suspense>

      <section
        id="product-results"
        aria-labelledby="product-results-heading"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 md:px-8 md:py-14"
      >
        <div className="mb-8 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {searchTerm ? "Search results" : "The collection"}
            </p>
            <h2
              id="product-results-heading"
              className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
            >
              {searchTerm ? (
                <>
                  Results for{" "}
                  <span className="text-muted-foreground">
                    &ldquo;{searchTerm}&rdquo;
                  </span>
                </>
              ) : (
                "All products"
              )}
            </h2>
          </div>

          <p className="text-sm tabular-nums text-muted-foreground">
            {totalRecords === 0
              ? "No matches"
              : `${totalRecords} ${resultNoun}`}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
            <span className="text-muted-foreground">
              <SearchX className="size-6" />
            </span>
            <h3 className="text-base font-medium text-foreground">
              No products found
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {searchTerm
                ? `Nothing matched “${searchTerm}”. Try a broader term, or browse the full catalogue.`
                : "The catalogue is empty right now. Check back soon for new pieces."}
            </p>
            {searchTerm && (
              <Link
                href={PAGE_ROUTES.SHOP.SEARCH}
                className="mt-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Clear search
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {totalRecords > 0 && (
          <Suspense fallback={<ProductPaginationFallback />}>
            <ProductPagination
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalRecords={totalRecords}
            />
          </Suspense>
        )}
      </section>
    </main>
  );
}
