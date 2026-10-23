"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { CollectionDtoSchema } from "@/types/collection";
import { toApiListParams, type ListParams } from "@/types/pagination";
import { queryKeys } from "@/lib/api/query-keys";

const collectionListSchema = paginatedListSchema(CollectionDtoSchema);

/**
 * Server-paginated collection list.
 *
 * Follows the same contract as every other admin list: one `ListParams`
 * object (pagination + `search`) resolved by `toApiListParams` into the
 * endpoint's query params, doubling as the query key so two different
 * requests can never share a cache entry.
 *
 * Backed by `GET /api/v1/collections` (`GetAllCollectionsQuery`), which
 * pages 1-based, matches `search` against name/description, and returns
 * `PaginatedData<CollectionDto>` — serializing to the exact
 * `{ items, totalRecords, ... }` shape `paginatedListSchema` parses.
 */
export function useCollections(params: ListParams) {
  const axiosClient = useAxiosClient();
  const apiParams = toApiListParams(params);

  return useQuery({
    queryKey: queryKeys.collections.list(apiParams),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.COLLECTIONS.BASE, {
        params: apiParams,
      });
      return collectionListSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}
