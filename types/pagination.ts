import type { PaginationState } from "@tanstack/react-table";
import { serializeFilters, type FilterValue } from "./filters/table-filters";

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
export function toApiPageParams(pagination: PaginationState, search?: string) {
  return {
    pageIndex: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ...(search && search.trim() !== "" ? { search } : {}),
  };
}

/**
 * Everything one server-paginated list request needs: TanStack's pagination
 * state, the text search term, and the route's typed filter bag. Keeping the
 * filters in a bag (rather than a 4th positional argument) is what lets a page
 * declare its own filters without every list hook's signature changing.
 */
export interface ListParams<F extends object = Record<string, FilterValue | undefined>> {
  pagination: PaginationState;
  search: string;
  filters: F;
}

/**
 * Flattens `ListParams` into the .NET list endpoint's query params.
 *
 * Unset filters are omitted entirely; a filter explicitly set to `false` is
 * kept (see `isFilterUnset` for why that's not a falsiness check).
 */
export function toApiListParams<F extends object>({
  pagination,
  search,
  filters,
}: ListParams<F>) {
  return {
    pageIndex: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    ...(search.trim() !== "" ? { search } : {}),
    ...serializeFilters(filters),
  };
}