"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import type { CreateProductVariantInput } from "@/types/product-variant";

const invalidateKeys = [queryKeys.productVariants.all] as const;

type CreateVariantVariables = CreateProductVariantInput & { productId: string };

/** Product variant mutations (create, toggle active status, delete). */
export function useProductVariantMutations() {
  const axiosClient = useAxiosClient();

  const create = useAppMutation<void, CreateVariantVariables>({
    mutationFn: ({ productId, colorId, size, sku }) =>
      axiosClient
        .post(API_ROUTES.PRODUCTS.VARIANTS(productId), { colorId, size, sku })
        .then((r) => r.data),
    invalidateKeys,
    successMessage: "Variant created successfully!",
  });

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

  return { create, toggleActiveStatus, remove };
}