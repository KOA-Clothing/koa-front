"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import type { ClothingSize } from "@/types/enums";
import {
  CheckVariationExistsResponseSchema,
  ProductVariantsCollectionDtoSchema,
} from "@/types/product-variant";
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