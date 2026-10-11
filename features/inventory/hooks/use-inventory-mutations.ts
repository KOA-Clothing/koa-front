"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import { queryKeys } from "@/lib/api/query-keys";
import { API_ROUTES } from "@/lib/configs/api-routes";
import type { AddInventoryResponse } from "@/types/inventory";

interface AddInventoryVariables {
  inventoryId: string;
  quantity: number;
}

/**
 * Inventory mutations. Currently only "add stock", which increases a variant's
 * on-hand quantity by a positive amount — the endpoint is additive, so it is a
 * `PATCH` on `/inventory/{id}/add` rather than a write of the whole row.
 *
 * Invalidates `queryKeys.inventory.all`, which covers every filtered/paginated
 * inventory list, so the table reflects the new level without a manual refetch.
 */
export function useInventoryMutations() {
  const axiosClient = useAxiosClient();

  const addInventory = useAppMutation<AddInventoryResponse, AddInventoryVariables>({
    mutationFn: ({ inventoryId, quantity }) =>
      axiosClient
        .patch(API_ROUTES.INVENTORY.ADD(inventoryId), { quantity })
        .then((r) => r.data),
    invalidateKeys: [queryKeys.inventory.all],
    successMessage: "Inventory updated successfully!",
  });

  return { addInventory };
}
