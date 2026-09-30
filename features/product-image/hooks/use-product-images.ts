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

/**
 * One product's images as a `ProductImageCollectionDto` — the product name plus
 * its `images[]`. Backs the gallery at `/admin/product-configs/images/{productId}`.
 *
 * ## Why this reuses BASE
 *
 * The list endpoint already returns the aggregate this page needs (a product
 * with its images nested), so a dedicated by-product endpoint would be a second
 * route returning the same DTO. Instead this asks the list for exactly one row
 * of the right product — which is the `ProductId` filter the controller already
 * sketches out.
 *
 * `pageSize: 1` is what makes that a detail read rather than a list read: the
 * response is a one-item page, and `items[0]` is the product.
 *
 * ## Backend contract
 *
 * `GET /api/v1/product-images?productId={id}&pageIndex=1&pageSize=1` must return
 * that one product. Until the filter is implemented the API ignores the
 * unrecognised param and replies with the ordinary first page, so the returned
 * row is checked against the requested id rather than trusted — otherwise the
 * page would quietly show a *different* product's images. That is a
 * wrong-results bug, not a crash, so it can't fail loudly on its own.
 *
 * ## Caching
 *
 * The list page seeds this exact query key with the row it already has before
 * navigating, so the click-through paints instantly and this fetch only happens
 * on a cold mount (refresh, pasted link, back from elsewhere).
 */
export function useProductImagesByProduct(productId: string) {
  const axiosClient = useAxiosClient();
  const apiParams = toApiListParams({
    pagination: { pageIndex: 0, pageSize: 1 },
    search: "",
    filters: { productId },
  });

  return useQuery({
    queryKey: queryKeys.productImages.detail(productId),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.PRODUCT_IMAGES.BASE, {
        params: apiParams,
      });
      const page = productImagesListSchema.parse(response.data);
      const product = page.items[0];

      // `null` means "not found", which the page renders as its own state
      // rather than as an error or as an empty gallery.
      return product?.id === productId ? product : null;
    },
    enabled: !!productId,
  });
}
