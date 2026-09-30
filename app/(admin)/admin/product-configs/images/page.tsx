"use client"

import { useQueryClient } from "@tanstack/react-query";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import { PageHeader } from "@/components/admin/page-header";
import { KoaTable } from "@/components/general/table/koa-table";
import { useProductImages } from "@/features/product-image/hooks/use-product-images";
import { useSearchField } from "@/hooks/use-search-field";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { queryKeys } from "@/lib/api/query-keys";
import { adminHrefs, adminListHrefs } from "@/lib/configs/page-routes";
import { ProductImageCollectionDto } from "@/types/product-image";
import { BookImage } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProductImageColumns } from "./columns";

export default function ProductImagesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  // No filter specs yet - the endpoint takes only search and pagination, so
  // `filters` is empty and contributes no query params. It's still passed
  // through so adding a filter bag later is a one-line change in the hook.
  const { pagination, setPagination, search, setSearch, filters } = useServerTableParams();
  const searchField = useSearchField({ value: search, onCommit: setSearch });
  const { data, isLoading } = useProductImages({ pagination, search, filters });

  const handleViewImages = (product: ProductImageCollectionDto) => {
    // The whole row - name and every image - is already on screen, so hand it
    // to the gallery's query key before navigating. The detail page reads it
    // straight out of the cache and paints immediately instead of flashing a
    // skeleton for data we were just looking at. On a refresh or a pasted link
    // the cache is cold and the hook fetches it instead.
    queryClient.setQueryData(
      queryKeys.productImages.detail(product.id),
      product
    );
    router.push(adminHrefs.productImages(product.id));
  };

  const handleBaseProductView = (product: ProductImageCollectionDto) => {
    // `productId` here is the base product's own id - the collection is a
    // product with its images nested, not an image.
    router.push(adminListHrefs.baseProducts({ productId: product.id }));
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={"Product Images"}
        description={"Every image attached to a base product, grouped per product."}
        icon={<BookImage />}
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
    </div>
  )
}
