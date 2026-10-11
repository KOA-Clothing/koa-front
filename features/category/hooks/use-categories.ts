"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { CategoryDtoSchema } from "@/types/category";
import { toApiListParams, type ListParams } from "@/types/pagination";
import type { CategoryFilters } from "@/types/filters/category-filters";
import { queryKeys } from "@/lib/api/query-keys";

const categoryListSchema = paginatedListSchema(CategoryDtoSchema);

/**
 * Server-paginated category list.
 *
 * Takes the whole request as one `ListParams` object (pagination + `search` +
 * this route's filter bag) so adding a filter to `CategoryFilters` doesn't
 * change this signature. `toApiListParams` resolves it to the .NET endpoint's
 * query params and doubles as the query key, so two different filter
 * combinations can never share a cache entry.
 */
export function useCategories(params: ListParams<CategoryFilters>) {
  const axiosClient = useAxiosClient();
  const apiParams = toApiListParams(params);

  return useQuery({
    queryKey: queryKeys.categories.list(apiParams),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.CATEGORIES.BASE, {
        params: apiParams,
      });
      return categoryListSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}

/** All active categories, used for selects (e.g. product category picker). */
export function useActiveCategories() {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.categories.active,
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.CATEGORIES.ALL_ACTIVE);
      return z.array(CategoryDtoSchema).parse(response.data);
    },
  });
}