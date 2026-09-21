"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { ProductVariantsCollectionDtoSchema } from "@/types/product-variant";
import { toApiPageParams } from "@/types/pagination";
import { queryKeys } from "@/lib/api/query-keys";

const productVariantsListSchema = paginatedListSchema(
  ProductVariantsCollectionDtoSchema
);

/**
 * Server-paginated list of products grouped with their variants.
 * `search` is sent as the `?search=` API param.
 */
export function useProductVariants(
  pagination: PaginationState,
  search: string
) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.productVariants.list({ pagination, search }),
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ROUTES.PRODUCT_VARIANTS.BASE,
        {
          params: toApiPageParams(pagination, search),
        }
      );
      return productVariantsListSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}