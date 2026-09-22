"use client"

import { useState } from "react";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import DeleteVariantConfirmationModal from "@/components/admin/product-variant/modals/delete-variant-confirmation-modal";
import ViewProductVariantsModal from "@/components/admin/product-variant/modals/view-product-variants-modal";
import { PageHeader } from "@/components/admin/page-header";
import { KoaTable } from "@/components/general/table/koa-table";
import { useProductVariantMutations } from "@/features/product-variant/hooks/use-product-variant-mutations";
import { useProductVariants } from "@/features/product-variant/hooks/use-product-variants";
import { useSearchField } from "@/hooks/use-search-field";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { ProductVariantDto, ProductVariantsCollectionDto } from "@/types/product-variant";
import { ScissorsLineDashed } from "lucide-react";
import { getProductVariantColumns } from "./columns";

export default function ProductVariantsPage() {
  const { pagination, setPagination, search, setSearch } = useServerTableParams();
  const searchField = useSearchField({ value: search, onCommit: setSearch });
  const { data, isLoading } = useProductVariants(pagination, search);
  const { toggleActiveStatus } = useProductVariantMutations();

  const [productToView, setProductToView] = useState<ProductVariantsCollectionDto | null>(null);
  const [variantToDelete, setVariantToDelete] = useState<ProductVariantDto | null>(null);

  const handleToggleActiveStatus = (variant: ProductVariantDto) => {
    toggleActiveStatus.mutate(variant.id, {
      onSuccess: () => {
        // Keep the open modal in sync until the refetch lands.
        setProductToView((prev) =>
          prev
            ? {
                ...prev,
                variants: prev.variants.map((v) =>
                  v.id === variant.id ? { ...v, isActive: !v.isActive } : v
                ),
              }
            : prev
        );
      },
    });
  };

  const handleRemoveVariant = (variant: ProductVariantDto) => {
    setVariantToDelete(variant);
  };

  const handleVariantDeleted = (variant: ProductVariantDto) => {
    setProductToView((prev) =>
      prev
        ? { ...prev, variants: prev.variants.filter((v) => v.id !== variant.id) }
        : prev
    );
  };

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
          onCreate: () => console.log("test")
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
        toggleActiveStatus={handleToggleActiveStatus}
        onRemove={handleRemoveVariant}
      />

      <DeleteVariantConfirmationModal
        variant={variantToDelete}
        onOpenChange={(open) => {
          if (!open) setVariantToDelete(null);
        }}
        onDeleted={handleVariantDeleted}
      />
    </div>
  )
}