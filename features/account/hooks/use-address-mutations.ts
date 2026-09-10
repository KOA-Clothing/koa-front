"use client";

import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { useAppMutation } from "@/lib/api/use-app-mutation";
import type { AddressFormInput } from "@/types/address";

const invalidateKeys = [queryKeys.userProfile] as const;

/** All address mutations (create/update/delete/set-default) for the account area. */
export function useAddressMutations() {
  const axiosClient = useAxiosClient();

  const create = useAppMutation<void, AddressFormInput>({
    mutationFn: (payload) =>
      axiosClient.post(API_ROUTES.ADDRESSES.BASE, payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Address added successfully!",
  });

  const update = useAppMutation<void, { id: string; payload: AddressFormInput }>({
    mutationFn: ({ id, payload }) =>
      axiosClient.put(API_ROUTES.ADDRESSES.BY_ID(id), payload).then((r) => r.data),
    invalidateKeys,
    successMessage: "Address updated successfully!",
  });

  const remove = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.delete(API_ROUTES.ADDRESSES.BY_ID(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Address deleted successfully!",
  });

  const setDefault = useAppMutation<void, string>({
    mutationFn: (id) =>
      axiosClient.put(API_ROUTES.ADDRESSES.SET_DEFAULT(id)).then((r) => r.data),
    invalidateKeys,
    successMessage: "Default address updated successfully!",
  });

  return { create, update, remove, setDefault };
}