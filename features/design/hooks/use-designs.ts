"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { DesignDtoSchema } from "@/types/design";
import { toApiListParams, type ListParams } from "@/types/pagination";
import type { DesignFilters } from "@/types/filters/design-filters";
import { queryKeys } from "@/lib/api/query-keys";

const designListSchema = paginatedListSchema(DesignDtoSchema);

/**
 * Server-paginated design list.
 *
 * Takes the whole request as one `ListParams` object (pagination + `search` +
 * this route's filter bag) so adding a filter to `DesignFilters` doesn't
 * change this signature. `toApiListParams` resolves it to the .NET endpoint's
 * query params and doubles as the query key, so two different filter
 * combinations can never share a cache entry.
 */
export function useDesigns(params: ListParams<DesignFilters>) {
  const axiosClient = useAxiosClient();
  const apiParams = toApiListParams(params);

  return useQuery({
    queryKey: queryKeys.designs.list(apiParams),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.DESIGNS.BASE, {
        params: apiParams,
      });
      return designListSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}

// get all active desgins list
export function useActiveDesigns() {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.designs.active,
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.DESIGNS.ALL_ACTIVE);
      return z.array(DesignDtoSchema).parse(response.data);
    },
  });
}
