"use client"

import { useMemo, useState } from "react";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import KoaAdminFiltersBar from "@/components/admin/koa-admin-filters-bar";
import ProductVariantFilterControls from "@/components/admin/product-variant/filters/product-variant-filter-controls";
import CreateVariantModal from "@/components/admin/product-variant/modals/create-variant-modal";
import DeleteVariantConfirmationModal from "@/components/admin/product-variant/modals/delete-variant-confirmation-modal";
import ViewProductVariantsModal from "@/components/admin/product-variant/modals/view-product-variants-modal";
import { PageHeader } from "@/components/admin/page-header";
import { KoaTable } from "@/components/general/table/koa-table";
import { useProductVariantMutations } from "@/features/product-variant/hooks/use-product-variant-mutations";
import { useProductVariants } from "@/features/product-variant/hooks/use-product-variants";
import { useSearchField } from "@/hooks/use-search-field";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { adminListHrefs } from "@/lib/configs/page-routes";
import { productVariantFilterSpecs } from "@/types/filters/product-variant-filters";
import { ProductVariantDto, ProductVariantsCollectionDto } from "@/types/product-variant";
import { ScissorsLineDashed } from "lucide-react";
import { getProductVariantColumns } from "./columns";
import { useRouter } from "next/navigation";

export default function ProductVariantsPage() {
  const router = useRouter();
  const {
    pagination,
    setPagination,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  } = useServerTableParams({ filters: productVariantFilterSpecs });
  const searchField = useSearchField({ value: search, onCommit: setSearch });
  const { data, isLoading } = useProductVariants({ pagination, search, filters });
  const { toggleActiveStatus } = useProductVariantMutations();

  const [productToView, setProductToView] = useState<ProductVariantsCollectionDto | null>(null);
  const [productToCreate, setProductToCreate] = useState<ProductVariantsCollectionDto | null>(null);
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

  const handleBaseProductView = (product: ProductVariantsCollectionDto) => {
    // `productId` here is the base product's own id - the collection is a
    // product with its variants nested, not a variant.
    router.push(adminListHrefs.baseProducts({ productId: product.id }));
  };

  /**
   * Label for the `productId` deep-link indicator. When that filter is set the
   * list is scoped to exactly that product, so the name is already in the
   * response — no second request. Matching on the id (rather than trusting the
   * row position) keeps a stale `placeholderData` page from naming the wrong
   * product for a frame while the filtered request is in flight.
   */
  const productIdLabel = useMemo(() => {
    if (!filters.productId) return undefined;
    return data?.items.find((item) => item.id === filters.productId)?.name;
  }, [filters.productId, data]);

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

        <KoaAdminFiltersBar
          hasActiveFilters={hasActiveFilters}
          onClearAll={clearFilters}
        >
          <ProductVariantFilterControls
            filters={filters}
            setFilter={setFilter}
            productIdLabel={productIdLabel}
          />
        </KoaAdminFiltersBar>
      </div>

      <KoaTable
        columns={getProductVariantColumns({
          onView: setProductToView,
          onCreate: setProductToCreate,
          onBaseProductView: handleBaseProductView
        })}
        data={data?.items ?? []}
        rowCount={data?.totalRecords ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        emptyMessage={
          hasActiveFilters || search
            ? "No products match the current search and filters."
            : undefined
        }
      />

      <ViewProductVariantsModal
        product={productToView}
        onOpenChange={(open) => {
          if (!open) setProductToView(null);
        }}
        toggleActiveStatus={handleToggleActiveStatus}
        onRemove={handleRemoveVariant}
      />

      <CreateVariantModal
        product={productToCreate}
        onOpenChange={(open) => {
          if (!open) setProductToCreate(null);
        }}
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