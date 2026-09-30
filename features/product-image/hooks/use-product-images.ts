"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { toApiListParams, type ListParams } from "@/types/pagination";
import { ProductImageCollectionDtoSchema } from "@/types/product-image";

const productImagesListSchema = paginatedListSchema(
  ProductImageCollectionDtoSchema
);

/**
 * Server-paginated list of products grouped with their images.
 *
 * Takes the whole request as one `ListParams` object (pagination + `search` +
 * `filters`) so adding a filter later doesn't change this signature — the
 * endpoint currently accepts only `search`/`pageIndex`/`pageSize`, so
 * `filters` is empty and contributes no query params.
 *
 * `toApiListParams` resolves it to the .NET endpoint's query params and
 * doubles as the query key, so two different request shapes can never share a
 * cache entry.
 */
export function useProductImages(params: ListParams) {
  const axiosClient = useAxiosClient();
  const apiParams = toApiListParams(params);

  return useQuery({
    queryKey: queryKeys.productImages.list(apiParams),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.PRODUCT_IMAGES.BASE, {
        params: apiParams,
      });
      return productImagesListSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}
