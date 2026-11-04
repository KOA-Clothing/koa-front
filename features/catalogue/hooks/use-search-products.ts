"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { paginatedListSchema } from "@/types/api-response";
import { ProductCardDtoSchema } from "@/types/product";
import { queryKeys } from "@/lib/api/query-keys";

const searchProductsSchema = paginatedListSchema(ProductCardDtoSchema);

export interface SearchProductsParams {
  searchTerm?: string;
  pageIndex: number;
  pageSize: number;
}

export function useSearchProducts(params: SearchProductsParams) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5261";

  const queryParams = {
    searchTerm: params.searchTerm?.trim() || "",
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
  };

  return useQuery({
    queryKey: queryKeys.catalogue.products.search(queryParams),
    queryFn: async () => {
      const response = await axios.get(`${baseURL}${API_ROUTES.CATALOGUE.PRODUCTS}`, {
        params: queryParams,
      });
      return searchProductsSchema.parse(response.data);
    },
    placeholderData: (previousData) => previousData,
  });
}
