import { z } from "zod";

export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

export interface PaginatedList<T> {
  items: T[];
  totalRecords: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Zod schema matching `PaginatedList<T>`, the shape every .NET list
 * endpoint returns. The single place that changes if the API casing/fields
 * drift (e.g. `TotalCount` instead of `totalRecords`).
 */
export function paginatedListSchema<ItemSchema extends z.ZodTypeAny>(
  itemSchema: ItemSchema
) {
  return z.object({
    items: z.array(itemSchema),
    totalRecords: z.number(),
    pageIndex: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  });
}

export type PaginatedListSchema<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof paginatedListSchema<T>>
>;