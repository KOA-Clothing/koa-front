"use client"

import { useState } from "react";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import { PageHeader } from "@/components/admin/page-header";
import ViewProductImagesModal from "@/components/admin/product-image/modals/view-product-images-modal";
import { KoaTable } from "@/components/general/table/koa-table";
import { useProductImages } from "@/features/product-image/hooks/use-product-images";
import { useSearchField } from "@/hooks/use-search-field";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { adminListHrefs } from "@/lib/configs/page-routes";
import { ProductImageCollectionDto } from "@/types/product-image";
import { BookImage } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProductImageColumns } from "./columns";

export default function ProductImagesPage() {
  const router = useRouter();
  const { pagination, setPagination, search, setSearch, filters } = useServerTableParams();
  const searchField = useSearchField({ value: search, onCommit: setSearch });
  const { data, isLoading } = useProductImages({ pagination, search, filters });
  const [productToView, setProductToView] = useState<ProductImageCollectionDto | null>(null);

  const handleBaseProductView = (product: ProductImageCollectionDto) => {
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
          onView: setProductToView,
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

      <ViewProductImagesModal
        product={productToView}
        onOpenChange={(open) => {
          if (!open) setProductToView(null);
        }}
      />
    </div>
  )
}
