"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { CategoryDtoSchema } from "@/types/category";
import { queryKeys } from "@/lib/api/query-keys";

const shopCategoriesSchema = paginatedListSchema(CategoryDtoSchema);

export interface ShopCategoriesParams {
  pageIndex: number;
  pageSize: number;
}

/**
 * Paginated categories for the shop-front "Shop By Category" carousel
 * (`GET /catalogue/products/by-categories`).
 *
 * Distinct from `features/category/hooks/use-categories.ts`, which targets the
 * admin table: this one calls the public catalogue endpoint and takes only
 * pagination. `placeholderData` keeps the current cards visible while the next
 * page loads.
 */
export function useShopCategories(params: ShopCategoriesParams) {
  const axiosClient = useAxiosClient();

  const queryParams = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
  };

  return useQuery({
    queryKey: queryKeys.catalogue.categories(queryParams),
    queryFn: async () => {
      const response = await axiosClient.get(API_ROUTES.CATALOGUE.CATEGORIES, {
        params: queryParams,
      });
      return shopCategoriesSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}
