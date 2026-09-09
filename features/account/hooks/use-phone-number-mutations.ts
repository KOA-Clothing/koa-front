"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import type { PhoneNumberFormInput } from "@/types/phone-number";

const invalidateKeys = [queryKeys.userProfile] as const;

/** All phone-number mutations (create/update/delete/set-default) for the account area. */
export function usePhoneNumberMutations() {
  const axiosClient = useAxiosClient();

  const create = useAppMutation<void, PhoneNumberFormInput>({
    mutationFn: (payload) =>
      axiosClient.post(API_ROUTES.PHONE_NUMBERS.BASE, payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Phone number added successfully!",
  });

  const update = useAppMutation<void, { id: string; payload: PhoneNumberFormInput }>({
    mutationFn: ({ id, payload }) =>
      axiosClient.put(API_ROUTES.PHONE_NUMBERS.BY_ID(id), payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Phone number updated successfully!",
  });

  const remove = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.delete(API_ROUTES.PHONE_NUMBERS.BY_ID(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Phone number deleted successfully!",
  });

  const setDefault = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.put(API_ROUTES.PHONE_NUMBERS.SET_DEFAULT(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Default phone number updated successfully!",
  });

  return { create, update, remove, setDefault };
}