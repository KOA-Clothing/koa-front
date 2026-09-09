"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import type { UpdateProfileInput } from "@/types/user";

const invalidateKeys = [queryKeys.userProfile] as const;

/** The signed-in user's own profile/password mutations. */
export function useProfileMutations() {
  const axiosClient = useAxiosClient();

  const updateProfile = useAppMutation<void, UpdateProfileInput>({
    mutationFn: (payload) =>
      axiosClient.put(API_ROUTES.USERS.PROFILE, payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Profile updated successfully!",
  });

  const updatePassword = useAppMutation<void, { password: string }>({
    mutationFn: ({ password }) =>
      axiosClient.put(API_ROUTES.USERS.PASSWORD, { password }).then((r) => r.data),
    invalidateKeys,
    successMessage: "Password updated successfully!",
  });

  return { updateProfile, updatePassword };
}