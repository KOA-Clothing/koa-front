"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { useDataTableParams } from "@/hooks/use-data-table-params";
import { getCategoryColumns } from "./columns";
import { DataTable } from "@/components/admin/table/data-table";
import { CategoryDto } from "@/types/category";
import { API_ROUTES } from "@/configs/api-routes";
import { toApiPageParams } from "@/types/pagination";
import { ApiResponse, PaginatedList } from "@/types/api-response";

// Adjust the field names inside paginatedResponseSchema (types/pagination.ts)
// if your .NET DTO wraps the list differently (e.g. PascalCase).

export default function CategoriesPage() {
  const axiosClient = useAxiosClient();
  const { pagination, setPagination } = useDataTableParams();

  const [categoryToEdit, setCategoryToEdit] = useState<CategoryDto | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["categories", pagination],
    queryFn: async () => {
      const response = await axiosClient.get<ApiResponse<PaginatedList<CategoryDto>>>(
        API_ROUTES.CATEGORIES.BASE,
        { params: toApiPageParams(pagination) }
      );
      return response.data.data;
    },
    placeholderData: (previousData) => previousData,
  });

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={getCategoryColumns({
          onEdit: setCategoryToEdit,
          onDelete: setCategoryToDelete,
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