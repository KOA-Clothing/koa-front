"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { ProductCardDtoSchema } from "@/types/product";
import { queryKeys } from "@/lib/api/query-keys";

const discountedProductsSchema = paginatedListSchema(ProductCardDtoSchema);

export interface DiscountedProductsParams {
  pageIndex: number;
  pageSize: number;
}

/**
 * The landing page's discounted-products feed
 * (`GET /catalogue/products/discounted`).
 *
 * Only active products with a live discount come back, already paginated by
 * the backend. `placeholderData` keeps the current page's grid on screen while
 * the next one loads, so paging doesn't flash a skeleton over the section.
 */
export function useDiscountedProducts(params: DiscountedProductsParams) {
  const axiosClient = useAxiosClient();

  const queryParams = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
  };

  return useQuery({
    queryKey: queryKeys.catalogue.products.discounted(queryParams),
    queryFn: async () => {
      const response = await axiosClient.get(
        API_ROUTES.CATALOGUE.DISCOUNTED_PRODUCTS,
        { params: queryParams }
      );
      return discountedProductsSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}
