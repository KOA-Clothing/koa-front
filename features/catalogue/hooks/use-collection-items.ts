"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { ProductCardDtoSchema } from "@/types/product";
import { queryKeys } from "@/lib/api/query-keys";
import { z } from "zod";

const collectionProductsSchema = z.array(ProductCardDtoSchema);

export function useCollectionItems(collectionId: string) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.catalogue.collections.items(collectionId),
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ROUTES.CATALOGUE.COLLECTION_ITEMS(collectionId)
      );
      return collectionProductsSchema.parse(response.data);
    },
    enabled: !!collectionId,
  });
}
