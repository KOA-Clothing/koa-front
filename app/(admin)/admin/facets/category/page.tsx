"use client";

import { useMemo, useState } from "react";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { useSearchField } from "@/hooks/use-search-field";
import { useCategories } from "@/features/category/hooks/use-categories";
import { useCategoryMutations } from "@/features/category/hooks/use-category-mutations";
import { getCategoryColumns } from "./columns";
import { CategoryDto } from "@/types/category";
import { categoryFilterSpecs } from "@/types/filters/category-filters";
import { KoaTable } from "@/components/general/table/koa-table";
import { RotateCcw, Shirt } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { AddNewButton } from "@/components/general/add-new-button";
import { Item, ItemContent } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import CreateCategoryModal from "@/components/admin/category/modals/create-category-modal";
import DeleteCategoryConfirmationModal from "@/components/admin/category/modals/delete-category-confirmation-modal";
import UpdateCategoryModal from "@/components/admin/category/modals/update-category-modal";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import KoaAdminFiltersBar from "@/components/admin/koa-admin-filters-bar";
import CategoryFilterControls from "@/components/admin/category/filters/category-filter-controls";

export default function CategoriesPage() {
  const {
    pagination,
    setPagination,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  } = useServerTableParams({ filters: categoryFilterSpecs });
  const searchField = useSearchField({ value: search, onCommit: setSearch });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryDto | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);

  const { data, isLoading } = useCategories({ pagination, search, filters });
  const { toggleActiveStatus } = useCategoryMutations();

  const handleToggleActiveStatus = (category: CategoryDto) => {
    toggleActiveStatus.mutate(category.id);
  };

  /**
   * Label for the `categoryId` deep-link indicator. When that filter is set the
   * list is scoped to exactly that category, so the name is already in the
   * response — no second request. Matching on the id (rather than trusting the
   * row position) keeps a stale `placeholderData` page from naming the wrong
   * category for a frame while the filtered request is in flight.
   */
  const categoryIdLabel = useMemo(() => {
    if (!filters.categoryId) return undefined;
    return data?.items.find((item) => item.id === filters.categoryId)?.name;
  }, [filters.categoryId, data]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader 
        title={"Category"} 
        description={"The fundamental structural geometry and cut of an apparel item (ex: T-Shirt, Skirt, Shorts) that serves as the base entity for a product."} 
        icon={<Shirt/>} 
      />

      <div className="flex flex-col gap-3">
        <KoaAdminSearchBar 
          searchField={searchField} 
          placeholder="Search Category..."
        />

        <KoaAdminFiltersBar
          hasActiveFilters={hasActiveFilters}
          onClearAll={clearFilters}
        >
          <CategoryFilterControls
            filters={filters}
            setFilter={setFilter}
            categoryIdLabel={categoryIdLabel}
          />
        </KoaAdminFiltersBar>
        
        <div className="flex items-center justify-end gap-2">
          <AddNewButton onClick={() => setIsCreateOpen(true)} />
        </div>
      </div>
      
      <KoaTable
        columns={getCategoryColumns({
          onEdit: setCategoryToEdit,
          onDelete: setCategoryToDelete,
          toggleActiveStatus: handleToggleActiveStatus
        })}
        data={data?.items ?? []}
        rowCount={data?.totalRecords ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        emptyMessage={
          hasActiveFilters || search
            ? "No categories match the current search and filters."
            : undefined
        }
      />

      <CreateCategoryModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <DeleteCategoryConfirmationModal
        category={categoryToDelete}
        onOpenChange={(open) => {
          if (!open) setCategoryToDelete(null);
        }}
      />

      <UpdateCategoryModal
        category={categoryToEdit}
        onOpenChange={(open) => {
          if (!open) setCategoryToEdit(null);
        }}
      />
    </div>
  );
}