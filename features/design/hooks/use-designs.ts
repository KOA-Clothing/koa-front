"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import type { PaginationState } from "@tanstack/react-table";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { DesignDtoSchema } from "@/types/design";
import { toApiPageParams } from "@/types/pagination";
import { queryKeys } from "@/lib/api/query-keys";

const designListSchema = paginatedListSchema(DesignDtoSchema);

// get paginated designs list
export function useDesigns(pagination: PaginationState, search: string) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.designs.list({ pagination, search }),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.DESIGNS.BASE, {
        params: toApiPageParams(pagination, search),
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
