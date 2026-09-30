"use client";

import { useState } from "react";
import ColorSwatch from "@/components/general/koa-color-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { adminListHrefs } from "@/lib/configs/page-routes";
import { ProductImageDto } from "@/types/product-image";
import { ExternalLink, ImageOff, PaintBucket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductImageItemProps {
  image: ProductImageDto;
}

/**
 * One image card in the product-images gallery.
 *
 * Image-first on purpose: this replaced a 10px thumbnail in a list row, because
 * the admin's job here is judging whether the shot and the color it's labelled
 * with are right. So the image is the full card width at a 4:3 crop, and the
 * color it belongs to is the loudest piece of metadata under it.
 *
 * Read-only by design: the product-images API exposes create but no update or
 * delete route, so a card's only per-image affordances are navigation — the
 * paint bucket drills into the color facet, and the external link opens the
 * stored file. Adding an image is a product-level action, so it lives in the
 * page header rather than on every card.
 */
export default function KoaProductImageItem({ image }: ProductImageItemProps) {
  const router = useRouter();

  // A presigned storage URL can 404 after expiry, and a gallery is exactly
  // where that shows up — one dead tile in a grid of live ones reads as a bug
  // rather than a missing file, so it gets an explicit empty state.
  const [hasFailed, setHasFailed] = useState(false);

  const handleViewColor = () => {
    // An untagged image has no color to drill into, so the button is not
    // rendered at all rather than navigating to a filter with no id.
    if (!image.color) return;
    router.push(adminListHrefs.colors({ colorId: image.color.id }));
  };

  return (
    <Item
      variant="outline"
      className="flex-col items-stretch gap-0 overflow-hidden rounded-xl p-0"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        {hasFailed ? (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-6" />
            <span className="text-xs">Image unavailable</span>
          </div>
        ) : (
          /* A plain <img> rather than `next/image`: these are presigned storage
             hosts and `next.config.ts` declares no `images.remotePatterns` for
             them, which `next/image` requires. */
          <img
            src={image.imageUrl}
            alt={
              image.altText ??
              (image.color ? `${image.color.name} product image` : "Product image")
            }
            onError={() => setHasFailed(true)}
            className="size-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        )}

        {image.isPrimary && (
          <Badge className="absolute right-2 top-2 shadow-sm">Primary</Badge>
        )}
      </div>

      <ItemContent className="gap-1.5 p-4">
        <div className="flex items-center gap-2">
          {image.color ? (
            <>
              <ColorSwatch color={image.color} className="size-4" />
              <ItemTitle className="min-w-0 flex-1">{image.color.name}</ItemTitle>
            </>
          ) : (
            /* `color` is nullable, so an untagged image is a real state on this
               screen and gets named rather than left blank. */
            <ItemTitle className="min-w-0 flex-1 text-muted-foreground">
              No color
            </ItemTitle>
          )}

          <ItemActions className="shrink-0 gap-1">
            {image.color && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleViewColor}
                title="View color"
              >
                <PaintBucket className="size-3.5" />
                <span className="sr-only">View color</span>
              </Button>
            )}
            <Button variant="ghost" size="icon-sm" title="Open image">
              <Link
                href={image.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-3.5" />
                <span className="sr-only">Open image in new tab</span>
              </Link>
            </Button>
          </ItemActions>
        </div>

        <ItemDescription className="line-clamp-2">
          {image.altText ?? "No alt text"}
        </ItemDescription>

        <span className="text-xs text-muted-foreground">
          Added {new Date(image.createdAt).toLocaleDateString()}
        </span>
      </ItemContent>
    </Item>
  );
}
