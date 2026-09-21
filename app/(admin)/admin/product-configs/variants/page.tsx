"use client"

import { useState } from "react";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import ViewProductVariantsModal from "@/components/admin/product-variant/modals/view-product-variants-modal";
import { PageHeader } from "@/components/admin/page-header";
import { KoaTable } from "@/components/general/table/koa-table";
import { useProductVariants } from "@/features/product-variant/hooks/use-product-variants";
import { useSearchField } from "@/hooks/use-search-field";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { ProductVariantsCollectionDto } from "@/types/product-variant";
import { ScissorsLineDashed } from "lucide-react";
import { getProductVariantColumns } from "./columns";

export default function ProductVariantsPage() {
  const { pagination, setPagination, search, setSearch } = useServerTableParams();
  const searchField = useSearchField({ value: search, onCommit: setSearch });
  const { data, isLoading } = useProductVariants(pagination, search);

  const [productToView, setProductToView] = useState<ProductVariantsCollectionDto | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={"Product Variants"}
        description={"Every size/color variation of a base product, grouped per product."}
        icon={<ScissorsLineDashed />}
      />

      <div className="flex flex-col gap-3">
        <KoaAdminSearchBar
          searchField={searchField}
          placeholder="Search Products..."
        />
      </div>

      <KoaTable
        columns={getProductVariantColumns({
          onView: setProductToView,
        })}
        data={data?.items ?? []}
        rowCount={data?.totalRecords ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />

      <ViewProductVariantsModal
        product={productToView}
        onOpenChange={(open) => {
          if (!open) setProductToView(null);
        }}
      />
    </div>
  )
}