"use client";

import { useMemo, useState } from "react";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { useSearchField } from "@/hooks/use-search-field";
import { useProducts } from "@/features/product/hooks/use-products";
import { useProductMutations } from "@/features/product/hooks/use-product-mutations";
import { getProductColumns } from "./columns";
import { ProductDto } from "@/types/product";
import { AgeGroupEnum, GenderEnum, ProductStatusEnum } from "@/types/enums";
import { productFilterSpecs } from "@/types/filters/product-filters";
import { KoaTable } from "@/components/general/table/koa-table";
import { Shirt } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { AddNewButton } from "@/components/general/add-new-button";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import KoaAdminFiltersBar from "@/components/admin/koa-admin-filters-bar";
import ProductFilterControls from "@/components/admin/product/filters/product-filter-controls";
import CreateProductModal from "@/components/admin/product/modals/create-product-modal";
import DeleteProductConfirmationModal from "@/components/admin/product/modals/delete-product-confirmation-modal";
import UpdateProductModal from "@/components/admin/product/modals/update-product-modal";
import ViewProductModal from "@/components/admin/product/modals/view-product-modal";
import ManageLinkedDesignsModal from "@/components/admin/product/modals/manage-linked-designs-modal";

export default function BaseProductsPage() {
  const {
    pagination,
    setPagination,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  } = useServerTableParams({ filters: productFilterSpecs });
  const searchField = useSearchField({ value: search, onCommit: setSearch });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [productToView, setProductToView] = useState<ProductDto | null>(null);
  const [productToEdit, setProductToEdit] = useState<ProductDto | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductDto | null>(null);
  const [productToManageDesigns, setProductToManageDesigns] = useState<ProductDto | null>(null);

  const { data, isLoading } = useProducts({ pagination, search, filters });
  const { 
    toggleActiveStatus, 
    toggleFeaturedStatus, 
    changeGender, 
    changeAgeGroup, 
    changeProductStatus } = useProductMutations();

  const handleToggleActiveStatus = (product: ProductDto) => {
    toggleActiveStatus.mutate(product.id);
  };

  const handleToggleFeaturedStatus = (product: ProductDto) => {
    toggleFeaturedStatus.mutate(product.id);
  };

  const handleChangeGender = (product: ProductDto, gender: GenderEnum) => {
    changeGender.mutate({ id: product.id, gender });
  };

  const handleChangeAgeGroup = (product: ProductDto, ageGroup: AgeGroupEnum) => {
    changeAgeGroup.mutate({ id: product.id, ageGroup });
  };

  const handleChangeProductStatus = (product: ProductDto, status: ProductStatusEnum) => {
    changeProductStatus.mutate({ id: product.id, status });
  };

  const handleManageLinkedDesigns = (product: ProductDto) => {
    setProductToManageDesigns(product);
  }

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
        title={"Base Products"}
        description={"Tangible apparel items built on a base category. Each product links a category and multiple designs."}
        icon={<Shirt />}
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
          <ProductFilterControls
            filters={filters}
            setFilter={setFilter}
            productIdLabel={productIdLabel}
          />
        </KoaAdminFiltersBar>

        <div className="flex items-center justify-end gap-2">
          <AddNewButton onClick={() => setIsCreateOpen(true)} />
        </div>
      </div>

      <KoaTable
        columns={getProductColumns({
          onEdit: setProductToEdit,
          onDelete: setProductToDelete,
          onView: setProductToView,
          toggleFeaturedStatus: handleToggleFeaturedStatus,
          toggleActiveStatus: handleToggleActiveStatus,
          onChangeGender: handleChangeGender,
          onChangeAgeGroup: handleChangeAgeGroup,
          onChangeProductStatus: handleChangeProductStatus,
          manageLinkedDesigns: handleManageLinkedDesigns
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

      <CreateProductModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <ViewProductModal
        product={productToView}
        onOpenChange={(open) => {
          if (!open) setProductToView(null);
        }}
        onEdit={(product) => {
          setProductToView(null);
          setProductToEdit(product);
        }}
      />

      <DeleteProductConfirmationModal
        product={productToDelete}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null);
        }}
      />

      <UpdateProductModal
        product={productToEdit}
        onOpenChange={(open) => {
          if (!open) setProductToEdit(null);
        }}
      />

      <ManageLinkedDesignsModal
        product={productToManageDesigns}
        onOpenChange={(open) => {
          if (!open) setProductToManageDesigns(null);
        }}
      />
    </div>
  );
}