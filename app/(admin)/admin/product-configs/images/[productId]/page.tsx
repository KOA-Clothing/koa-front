"use client";

import { ReactNode, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import CreateProductImageModal from "@/components/admin/product-image/modals/create-product-image-modal";
import { BaseShirtIcon } from "@/components/general/custom-icons/base-shirt-icon";
import KoaProductImageItem from "@/components/general/koa-product-image-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductColors } from "@/features/color/hooks/use-colors";
import { useProductImagesByProduct } from "@/features/product-image/hooks/use-product-images";
import { getErrorMessage, isNotFoundError } from "@/lib/api/errors";
import {
  adminListHrefs,
  PAGE_ROUTES,
} from "@/lib/configs/page-routes";
import { ProductImageDto } from "@/types/product-image";
import type { ColorDto } from "@/types/color";
import { BookImage, ChevronLeft, ImageOff, ImagePlus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

/** Cards per row: one on mobile, widening to four on very wide screens. */
const GALLERY_GRID = "grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

/** Stable empty list, so the modal's `availableColors` prop never changes identity. */
const EMPTY_COLORS: ColorDto[] = [];

/** How many placeholder cards to draw while the request is in flight. */
const SKELETON_COUNT = 8;

/**
 * Gallery of one product's images, at `/admin/product-configs/images/{productId}`.
 *
 * Reached from the "View images" action on the product-images table. That table
 * returns a summary row — counts and swatches, not images — so this page always
 * fetches its own detail and shows a skeleton for a beat. That is the trade for
 * not shipping every image of every row just to draw a table.
 *
 * The product name comes from the response itself (it's the collection's
 * `name`), so the header and the gallery can never disagree about which product
 * is on screen.
 */
export default function ProductImagesDetailPage() {
  const router = useRouter();
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading, isError, error } =
    useProductImagesByProduct(productId);

  // The modal is driven by the product it's adding an image to, so opening it
  // is a single boolean rather than a subject + flag pair.
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // The product's variant colors, for the modal's color select. Gated on the
  // dialog being open: this page has no other use for them, and paying for the
  // request on every gallery visit to populate a select nobody opened is the
  // waste. The dialog still works while this is in flight — `colorId` is
  // nullable, so an image can be added untagged and tagged later.
  const productColors = useProductColors(productId, { enabled: isCreateOpen });

  // A product that exists with zero images comes back 200 + empty `images[]`, so
  // `isError` here means the id genuinely didn't resolve. Worth separating from
  // a transport failure, which is what the other branch reports — the failure
  // envelope gives both statuses the same shape.
  const isNotFound = isError && isNotFoundError(error);
  const isFailed = isError && !isNotFound;

  const handleBaseProductView = () => {
    // The collection's `id` is the base product's own id — a row here is a
    // product with its images nested, not an image.
    if (!product) return;
    router.push(adminListHrefs.baseProducts({ productId: product.id }));
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link href={PAGE_ROUTES.ADMIN.PRODUCT_IMAGES} className="flex flex-row items-center justify-center gap-2">
          <ChevronLeft className="size-3.5" /> All product images
        </Link>
      </Button>

      <PageHeader
        title={product?.name ?? "Product Images"}
        description={describe(product, isLoading)}
        icon={<BookImage />}
      >
        <Button
          onClick={() => setIsCreateOpen(true)}
          disabled={!product}
        >
          <ImagePlus className="size-3.5" />
          Add image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleBaseProductView}
          disabled={!product}
        >
          <BaseShirtIcon className="size-3.5" />
          View Base Product
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className={GALLERY_GRID}>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="flex flex-col overflow-hidden rounded-xl border border-border"
            >
              <Skeleton className="aspect-4/3 w-full rounded-none" />
              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : isFailed ? (
        <Notice icon={<ImageOff className="size-6" />}>
          {getErrorMessage(error)}
        </Notice>
      ) : isNotFound || !product ? (
        <Notice icon={<ImageOff className="size-6" />}>
          This product was not found. It may have been deleted, or the link may
          be wrong.
        </Notice>
      ) : product.images.length === 0 ? (
        <Notice icon={<ImageOff className="size-6" />}>
          No images have been attached to this product yet.
        </Notice>
      ) : (
        <div className={GALLERY_GRID}>
          {product.images.map((image) => (
            <KoaProductImageItem key={image.id} image={image} />
          ))}
        </div>
      )}

      <CreateProductImageModal
        // The gallery already holds the collection, so the modal gets its product
        // from here rather than refetching one just to show a name. The
        // `&& product` guard matters: a cold mount has `product` undefined, and
        // the button that opens this is disabled in that state anyway.
        product={isCreateOpen && product ? product : null}
        // The collection carries no color list — the colors a product is stocked
        // in are variant data. Fetched here and only while the dialog is open,
        // so merely visiting a gallery costs no extra request. Cached per
        // product, so reopening the dialog is free.
        availableColors={productColors.data ?? EMPTY_COLORS}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}

/**
 * The line under the product name. Resolves the three things an admin checks
 * first on this screen — how many images, spread over how many colors, and
 * whether a primary is set.
 *
 * Deliberately says nothing about failure: the error message belongs in the
 * notice below, and repeating it here would print it twice.
 */
function describe(
  product: { images: ProductImageDto[] } | null | undefined,
  isLoading: boolean
): string {
  if (isLoading) return "Loading images...";

  // No data yet and not loading means the request finished and the hook has
  // nothing — a finished request must not read as a pending one.
  if (!product) return "No images on record for this product.";

  const total = product.images.length;
  // `color` is nullable, so distinctness is counted over the tagged images
  // only — `null` collapsing into one bucket would read as a real colorway.
  const colorIds = new Set(
    product.images
      .map((image) => image.color?.id)
      .filter((id): id is string => !!id)
  );
  const untagged = total - product.images.filter((image) => image.color).length;
  const primaryCount = product.images.filter((image) => image.isPrimary).length;

  return [
    `${total} image${total === 1 ? "" : "s"}`,
    colorIds.size > 0
      ? `across ${colorIds.size} color${colorIds.size === 1 ? "" : "s"}`
      : "untagged",
    untagged > 0 ? `${untagged} without a color` : null,
    primaryCount > 0
      ? `${primaryCount} set as primary`
      : "no primary set",
  ]
    .filter(Boolean)
    .join(" · ");
}

/** Dashed placeholder for the states that aren't a grid of images. */
function Notice({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-20 text-center">
      <span className="text-muted-foreground">{icon}</span>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
