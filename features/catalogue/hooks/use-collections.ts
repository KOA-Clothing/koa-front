"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { CollectionDtoSchema } from "@/types/collection";
import { queryKeys } from "@/lib/api/query-keys";
import { z } from "zod";

const collectionsSchema = z.array(CollectionDtoSchema);

export function useCollections() {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.catalogue.collections.all,
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.CATALOGUE.COLLECTIONS);
      return collectionsSchema.parse(response.data);
    },
  });
}
