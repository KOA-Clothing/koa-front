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
import { ExternalLink, ImageOff, Loader2, PaintBucket, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductImageItemProps {
  image: ProductImageDto;
  /**
   * Opens the delete confirmation. A callback rather than the mutation itself so
   * the confirmation dialog is owned by the page, matching how the gallery page
   * owns the add-image modal — and so the card doesn't render a dialog per tile.
   */
  onDelete?: (image: ProductImageDto) => void;
  /**
   * How many images this product has. Only `1` changes anything: the backend
   * refuses to delete a product's last image, because a product with no images
   * has no shop-front cart shot and no way to promote a replacement.
   *
   * The gallery holds the whole collection, so the page can answer this without
   * a request — it just passes the count down.
   */
  imageCount?: number;
}

/**
 * One image card in the product-images gallery.
 *
 * Image-first on purpose: this replaced a 10px thumbnail in a list row, because
 * the admin's job here is judging whether the shot and the color it's labelled
 * with are right. So the image is the full card width at a 4:3 crop, and the
 * color it belongs to is the loudest piece of metadata under it.
 *
 * Two mutating actions live here, set-primary and delete, because both target
 * one specific image and have no meaning without it. The other two affordances
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
 *
 * Delete sits beside it as an icon button, unlike set-primary. The difference is
 * reversibility: set-primary is one click over a state the admin can click back
 * out of, whereas delete removes the row outright — so it goes through a
 * confirmation dialog instead, which is where the "this cannot be undone" warning
 * belongs. It keeps its icon treatment because the dialog, not the glyph, is what
 * makes it safe, and destructive tinting separates it from the navigation icons.
 *
 * ## Deleting a primary image
 *
 * The backend promotes another image in the same call, so an admin never has to
 * re-pick a primary by hand. If the deleted image is the product's *only* one
 * there is nothing to promote, so the delete is refused — a product with no
 * images has no shop-front cart shot, and no route back to one without an upload.
 * That last case is disabled here rather than left to fail on submit, since the
 * gallery already knows the count; see `imageCount`.
 */
export default function KoaProductImageItem({
  image,
  onDelete,
  imageCount,
}: ProductImageItemProps) {
  const router = useRouter();
  // Set-primary is fired here because it needs nothing but the image. Delete is
  // not: it confirms in the page's modal, reached through `onDelete`.
  const { changePrimary } = useProductImageMutations();

  // A presigned storage URL can 404 after expiry, and a gallery is exactly
  // where that shows up — one dead tile in a grid of live ones reads as a bug
  // rather than a missing file, so it gets an explicit empty state.
  const [hasFailed, setHasFailed] = useState(false);

  // The last image is undeletable: the backend rejects it, and it would leave a
  // product with no shop-front image and no candidate to promote. Mirrors the
  // server rule rather than replacing it — the API stays the authority, this only
  // stops the admin reaching a dead end.
  const isOnlyImage = imageCount === 1;

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
            {!image.isPrimary && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleChangePrimary}
                disabled={changePrimary.isPending}
                title="Use this image as the product's primary — the one the shop-front shows in the cart"
              >
                {changePrimary.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Star className="size-3.5" />
                )}
                <span className="sr-only">Make primary</span>
              </Button>
            )}
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
            {/* Kept mounted but disabled rather than hidden. A product's only image
                can't be deleted — the backend refuses it, because removing it would
                leave a product with no cart shot and nothing to promote from. Hiding
                the control would leave an admin wondering why this one card differs
                from its neighbours, and `title` on a disabled button doesn't always
                surface; `sr-only` text is what actually reaches a screen reader. */}
            <Button
              variant="ghost"
              size="icon-sm"
              // Wrapped, because `onClick` would otherwise hand Base UI's click
              // event to a callback expecting the image — and the same typed
              // position is why it can't just be `onClick={onDelete}`.
              onClick={() => onDelete?.(image)}
              disabled={isOnlyImage}
              title={
                isOnlyImage
                  ? "This is the product's only image — add another before deleting this one"
                  : "Delete image"
              }
              // The repo's destructive-action treatment for an icon button (see
              // facets/*/columns.tsx). Marks it as a different kind of action from
              // the two navigation buttons above without shouting across a grid.
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">
                {isOnlyImage
                  ? "Delete image (unavailable — this is the product's only image)"
                  : "Delete image"}
              </span>
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
