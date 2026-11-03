import type { Metadata } from "next";
import CollectionCard from "@/components/shop-front/collection-card";
import { mockCollections } from "@/lib/mock/collections";

export const metadata: Metadata = {
  title: "Collections | KOA Clothing",
  description:
    "Shop KOA Clothing by collection — denim, activewear, streetwear, and everyday essentials, each curated around a single idea.",
};

export default function CollectionsPage() {
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
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {mockCollections.length} collections
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
