"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { ProductDtoSchema } from "@/types/product";
import { toApiPageParams } from "@/types/pagination";
import { queryKeys } from "@/lib/api/query-keys";

const productListSchema = paginatedListSchema(ProductDtoSchema);

/** Server-paginated product list. `search` is sent as the `?search=` API param. */
export function useProducts(pagination: PaginationState, search: string) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.products.list({ pagination, search }),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.PRODUCTS.BASE, {
        params: toApiPageParams(pagination, search),
      });
      return productListSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}