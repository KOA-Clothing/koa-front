"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import type { ClothingSize } from "@/types/enums";
import type { ProductVariantFilters } from "@/types/filters/product-variant-filters";
import {
  CheckVariationExistsResponseSchema,
  ProductVariantsCollectionDtoSchema,
} from "@/types/product-variant";
import { toApiListParams, type ListParams } from "@/types/pagination";
import { queryKeys } from "@/lib/api/query-keys";

const productVariantsListSchema = paginatedListSchema(
  ProductVariantsCollectionDtoSchema
);

/**
 * Server-paginated list of products grouped with their variants.
 *
 * Takes the whole request as one `ListParams` object (pagination + `search` +
 * this route's filter bag) so adding a filter to `ProductVariantFilters` doesn't
 * change this signature. `toApiListParams` resolves it to the .NET endpoint's
 * query params and doubles as the query key, so two different filter
 * combinations can never share a cache entry.
 */
export function useProductVariants(params: ListParams<ProductVariantFilters>) {
  const axiosClient = useAxiosClient();
  const apiParams = toApiListParams(params);

  return useQuery({
    queryKey: queryKeys.productVariants.list(apiParams),
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ROUTES.PRODUCT_VARIANTS.BASE,
        {
          params: apiParams,
        }
      );
      return productVariantsListSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Checks whether a variant (product + color + size) already exists. The
 * request only fires once a color and a size are both selected.
 */
export function useVariantExists(
  productId: string,
  colorId: string,
  size: ClothingSize | null
) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.productVariants.exists({ productId, colorId, size }),
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ROUTES.PRODUCT_VARIANTS.EXISTS(productId, colorId, size as ClothingSize)
      );
      return CheckVariationExistsResponseSchema.parse(response.data);
    },
    enabled: !!productId && !!colorId && size != null,
  });
}