"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
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

/**
 * Every product in one category
 * (`PATCH /api/v1/products/all/category/{categoryId}` → `List<ProductDto>`),
 * used by pickers such as "add a product to this collection".
 *
 * The PATCH verb is the endpoint's shape, not a mistake here. Not paged: the
 * endpoint returns the category's whole product list, so callers filter it
 * client-side. Disabled while no category is chosen, which is what keeps the
 * request from firing with an empty id.
 */
export function useProductsByCategory(categoryId: string) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.products.byCategory(categoryId),
    queryFn: async () => {
      const response = await axiosClient.patch(
        API_ROUTES.PRODUCTS.BY_CATEGORY(categoryId)
      );
      return z.array(ProductDtoSchema).parse(response.data);
    },
    enabled: !!categoryId,
  });
}
