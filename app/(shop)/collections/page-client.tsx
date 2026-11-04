"use client";

import { LayoutGrid } from "lucide-react";
import CollectionCard from "@/components/shop-front/collection-card";
import { useCollections } from "@/features/catalogue/hooks/use-collections";

export default function CollectionsPageClient() {
  const { data: collections, isLoading } = useCollections();

  const count = collections?.length ?? 0;
  const collectionNoun = count === 1 ? "collection" : "collections";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* ── HERO ── */}
        <section className="pb-12 pt-12 md:pb-16 md:pt-20">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Shop by collection
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Collections
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Curated edits from the KOA wardrobe. Every collection is built
            around a single idea — pick the one that fits how you move.
          </p>
        </section>

        {/* ── CATALOGUE ── */}
        <section className="border-t border-border py-12 md:py-16">
          <div className="mb-8 flex items-baseline gap-6">
            <p className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              The catalogue
            </p>
            <div className="h-px flex-1 bg-border" aria-hidden="true" />
            {!isLoading && (
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {count} {collectionNoun}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-border"
                >
                  <div className="aspect-4/3 w-full animate-pulse bg-muted" />
                  <div className="flex flex-col gap-3 p-5">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : count === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
              <LayoutGrid className="size-6 text-muted-foreground" />
              <h3 className="text-base font-medium text-foreground">
                No collections yet
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Collections are being curated. Check back soon for new drops.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collections!.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
