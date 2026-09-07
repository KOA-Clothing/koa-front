"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useAxiosClient } from "@/hooks/use-api-client";
import { useDataTableParams } from "@/hooks/use-data-table-params";
import { toApiPageParams, paginatedResponseSchema } from "@/types/pagination";
import { getCategoryColumns, type Category } from "./columns";
import { DataTable } from "@/components/admin/table/data-table";

// Add a CATEGORIES entry to configs/api-routes.ts (alongside USERS,
// ADDRESSES, PHONE_NUMBERS) once this route exists on the .NET API — a
// literal string is used here to keep the example self-contained.
const CATEGORIES_ROUTE = "/api/v1/categories";

const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

// Adjust the field names inside paginatedResponseSchema (types/pagination.ts)
// if your .NET DTO wraps the list differently (e.g. PascalCase).
const CategoryListResponseSchema = paginatedResponseSchema(CategorySchema);

export default function CategoriesPage() {
  const axiosClient = useAxiosClient();
  const { pagination, setPagination } = useDataTableParams();

  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const { data, isLoading, isFetching } = useQuery({
    // pagination is part of the query key, so paging/page-size changes
    // automatically trigger a refetch of the right page.
    queryKey: ["categories", pagination],
    queryFn: async () => {
      const response = await axiosClient.get(CATEGORIES_ROUTE, {
        params: toApiPageParams(pagination),
      });
      return CategoryListResponseSchema.parse(response.data);
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