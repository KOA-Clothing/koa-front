"use client"

import TableWithPagination from "@/components/admin/table/TableWithPagination";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { useEffect, useState } from "react";
import { initialPaginator, Paginator } from "@/types/table";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import toast from "react-hot-toast";
import { columns } from "./columns";
import { CategoryDto } from "@/types/category";
import { PaginatedList } from "@/types/api-response";

export default function CategoryPage() {
  const fetchClient = useAxiosClient();
  const [paginator, setPaginator] = useState<Paginator>(initialPaginator)

  const { data, isPending, error, isError } = useQuery<PaginatedList<CategoryDto[]>>({
    queryKey: ['categories', 'list', {
      pageSize: paginator.pageSize, 
      pageIndex: paginator.pageIndex,
    }],
    queryFn: async () => {
      const response = await fetchClient.get(API_ROUTES.CATEGORIES.ALL);
      //console.log(response.data)
      return response.data; 
    },
    placeholderData: (prevData) => prevData,
  })

  useEffect(() => {
    if (isError && error) {
      toast.error(error.message);
    }
  }, [error, isError])
  
  return (
    <div className="flex flex-col gap-6">
      <Item variant="muted" className="border border-neutral-500">
        <ItemContent>
          <ItemTitle className="text-2xl">Category</ItemTitle>
          <ItemDescription className="whitespace-normal line-clamp-none">
            The fundamental structural geometry and cut of an apparel item (ex: T-Shirt, Skirt, Shorts) that serves as the base for a product.
          </ItemDescription>
        </ItemContent>
      </Item>

      <TableWithPagination
        columns={columns as any}
        data={data?.items ?? []} 
        totalRecords={data?.totalRecords ?? 0}
        isLoading={isPending}
        initialPageSize={paginator.pageSize}
        onPaginationChange={(newPagination) => {
          setPaginator((prev) => ({
            ...prev,
            ...newPagination
          }))
        }}
      />
    </div>
  )
}