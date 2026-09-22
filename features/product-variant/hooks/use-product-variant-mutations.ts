"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";

const invalidateKeys = [queryKeys.productVariants.all] as const;

/** Product variant mutations (toggle active status, delete). */
export function useProductVariantMutations() {
  const axiosClient = useAxiosClient();

  const toggleActiveStatus = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient
        .patch(API_ROUTES.PRODUCT_VARIANTS.TOGGLE_ACTIVE_STATUS(id))
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Variant status updated",
  });

  const remove = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient
        .delete(API_ROUTES.PRODUCT_VARIANTS.BY_ID(id))
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Variant deleted successfully!",
  });

  return { toggleActiveStatus, remove };
}