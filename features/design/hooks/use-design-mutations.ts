"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import type { DesignFormInput } from "@/types/design";

const invalidateKeys = [queryKeys.designs.all] as const;

export function useDesignMutations() {
  const axiosClient = useAxiosClient();

  const create = useAppMutation<void, DesignFormInput>({
    mutationFn: (payload) => axiosClient.post(API_ROUTES.DESIGNS.BASE, payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Design created successfully!",
  });

  const toggleActiveStatus = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.post(API_ROUTES.DESIGNS.TOGGLE_ACTIVE_STATUS(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Design updated",
  });

  const remove = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.delete(API_ROUTES.DESIGNS.BY_ID(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Design deleted successfully!",
  });

  const update = useAppMutation<void, { id: string; payload: DesignFormInput }>({
    mutationFn: ({ id, payload }) =>
      axiosClient.put(API_ROUTES.DESIGNS.BY_ID(id), payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Design updated successfully!",
  });

  return { create, toggleActiveStatus, remove, update };
}
