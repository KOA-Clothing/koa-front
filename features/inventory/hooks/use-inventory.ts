"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import type { InventoryFilters } from "@/types/filters/inventory-filters";
import { InventoryDtoSchema } from "@/types/inventory";
import { toApiListParams, type ListParams } from "@/types/pagination";

const inventoryTableSchema = paginatedListSchema(InventoryDtoSchema);

/**
 * Server-paginated inventory table. Rows are `InventoryDto` — stock levels for
 * one product variant, with the product's id/name denormalized so the table
 * needs a single request.
 *
 * Takes the whole request as one `ListParams` object (pagination + `search` +
 * this route's filter bag) so adding a filter to `InventoryFilters` doesn't
 * change this signature. `toApiListParams` resolves it to the .NET endpoint's
 * query params and doubles as the query key, so two different filter
 * combinations can never share a cache entry.
 */
export function useInventory(params: ListParams<InventoryFilters>) {
  const axiosClient = useAxiosClient();
  const apiParams = toApiListParams(params);

  return useQuery({
    queryKey: queryKeys.inventory.list(apiParams),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.INVENTORY.BASE, {
        params: apiParams,
      });
      return inventoryTableSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}
