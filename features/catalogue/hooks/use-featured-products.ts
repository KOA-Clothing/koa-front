"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { ProductCardDtoSchema } from "@/types/product";
import { queryKeys } from "@/lib/api/query-keys";

const featuredProductsSchema = paginatedListSchema(ProductCardDtoSchema);

export interface FeaturedProductsParams {
  pageIndex: number;
  pageSize: number;
}

/**
 * The landing page's featured-products feed (`GET /catalogue/products/featured`).
 *
 * Only products flagged `isFeatured` come back, already paginated by the
 * backend. `placeholderData` keeps the current page's grid on screen while the
 * next one loads, so paging doesn't flash a skeleton over the whole section.
 */
export function useFeaturedProducts(params: FeaturedProductsParams) {
  const axiosClient = useAxiosClient();

  const queryParams = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
  };

  return useQuery({
    queryKey: queryKeys.catalogue.products.featured(queryParams),
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ROUTES.CATALOGUE.FEATURED_PRODUCTS,
        { params: queryParams }
      );
      return featuredProductsSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}
