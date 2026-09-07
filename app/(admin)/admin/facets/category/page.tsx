"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { useDataTableParams } from "@/hooks/use-data-table-params";
import { getCategoryColumns } from "./columns";
import { CategoryDto } from "@/types/category";
import { API_ROUTES } from "@/configs/api-routes";
import { toApiPageParams } from "@/types/pagination";
import { PaginatedList } from "@/types/api-response";
import { KoaTable } from "@/components/general/table/koa-table";

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

  useEffect(() => {
    console.log("edit: ", categoryToEdit)
    console.log("delete: ", categoryToDelete)
    console.log("toggle: ", categoryToToggleStatus)
  }, [categoryToDelete, categoryToEdit, categoryToToggleStatus])

  return (
    <div className="flex flex-col gap-4">
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