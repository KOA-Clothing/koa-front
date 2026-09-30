"use client";

import { ReactNode } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { BaseShirtIcon } from "@/components/general/custom-icons/base-shirt-icon";
import KoaProductImageItem from "@/components/general/koa-product-image-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductImagesByProduct } from "@/features/product-image/hooks/use-product-images";
import { getErrorMessage } from "@/lib/api/errors";
import {
  adminListHrefs,
  PAGE_ROUTES,
} from "@/lib/configs/page-routes";
import { ProductImageDto } from "@/types/product-image";
import { BookImage, ChevronLeft, ImageOff } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

/** Cards per row: one on mobile, widening to four on very wide screens. */
const GALLERY_GRID = "grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

/** How many placeholder cards to draw while the request is in flight. */
const SKELETON_COUNT = 8;

/**
 * Gallery of one product's images, at `/admin/product-configs/images/{productId}`.
 *
 * Reached from the "View images" action on the product-images table, which seeds
 * the query cache with the row it already has — so this page normally paints
 * from cache with no loading state. The hook still fetches on a cold mount
 * (refresh, pasted link), which is the case that makes the URL worth having.
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
      ) : isError ? (
        <Notice icon={<ImageOff className="size-6" />}>
          {getErrorMessage(error)}
        </Notice>
      ) : !product ? (
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
  if (isLoading || !product) return "Loading images...";

  const total = product.images.length;
  const colorCount = new Set(product.images.map((image) => image.color.id)).size;
  const primaryCount = product.images.filter((image) => image.isPrimary).length;

  return [
    `${total} image${total === 1 ? "" : "s"}`,
    `across ${colorCount} color${colorCount === 1 ? "" : "s"}`,
    primaryCount > 0
      ? `${primaryCount} set as primary`
      : "no primary set",
  ].join(" · ");
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
