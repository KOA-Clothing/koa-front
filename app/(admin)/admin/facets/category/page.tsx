"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { useDataTableParams } from "@/hooks/use-data-table-params";
import { getCategoryColumns } from "./columns";
import { DataTable } from "@/components/admin/table/data-table";
import { CategoryDto } from "@/types/category";
import { API_ROUTES } from "@/configs/api-routes";

// Adjust the field names inside paginatedResponseSchema (types/pagination.ts)
// if your .NET DTO wraps the list differently (e.g. PascalCase).

export default function CategoriesPage() {
  const axiosClient = useAxiosClient();
  const { pagination, setPagination } = useDataTableParams();

  const [categoryToEdit, setCategoryToEdit] = useState<CategoryDto | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    // pagination is part of the query key, so paging/page-size changes
    // automatically trigger a refetch of the right page.
    queryKey: ["categories", pagination],
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.CATEGORIES.ALL);
      return response.data;
    },
    // keep showing the previous page's rows while the next page loads,
    // instead of flashing an empty table
    placeholderData: (previousData) => previousData,
  });

  // columns rarely change, so this only needs to be recomputed when the
  // row-action callbacks change
  const columns = useMemo(
    () =>
      getCategoryColumns({
        onEdit: setCategoryToEdit,
        onDelete: setCategoryToDelete,
      }),
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        rowCount={data?.totalCount ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading || isFetching}
      />

      {/* Wire categoryToEdit / categoryToDelete up to Update/Delete modals
          the same way UpdateModal.tsx and the
          delete-*-confirmation-modal.tsx components do elsewhere in the app. */}
    </div>
  );
}