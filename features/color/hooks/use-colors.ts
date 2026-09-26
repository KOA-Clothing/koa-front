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