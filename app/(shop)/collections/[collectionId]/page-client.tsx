"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import ProductCard from "@/components/shop-front/product-card";
import { useCollectionItems } from "@/features/catalogue/hooks/use-collection-items";
import { useCollections } from "@/features/catalogue/hooks/use-collections";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";
import { getErrorMessage } from "@/lib/api/errors";
import { BackButton } from "@/components/shop-front/back-button";

interface CollectionItemsPageClientProps {
  collectionId: string;
}

export default function CollectionItemsPageClient({
  collectionId,
}: CollectionItemsPageClientProps) {
  const {
    data: products,
    isLoading: isProductsLoading,
    isError,
    error,
  } = useCollectionItems(collectionId);

  const { data: collections, isLoading: isCollectionsLoading } = useCollections();
  const collection = collections?.find((c) => c.id === collectionId);

  const productCount = products?.length ?? 0;
  const productNoun = productCount === 1 ? "product" : "products";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <BackButton fallbackUrl={PAGE_ROUTES.SHOP.COLLECTIONS} />

        {/* ── HERO ── */}
        <section className="pb-10 pt-4 md:pb-14">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Collection
          </p>

          {isCollectionsLoading && !collection ? (
            <div className="space-y-4">
              <div className="h-10 w-2/5 animate-pulse rounded bg-muted md:h-14" />
              <div className="h-5 w-3/5 animate-pulse rounded bg-muted" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                {collection?.name || "Collection"}
              </h1>

              {collection?.description && (
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  {collection.description}
                </p>
              )}
            </>
          )}
        </section>

        {/* ── PRODUCTS SECTION ── */}
        <section className="border-t border-border py-10 md:py-14">
          <div className="mb-8 flex items-baseline gap-6">
            <p className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Products
            </p>
            <div className="h-px flex-1 bg-border" aria-hidden="true" />
            {!isProductsLoading && !isError && (
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {productCount} {productNoun}
              </span>
            )}
          </div>

          {isProductsLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-4/5 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-20 text-center">
              <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
              <Link
                href={PAGE_ROUTES.SHOP.COLLECTIONS}
                className="mt-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                Return to collections
              </Link>
            </div>
          ) : productCount === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
              <span className="text-muted-foreground">
                <SearchX className="size-6" />
              </span>
              <h3 className="text-base font-medium text-foreground">
                No products found
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                This collection does not have any products assigned to it yet.
              </p>
              <Link
                href={PAGE_ROUTES.SHOP.COLLECTIONS}
                className="mt-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Browse other collections
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {products!.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
