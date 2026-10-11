"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { ProductDtoSchema } from "@/types/product";
import { toApiListParams, type ListParams } from "@/types/pagination";
import type { ProductFilters } from "@/types/filters/product-filters";
import { queryKeys } from "@/lib/api/query-keys";

const productListSchema = paginatedListSchema(ProductDtoSchema);

/**
 * Server-paginated product list.
 *
 * Takes the whole request as one `ListParams` object (pagination + `search` +
 * this route's filter bag) so adding a filter to `ProductFilters` doesn't
 * change this signature. `toApiListParams` resolves it to the .NET endpoint's
 * query params and doubles as the query key, so two different filter
 * combinations can never share a cache entry.
 */
export function useProducts(params: ListParams<ProductFilters>) {
  const axiosClient = useAxiosClient();
  const apiParams = toApiListParams(params);

  return useQuery({
    queryKey: queryKeys.products.list(apiParams),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.PRODUCTS.BASE, {
        params: apiParams,
      });
      return productListSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}
