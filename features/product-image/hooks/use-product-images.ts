"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { toApiListParams, type ListParams } from "@/types/pagination";
import {
  ProductImageTableDetailsDtoSchema,
  ProductImagesCollectionDtoSchema,
} from "@/types/product-image";

const productImagesTableSchema = paginatedListSchema(
  ProductImageTableDetailsDtoSchema
);

/**
 * Server-paginated product-images table. Rows are `ProductImageTableDetailsDto`
 * — counts and a swatch strip, not the images themselves, so the payload scales
 * with page size instead of with image count.
 *
 * Takes the whole request as one `ListParams` object (pagination + `search` +
 * `filters`) so adding a filter later doesn't change this signature — the
 * endpoint currently accepts only `search`/`pageIndex`/`pageSize`, so `filters`
 * is empty and contributes no query params.
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
      return productImagesTableSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * One product's images as a `ProductImagesCollectionDto` — the product name plus
 * its `images[]`. Backs the gallery at `/admin/product-configs/images/{productId}`.
 *
 * A dedicated endpoint rather than a `productId` filter on the table above: the
 * table row deliberately doesn't carry the images, so it cannot answer this, and
 * routing a detail view through a paged list would make "this product has no
 * images" indistinguishable from "that was page 3 of the results".
 *
 * ## Failure contract
 *
 * A product that exists but has no images comes back `200` with an empty
 * `images[]` — the page renders that as "no images yet" *with* a working Add
 * button, which is the only route to a product's first image. `404` is reserved
 * for a product id that doesn't resolve, so the page can say so honestly.
 */
export function useProductImagesByProduct(productId: string) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.productImages.detail(productId),
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ROUTES.PRODUCT_IMAGES.BY_ID(productId)
      );
      return ProductImagesCollectionDtoSchema.parse(response.data);
    },
    enabled: !!productId,
  });
}
