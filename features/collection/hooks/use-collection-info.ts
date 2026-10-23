"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { queryKeys } from "@/lib/api/query-keys";
import { CollectionDtoSchema } from "@/types/collection";

/**
 * One collection's own record
 * (`GET /api/v1/collections/{collectionId}/info` → `CollectionDto`): name,
 * description, cover image, active flag and `itemCount`.
 *
 * A separate request from `useCollectionItems` because the two answer different
 * questions: `BY_ID` returns the *products* inside a collection and nothing
 * about the collection itself, so `/info` is the only way the detail page can
 * title itself. It also doubles as the page's existence check — an id that
 * doesn't resolve answers 404 here, whereas the items endpoint replies
 * `200 + []`, which is indistinguishable from an empty collection.
 *
 * Cached under `collections`, so the shared `collections.all` invalidation in
 * `useCollectionMutations` refreshes it after an edit or an item change.
 */
export function useCollectionInfo(collectionId: string) {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: queryKeys.collections.info(collectionId),
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ROUTES.COLLECTIONS.INFO(collectionId)
      );
      return CollectionDtoSchema.parse(response.data);
    },
    enabled: !!collectionId,
  });
}
