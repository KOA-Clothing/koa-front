"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { shopHrefs } from "@/lib/configs/page-routes";
import type { CollectionDto } from "@/types/collection";

interface CollectionCardProps {
  collection: CollectionDto;
}

/**
 * One collection tile on the shop-front catalogue.
 *
 * Image-first like the admin collection card, but stripped to what a customer
 * needs to choose a collection: cover image, name, description, and how many
 * items it holds. The whole tile is the link to `/collection/{id}`, so there is
 * no second "view" target competing with it for the click.
 */
export default function CollectionCard({ collection }: CollectionCardProps) {
  // Cover images are storage-hosted and can 404. One dead tile in a grid of
  // live ones reads as a bug, so it gets an explicit empty state.
  const [hasFailed, setHasFailed] = useState(false);

  const showImage = !!collection.coverImageUrl && !hasFailed;
  const itemLabel = collection.itemCount === 1 ? "item" : "items";

  return (
    <Link
      href={shopHrefs.collection(collection.id)}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        {showImage ? (
          /* A plain <img> rather than `next/image`: cover images are
             storage-hosted URLs and `next.config.ts` declares no
             `images.remotePatterns` for them, which `next/image` requires. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={collection.coverImageUrl as string}
            alt={`${collection.name} collection cover`}
            onError={() => setHasFailed(true)}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-6" />
            <span className="text-xs">
              {hasFailed ? "Image unavailable" : "No cover image"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
          {collection.name}
        </h2>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {collection.description?.trim() || "A curated edit from KOA Clothing."}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            {collection.itemCount} {itemLabel}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          />
        </div>
      </div>
    </Link>
  );
}
