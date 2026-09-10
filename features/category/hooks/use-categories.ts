"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { CategoryDtoSchema } from "@/types/category";
import { toApiPageParams } from "@/types/pagination";
import { queryKeys } from "@/lib/api/query-keys";

const categoryListSchema = paginatedListSchema(CategoryDtoSchema);

/** Server-paginated category list. `search` is sent as the `?search=` API param. */
export function useCategories(pagination: PaginationState, search: string) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.categories.list({ pagination, search }),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.CATEGORIES.BASE, {
        params: toApiPageParams(pagination, search),
      });
      return categoryListSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}