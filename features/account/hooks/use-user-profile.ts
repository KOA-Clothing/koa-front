"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { UserProfileDtoSchema } from "@/types/user";
import { queryKeys } from "@/lib/api/query-keys";

/** The signed-in user's full profile (shared by the admin and account areas). */
export function useUserProfile() {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.USERS.PROFILE);
      return UserProfileDtoSchema.parse(response.data);
    },
  });
}