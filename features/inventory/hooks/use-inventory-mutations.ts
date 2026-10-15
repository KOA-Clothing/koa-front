"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import { queryKeys } from "@/lib/api/query-keys";
import { API_ROUTES } from "@/lib/configs/api-routes";
import type {
  AddInventoryResponse,
  SetLowStockThresholdResponse,
} from "@/types/inventory";

interface AddInventoryVariables {
  inventoryId: string;
  quantity: number;
}

interface SetLowStockThresholdVariables {
  inventoryId: string;
  lowStockThreshold: number;
}

/**
 * Inventory mutations.
 *
 * - `addInventory` *increases* a variant's on-hand quantity by a positive amount
 *   (`PATCH /inventory/{id}/add`).
 * - `setLowStockThreshold` *replaces* the row's low-stock threshold with an
 *   absolute value (`PATCH /inventory/{id}`) — a set, not an add, so it can
 *   lower the threshold as well as raise it.
 *
 * Both invalidate `queryKeys.inventory.all`, which covers every filtered/
 * paginated inventory list, so the table reflects the change without a manual
 * refetch.
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

  const setLowStockThreshold = useAppMutation<
    SetLowStockThresholdResponse,
    SetLowStockThresholdVariables
  >({
    mutationFn: ({ inventoryId, lowStockThreshold }) =>
      axiosClient
        .patch(API_ROUTES.INVENTORY.BY_ID(inventoryId), { lowStockThreshold })
        .then((r) => r.data),
    invalidateKeys: [queryKeys.inventory.all],
    successMessage: "Low stock threshold updated successfully!",
  });

  return { addInventory, setLowStockThreshold };
}
