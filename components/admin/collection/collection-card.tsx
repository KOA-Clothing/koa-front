"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KoaSwitch } from "@/components/general/koa-switch";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { useCollectionMutations } from "@/features/collection/hooks/use-collection-mutations";
import { adminHrefs } from "@/lib/configs/page-routes";
import { CollectionDto } from "@/types/collection";
import { ExternalLink, ImageOff, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CollectionCardProps {
  collection: CollectionDto;
  /**
   * Opens the edit dialog. A callback rather than the mutation itself so the
   * dialog is owned by the page — the card never renders one per tile.
   */
  onEdit: (collection: CollectionDto) => void;
  /**
   * Opens the delete confirmation. A callback rather than the mutation itself
   * so the confirmation dialog is owned by the page — the card never renders
   * a dialog per tile.
   */
  onDelete: (collection: CollectionDto) => void;
}

/**
 * One collection tile in the admin collections grid.
 *
 * Image-first on purpose: the cover image is the collection's shop-front
 * identity, so it gets the full card width at a 4:3 crop and the name +
 * description sit under it — the same anatomy as `KoaProductImageItem`, which
 * is also how the eventual shop-front card will present the collection, so
 * what the admin judges here is what a customer sees.
 *
 * The whole tile navigates to the collection's product list at
 * `/admin/collections/{id}`. Two things share that job on purpose: the title is
 * a real <Link> (keyboard reachable, middle/modifier-click opens a tab), and
 * the tile pushes the same route for clicks on the media and the surrounding
 * padding. The title's link stops propagation so a click on it never also runs
 * the tile handler, and the action clusters stop propagation for the same
 * reason — using the switch or a button never doubles as "open the collection".
 *
 * The mutating actions live here because both target one specific collection:
 * the active-status switch (active collections are the ones the shop front
 * shows) and delete, which goes through the page's confirmation dialog like
 * every other destructive row action in the admin. Edit hands the collection to
 * the page's edit dialog instead of mutating anything itself.
 */
export default function CollectionCard({
  collection,
  onEdit,
  onDelete,
}: CollectionCardProps) {
  const { toggleActiveStatus } = useCollectionMutations();
  const router = useRouter();

  // A presigned/public storage URL can 404, and one dead tile in a grid of
  // live ones reads as a bug rather than a missing file, so it gets an
  // explicit empty state.
  const [hasFailed, setHasFailed] = useState(false);

  const showImage = !!collection.coverImageUrl && !hasFailed;
  const detailHref = adminHrefs.collectionDetail(collection.id);

  return (
    <Item
      variant="outline"
      onClick={() => router.push(detailHref)}
      className="relative cursor-pointer flex-col items-stretch gap-0 overflow-hidden rounded-xl p-0 transition-colors hover:border-ring/60"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        {showImage ? (
          /* A plain <img> rather than `next/image`: these are storage-hosted
             URLs and `next.config.ts` declares no `images.remotePatterns` for
             them, which `next/image` requires. */
          <img
            src={collection.coverImageUrl as string}
            alt={`${collection.name} cover`}
            onError={() => setHasFailed(true)}
            className="size-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-6" />
            <span className="text-xs">
              {hasFailed ? "Image unavailable" : "No cover image"}
            </span>
          </div>
        )}

        {/* Inactive collections are hidden from the shop front, so that status
            is a property of the card as a whole and gets a stamp on the media —
            the same placement rule as the "Primary" badge on product images. */}
        {!collection.isActive && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 shadow-sm"
          >
            Inactive
          </Badge>
        )}
      </div>

      <ItemContent className="gap-1.5 p-4">
        <div className="flex items-center gap-2">
          <ItemTitle className="min-w-0 flex-1">
            <Link
              href={detailHref}
              onClick={(event) => event.stopPropagation()}
              className="min-w-0 truncate rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {collection.name}
            </Link>
          </ItemTitle>

          <ItemActions
            className="shrink-0 gap-1"
            onClick={(event) => event.stopPropagation()}
          >
            {collection.coverImageUrl && (
              <Button variant="ghost" size="icon-sm" title="Open cover image">
                <Link
                  href={collection.coverImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-3.5" />
                  <span className="sr-only">Open cover image in new tab</span>
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(collection)}
              title="Edit collection"
            >
              <Pencil className="size-3.5" />
              <span className="sr-only">Edit collection</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(collection)}
              title="Delete collection"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">Delete collection</span>
            </Button>
          </ItemActions>
        </div>

        <ItemDescription className="line-clamp-2">
          {collection.description ?? "No description"}
        </ItemDescription>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Added {new Date(collection.createdAt).toLocaleDateString()}
          </span>

          <div
            className="flex items-center gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="text-xs text-muted-foreground">Active</span>
            <KoaSwitch
              checked={collection.isActive}
              onCheckedChange={() => toggleActiveStatus.mutate(collection.id)}
              aria-label={`Toggle active status for ${collection.name}`}
            />
          </div>
        </div>
      </ItemContent>
    </Item>
  );
}
