import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import ColorSwatch from "@/components/general/koa-color-badge";
import { adminListHrefs } from "@/lib/configs/page-routes";
import { ProductImageDto } from "@/types/product-image";
import { ExternalLink, PaintBucket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductImageItemProps {
  image: ProductImageDto;
}

/**
 * One row of the "view product images" modal.
 *
 * Read-only by design — the product-images API currently exposes no
 * create/update/delete route, so there is nothing to mutate here yet. The two
 * affordances it does have are navigation, matching `KoaProductVariantItem`:
 * the color name drills into the color facet, and the thumbnail opens the
 * stored file at full size.
 */
export default function KoaProductImageItem({ image }: ProductImageItemProps) {
  const router = useRouter();

  const handleViewColor = () => {
    router.push(adminListHrefs.colors({ colorId: image.color.id }));
  };

  return (
    <Item variant="outline" className="rounded-xl p-4">
      {/* Media: `variant="image"` gives the rounded/cover treatment for a
          thumbnail. A plain <img> is used rather than `next/image` because
          these URLs are presigned storage hosts and `next.config.ts` declares
          no `images.remotePatterns` for them. */}
      <ItemMedia variant="image" className="translate-y-0 self-center">
        <img
          src={image.imageUrl}
          alt={image.altText ?? `${image.color.name} product image`}
          className="size-full object-cover"
        />
      </ItemMedia>

      {/* Content: min-w-0 lets a long alt text truncate via line-clamp. */}
      <ItemContent className="min-w-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleViewColor}
            title="View color"
          >
            <PaintBucket className="size-3.5" />
            <span className="sr-only">View color</span>
          </Button>
          <ColorSwatch color={image.color} className="size-4" />
          <ItemTitle>{image.color.name}</ItemTitle>
          {image.isPrimary && <Badge variant="secondary">Primary</Badge>}
        </div>
        <ItemDescription className="mt-1">
          {image.altText ?? "No alt text"}
        </ItemDescription>
      </ItemContent>

      <ItemActions className="shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          title="Open image"
        >
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
    </Item>
  );
}
