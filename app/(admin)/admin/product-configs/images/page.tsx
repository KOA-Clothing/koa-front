"use client"

import { useState } from "react";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import { PageHeader } from "@/components/admin/page-header";
import CreateProductImageModal from "@/components/admin/product-image/modals/create-product-image-modal";
import { KoaTable } from "@/components/general/table/koa-table";
import { useProductImages } from "@/features/product-image/hooks/use-product-images";
import { useSearchField } from "@/hooks/use-search-field";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { adminHrefs, adminListHrefs } from "@/lib/configs/page-routes";
import { ProductImageTableDetailsDto } from "@/types/product-image";
import type { ColorDto } from "@/types/color";
import { BookImage, Images } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProductImageColumns } from "./columns";

/** Stable empty list, so the modal's `availableColors` prop never changes identity. */
const EMPTY_COLORS: ColorDto[] = [];

export default function ProductImagesPage() {
  const router = useRouter();
  // No filter specs yet - the endpoint takes only search and pagination, so
  // `filters` is empty and contributes no query params. It's still passed
  // through so adding a filter bag later is a one-line change in the hook.
  const { pagination, setPagination, search, setSearch, filters } = useServerTableParams();
  const searchField = useSearchField({ value: search, onCommit: setSearch });
  const { data, isLoading } = useProductImages({ pagination, search, filters });

  const [productToCreate, setProductToCreate] =
    useState<ProductImageTableDetailsDto | null>(null);

  // No cache seeding here, unlike the variants route: a row is a summary with
  // counts, so there are no images to hand over. The gallery fetches its own
  // detail, and a brief skeleton is the honest cost of not shipping every
  // image of every row to draw a 5-column table.
  const handleViewImages = (product: ProductImageTableDetailsDto) => {
    router.push(adminHrefs.productImages(product.id));
  };

  const handleBaseProductView = (product: ProductImageTableDetailsDto) => {
    // `productId` here is the base product's own id - the row is a product
    // summary, not an image.
    router.push(adminListHrefs.baseProducts({ productId: product.id }));
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={"Product Images"}
        description={"Every image attached to a base product, grouped per product."}
        icon={<Images />}
      />

      <div className="flex flex-col gap-3">
        <KoaAdminSearchBar
          searchField={searchField}
          placeholder="Search Products..."
        />
      </div>

      <KoaTable
        columns={getProductImageColumns({
          onView: handleViewImages,
          onCreate: setProductToCreate,
          onBaseProductView: handleBaseProductView,
        })}
        data={data?.items ?? []}
        rowCount={data?.totalRecords ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        emptyMessage={
          search ? "No products match the current search." : undefined
        }
      />

      <CreateProductImageModal
        product={productToCreate}
        // The row already carries the product's variant colors, so the modal makes
        // no request of its own here — the cheapest of the two callers.
        availableColors={productToCreate?.availableColors ?? EMPTY_COLORS}
        onOpenChange={(open) => {
          if (!open) setProductToCreate(null);
        }}
      />
    </div>
  )
}
