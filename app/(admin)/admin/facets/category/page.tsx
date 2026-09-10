"use client";

import { useState } from "react";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { useSearchField } from "@/hooks/use-search-field";
import { useCategories } from "@/features/category/hooks/use-categories";
import { useCategoryMutations } from "@/features/category/hooks/use-category-mutations";
import { getCategoryColumns } from "./columns";
import { CategoryDto } from "@/types/category";
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

export default function CategoriesPage() {
  const { pagination, setPagination, search, setSearch } = useServerTableParams();
  const searchField = useSearchField({ value: search, onCommit: setSearch });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryDto | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);

  const { data, isLoading } = useCategories(pagination, search);
  const { toggleActiveStatus } = useCategoryMutations();

  const handleToggleActiveStatus = (category: CategoryDto) => {
    toggleActiveStatus.mutate(category.id);
  };

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