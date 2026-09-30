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
import { useProductImageMutations } from "@/features/product-image/hooks/use-product-image-mutations";
import { adminListHrefs } from "@/lib/configs/page-routes";
import { ProductImageDto } from "@/types/product-image";
import { ExternalLink, ImageOff, Loader2, PaintBucket, Star } from "lucide-react";
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
 * Read-only apart from one action: the product-images API exposes create and
 * change-primary, but no update or delete route, so a card's other affordances
 * are navigation — the paint bucket drills into the color facet, the external
 * link opens the stored file. Adding an image is a product-level action, so it
 * lives in the page header rather than on every card.
 *
 * ## Where "Make primary" lives, and why
 *
 * In the content block, below the metadata — not floated over the picture. The
 * image is what the admin is here to judge, and an overlay covers the exact
 * thing being judged; on a grid, that cost is paid on every card at once. Below
 * the image the button also sits with the card's other controls instead of
 * competing with them from a different layer.
 *
 * The "Primary" badge stays on the image, which makes the split deliberate
 * rather than arbitrary: the media carries the *status* ("this is the one"), and
 * the controls below carry the *actions*. A stamp over a picture is the
 * conventional place for that.
 *
 * Two things that stay true wherever it sits:
 *
 * - **Always visible, not revealed on hover.** A hover-revealed control is
 *   undiscoverable and unreachable on touch. This grid is scanned, not explored.
 * - **A text label, not a bare icon.** Setting the storefront's hero image is a
 *   consequential one-click change, which is exactly what an unlabelled glyph
 *   communicates badly. The buttons beside it are pure navigation, so icons are
 *   right for those; this one is different in kind.
 */
export default function KoaProductImageItem({ image }: ProductImageItemProps) {
  const router = useRouter();
  const { changePrimary } = useProductImageMutations();

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

  const handleChangePrimary = () => {
    changePrimary.mutate({
      productId: image.productId,
      newPrimaryImageId: image.id,
    });
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

        {/* Status stays on the image, not in the content block: "this is the
            one" is a property of the picture, and a stamp over the media is the
            conventional place for it. The action that *changes* that status
            lives below with the other controls. */}
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

        {/* Not on the current primary: offering "make primary" on the image that
            already is would be a no-op at best. */}
        {!image.isPrimary && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleChangePrimary}
            disabled={changePrimary.isPending}
            title="Use this image as the product's primary — the one the shop-front shows in the cart"
            className="w-fit gap-1.5"
          >
            {changePrimary.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Star className="size-3.5" />
            )}
            Make primary
          </Button>
        )}
      </ItemContent>
    </Item>
  );
}
