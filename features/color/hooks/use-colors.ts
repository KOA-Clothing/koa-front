"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { ColorDtoSchema } from "@/types/color";
import { toApiListParams, type ListParams } from "@/types/pagination";
import type { ColorFilters } from "@/types/filters/color-filters";
import { queryKeys } from "@/lib/api/query-keys";

const colorListSchema = paginatedListSchema(ColorDtoSchema);

/**
 * Server-paginated color list.
 *
 * Takes the whole request as one `ListParams` object (pagination + `search` +
 * this route's filter bag) so adding a filter to `ColorFilters` doesn't
 * change this signature. `toApiListParams` resolves it to the .NET endpoint's
 * query params and doubles as the query key, so two different filter
 * combinations can never share a cache entry.
 */
export function useColors(params: ListParams<ColorFilters>) {
  const axiosClient = useAxiosClient();
  const apiParams = toApiListParams(params);

  return useQuery({
    queryKey: queryKeys.colors.list(apiParams),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.COLORS.BASE, {
        params: apiParams,
      });
      return colorListSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}

/** All active colors, used for selects (e.g. variant color picker). */
export function useActiveColors() {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.colors.active,
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.COLORS.ALL_ACTIVE);
      return z.array(ColorDtoSchema).parse(response.data);
    },
  });
}

/**
 * The distinct colors a product has variants in — `GET /colors/by-product/{id}`.
 *
 * The scoped replacement for `useActiveColors` on any screen that edits one
 * product. A global list lets an admin pick a colorway the product has no variant
 * for, and a color-specific image on a product that isn't stocked in that color
 * can never be selected on the storefront.
 *
 * A **superset** of the colors on a product's images: a product can be stocked in
 * Navy and have no Navy shot yet. Deriving the same list from its images would
 * hide exactly the colorway an admin opens this screen to upload a shot for.
 *
 * `enabled` is `false` while no product is in hand, so the hook is safe to call
 * unconditionally. Callers that already hold the list (a table row carrying
 * `availableColors`) should pass it down instead and not call this at all.
 */
export function useProductColors(productId: string | undefined, options?: { enabled?: boolean }) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.colors.byProduct(productId ?? ""),
    enabled: !!productId && options?.enabled !== false,
    queryFn: async () => {
      // `enabled` above guarantees an id before this runs, but TypeScript can't
      // follow that into the fetcher — so this is a real guard rather than a cast
      // that would send a request to `/by-product/` if it were ever reached.
      if (!productId) throw new Error("useProductColors requires a productId");
      const response = await axiosClient.get(API_ROUTES.COLORS.BY_PRODUCT(productId));
      return z.array(ColorDtoSchema).parse(response.data);
    },
  });
}