"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import type { ProductFormInput } from "@/types/product";

const invalidateKeys = [queryKeys.products.all] as const;

/** All product mutations (create, update, delete). */
export function useProductMutations() {
  const axiosClient = useAxiosClient();

  const create = useAppMutation<void, ProductFormInput>({
    mutationFn: (payload) => axiosClient.post(API_ROUTES.PRODUCTS.BASE, payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product created successfully!",
  });

  const remove = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.delete(API_ROUTES.PRODUCTS.BY_ID(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product deleted successfully!",
  });

  const update = useAppMutation<void, { id: string; payload: ProductFormInput }>({
    mutationFn: ({ id, payload }) =>
      axiosClient.put(API_ROUTES.PRODUCTS.BY_ID(id), payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Product updated successfully!",
  });

  return { create, remove, update };
}