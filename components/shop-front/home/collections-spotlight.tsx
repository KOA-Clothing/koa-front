"use client";

import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import CollectionCard from "@/components/shop-front/collection-card";
import { useCollections } from "@/features/catalogue/hooks/use-collections";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";
import type { CollectionDto } from "@/types/collection";

// Curated collections displayed when catalogue collections are loading or initial
const FALLBACK_COLLECTIONS: CollectionDto[] = [
  {
    id: "col-combat-division",
    name: "The Combat Division",
    description: "Built for brutal training. Reinforced shoulder seams, heavyweight cotton drape, and oversized cuts.",
    coverImageUrl: "/hero-images/hero-1.jpg",
    isActive: true,
    displayOrder: 1,
    itemCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "col-stealth-activewear",
    name: "Stealth Activewear",
    description: "Zero distraction. 4-way elastic stretch, hyper-wicking fabric matrix, and anti-chafe athletic construction.",
    coverImageUrl: "/hero-images/hero-2.jpg",
    isActive: true,
    displayOrder: 2,
    itemCount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "col-core-essentials",
    name: "Core Warrior Essentials",
    description: "Clean lines, honest weights, neutral palettes. The foundation pieces that transition from gym floor to city streets.",
    coverImageUrl: "/hero-images/hero-3.jpg",
    isActive: true,
    displayOrder: 3,
    itemCount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function CollectionsSpotlight() {
  const { data: collections, isLoading } = useCollections();

  const liveCollections = collections ?? [];
  const hasLive = liveCollections.length > 0;
  const displayCollections = hasLive ? liveCollections.slice(0, 3) : FALLBACK_COLLECTIONS;

  return (
    <section className="w-full border-t border-border bg-muted/20 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Layers className="size-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground font-mono">
                Curated Drops · The Series
              </p>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Signature Collections
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Every collection is engineered around a specific discipline. Pick the uniform that fits how you move.
            </p>
          </div>

          <Link
            href={PAGE_ROUTES.SHOP.COLLECTIONS}
            className="group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-foreground transition-colors hover:text-muted-foreground"
          >
            All Collections
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Collections Grid */}
        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-border bg-card"
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
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayCollections.map((col) => (
                <CollectionCard key={col.id} collection={col} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
