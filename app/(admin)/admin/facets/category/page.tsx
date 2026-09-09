"use client";

import { useEffect, useState } from "react";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { useSearchField } from "@/hooks/use-search-field";
import { useCategories } from "@/features/category/hooks/use-categories";
import { getCategoryColumns } from "./columns";
import { CategoryDto } from "@/types/category";
import { KoaTable } from "@/components/general/table/koa-table";
import { RotateCcw, Shirt } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { AddNewButton } from "@/components/general/add-new-button";
import { Item, ItemContent } from "@/components/ui/item";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const { pagination, setPagination, search, setSearch } = useServerTableParams();
  const searchField = useSearchField({ value: search, onCommit: setSearch });

  const [categoryToEdit, setCategoryToEdit] = useState<CategoryDto | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);
  const [categoryToToggleStatus, setCategoryToToggleStatus] = useState<CategoryDto | null>(null);

  const { data, isLoading, isFetching } = useCategories(pagination, search);

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  return (
    <div className="flex flex-col gap-4">
      <PageHeader 
        title={"Category"} 
        description={"The fundamental structural geometry and cut of an apparel item (ex: T-Shirt, Skirt, Shorts) that serves as the base entity for a product."} 
        icon={<Shirt/>} 
      />

      <div className="flex flex-col gap-3">
        <Item variant="outline" className="rounded-xl bg-background text-foreground">
          <ItemContent className="flex flex-row items-center gap-2">
            <span>Search </span>
            <Input
              id="search"
              type="text"
              placeholder="Search categories..."
              value={searchField.value}
              onChange={(e) => searchField.onChange(e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={searchField.clear}
            >
              <RotateCcw />
              Clear
            </Button>
          </ItemContent>
        </Item>
        
        <div className="flex items-center justify-end gap-2">
          <AddNewButton onClick={() => console.log("test")} />
        </div>
      </div>
      
      <KoaTable
        columns={getCategoryColumns({
          onEdit: setCategoryToEdit,
          onDelete: setCategoryToDelete,
          toggleActiveStatus: setCategoryToToggleStatus
        })}
        data={data?.items ?? []}
        rowCount={data?.totalRecords ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading || isFetching}
      />
    </div>
  );
}