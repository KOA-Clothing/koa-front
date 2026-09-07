import { z } from "zod";
import type { PaginationState } from "@tanstack/react-table";

/**
 * Matches the shape of React's `useState` setter, which is exactly what
 * TanStack Table's `onPaginationChange` table option expects. Defined
 * locally (instead of importing TanStack's internal `OnChangeFn` type) so
 * this file has no dependency on an internal type name that could change
 * between versions.
 */
export type PaginationChangeHandler = (
  updater: PaginationState | ((old: PaginationState) => PaginationState)
) => void;

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 25, 30, 40, 50];

/**
 * TanStack Table's `pageIndex` is zero-based. The ASP.NET Core list
 * endpoints expect a one-based `pageIndex` query param, so this is the
 * one place that conversion happens — every route reuses it. It matches
 * the URL convention the table mirrors in the browser's address bar
 * (see hooks/use-data-table-params.ts).
 */
export function toApiPageParams(pagination: PaginationState) {
  return {
    pageIndex: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  };
}

/**
 * Generic shape for a paginated list response coming back from the .NET
 * API. Adjust the field names here if your DTO uses different casing
 * (e.g. `TotalCount` instead of `totalCount`) — this is the only place
 * that needs to change; every route's response schema is built from this.
 */
export function paginatedResponseSchema<ItemSchema extends z.ZodTypeAny>(
  itemSchema: ItemSchema
) {
  return z.object({
    items: z.array(itemSchema),
    totalCount: z.number(),
  });
}

export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
};