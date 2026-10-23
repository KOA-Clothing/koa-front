"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { CollectionItemDtoSchema } from "@/types/collection";

const collectionItemsSchema = z.array(CollectionItemDtoSchema);

interface UseCollectionItemsOptions {
  /**
   * Gate the request (e.g. only while the screen/modal that shows the items
   * is open) — visiting the collections grid shouldn't pay for a request
   * whose results it never renders. Defaults to `true`.
   */
  enabled?: boolean;
}

/**
 * The products linked to one collection
 * (`GET /api/v1/collections/{collectionId}` → `List<CollectionItemDto>`).
 *
 * Deliberately a separate endpoint from the paged collection list: a
 * collection's rows and the products inside it have different shapes, paging
 * needs, and lifetimes — the list page never renders this, and the future
 * collection-items screen never renders the list.
 *
 * Not paginated: the endpoint returns every linked product as one array, so
 * the caller owns any slicing it needs.
 */
export function useCollectionItems(
  collectionId: string,
  { enabled = true }: UseCollectionItemsOptions = {}
) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.collections.items(collectionId),
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ROUTES.COLLECTIONS.BY_ID(collectionId)
      );
      return collectionItemsSchema.parse(response.data);
    },
    enabled: !!collectionId && enabled,
  });
}
