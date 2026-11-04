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
 * Shop-front product grids are laid out in 2/3/4 columns, so their page sizes
 * are multiples of 12 rather than the admin tables' arbitrary sizes. Kept
 * separate so changing one never quietly changes the other.
 */
export const SHOP_DEFAULT_PAGE_SIZE = 12;
export const SHOP_PAGE_SIZE_OPTIONS = [12, 24, 36, 48] as const;

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
 * TanStack Table's `pageIndex` is zero-based while the ASP.NET Core list
 * endpoints expect a one-based one, so this is the only place that conversion
 * happens. Unset filters are omitted entirely; a filter explicitly set to
 * `false` is kept (see `isFilterUnset` for why that's not a falsiness check).
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