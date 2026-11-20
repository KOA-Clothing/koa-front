"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/api/query-keys";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { OrderDtoSchema, type OrderDto } from "@/types/order";

interface UseOrderOptions {
  enabled?: boolean;
  /**
   * Milliseconds between polls, `false` to fetch once, or a callback so the
   * caller can stop polling as soon as the order leaves `PENDING`.
   */
  refetchInterval?: UseQueryOptions<OrderDto, Error>["refetchInterval"];
}

/**
 * One of the signed-in customer's orders. The payment-status page polls this
 * while PayHere's webhook settles the order; the backend scopes the lookup to
 * the caller, so an unknown/foreign id is a 404 rather than someone else's
 * order.
 */
export function useOrder(orderId: string | null, options: UseOrderOptions = {}) {
  const axiosClient = useAxiosClient();
  const { enabled = true, refetchInterval = false } = options;

  return useQuery({
    queryKey: queryKeys.orders.detail(orderId ?? "none"),
    enabled: enabled && Boolean(orderId),
    queryFn: async () => {
      if (!orderId) throw new Error("Missing order id");
      const response = await axiosClient.get(API_ROUTES.ORDERS.BY_ID(orderId));
      return OrderDtoSchema.parse(response.data);
    },
    refetchInterval,
    refetchOnWindowFocus: false,
  });
}
