"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";

const invalidateKeys = [queryKeys.colors.all] as const;

export function useColorMutations() {
  const axiosClient = useAxiosClient();

  const toggleActiveStatus = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.post(API_ROUTES.COLORS.TOGGLE_ACTIVE_STATUS(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Color updated",
  });

  return { toggleActiveStatus };
}