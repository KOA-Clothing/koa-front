"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { ColorDtoSchema } from "@/types/color";
import { toApiPageParams } from "@/types/pagination";
import { queryKeys } from "@/lib/api/query-keys";

const colorListSchema = paginatedListSchema(ColorDtoSchema);

export function useColors(pagination: PaginationState, search: string) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.colors.list({ pagination, search }),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.COLORS.BASE, {
        params: toApiPageParams(pagination, search),
      });
      return colorListSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}