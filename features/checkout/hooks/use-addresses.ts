"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useAxiosClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { AddressDtoSchema } from "@/types/address";

/**
 * The signed-in customer's saved addresses, for the checkout address picker.
 *
 * Uses the dedicated `addresses/all` endpoint instead of `useUserProfile`
 * because checkout only needs the addresses and must not pull the whole
 * profile (phone numbers, external accounts) just to render a picker.
 */
export function useAddresses(enabled = true) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.addresses.all,
    enabled,
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.ADDRESSES.ALL);
      return z.array(AddressDtoSchema).parse(response.data);
    },
  });
}
