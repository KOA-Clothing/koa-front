"use client";

import { useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { DEFAULT_PAGE_SIZE } from "@/types/pagination";

interface UseDataTableParamsOptions {
  initialPageIndex?: number;
  initialPageSize?: number;
}

/**
 * Owns the `PaginationState` for one server-paginated table.
 *
 * Drop the returned `pagination` object straight into your TanStack Query
 * `queryKey` — a page or page-size change will then automatically trigger
 * a refetch, and `setPagination` is exactly what <DataTable /> expects for
 * its `onPaginationChange` prop.
 */
export function useDataTableParams(options: UseDataTableParamsOptions = {}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: options.initialPageIndex ?? 0,
    pageSize: options.initialPageSize ?? DEFAULT_PAGE_SIZE,
  });

  /** Call this whenever a search/filter value changes so the user lands back on page 1. */
  const resetPageIndex = () =>
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));

  return { pagination, setPagination, resetPageIndex };
}