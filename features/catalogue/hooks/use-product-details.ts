"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { ProductDetailsDtoSchema } from "@/types/product";
import { queryKeys } from "@/lib/api/query-keys";

export function useProductDetails(productId: string) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.catalogue.products.detail(productId),
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ROUTES.CATALOGUE.PRODUCT_BY_ID(productId)
      );
      return ProductDetailsDtoSchema.parse(response.data);
    },
    enabled: !!productId,
  });
}
