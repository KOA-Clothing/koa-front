"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { useDataTableParams } from "@/hooks/use-data-table-params";
import { getCategoryColumns } from "./columns";
import { CategoryDto } from "@/types/category";
import { API_ROUTES } from "@/configs/api-routes";
import { toApiPageParams } from "@/types/pagination";
import { PaginatedList } from "@/types/api-response";
import { KoaTable } from "@/components/general/table/koa-table";
import { Shirt } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { AddNewButton } from "@/components/general/add-new-button";
import { Item, ItemContent } from "@/components/ui/item";

export default function CategoriesPage() {
  const axiosClient = useAxiosClient();
  const { pagination, setPagination } = useDataTableParams();

  const [categoryToEdit, setCategoryToEdit] = useState<CategoryDto | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);
  const [categoryToToggleStatus, setCategoryToToggleStatus] = useState<CategoryDto | null>(null);
 

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["categories", pagination],
    queryFn: async () => {
      const response = await axiosClient.get<PaginatedList<CategoryDto>>(
        API_ROUTES.CATEGORIES.BASE,
        { params: toApiPageParams(pagination) }
      );
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

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
            />
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