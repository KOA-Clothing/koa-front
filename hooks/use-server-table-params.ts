"use client";

import { useCallback, useMemo } from "react";
import type { PaginationState } from "@tanstack/react-table";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  type PaginationChangeHandler,
} from "@/types/pagination";
import { useUrlState, type UrlParamSchema } from "./use-url-state";

/**
 * URL schema backing every server-paginated table. All values are 1-based
 * (matching the .NET list endpoints' `pageIndex` query param) except where
 * the adapter converts to/from TanStack Table's 0-based state.
 */
const TABLE_URL_SCHEMA = {
  pageIndex: { kind: "number", min: 1, default: 1 },
  pageSize: { kind: "number", in: PAGE_SIZE_OPTIONS, default: DEFAULT_PAGE_SIZE },
  search: { kind: "string", trim: true, default: "" },
} as const satisfies UrlParamSchema;

interface UseServerTableParamsOptions {
  /** Fallbacks when the URL has no page params (e.g. an unpaged deep link). */
  initialPageIndex?: number;
  initialPageSize?: number;
}

/**
 * Owns the `PaginationState` (plus a `search` keyword) for one
 * server-paginated table, with the browser URL as the single source of
 * truth — see `useUrlState` for why.
 *
 * The URL/API use a **1-based** `pageIndex`; TanStack Table state is
 * **0-based**, and the conversion happens here (and mirrored in
 * `types/pagination.ts#toApiPageParams`).
 *
 * Drop the returned `pagination` object straight into your TanStack Query
 * `queryKey` — a URL change produces a new `pagination`/`search`, which
 * triggers a refetch. `setPagination` is exactly what <KoaTable /> expects
 * for its `onPaginationChange` prop. `search`/`setSearch` are the URL-backed
 * search term used with `useSearchField` (which handles debouncing).
 */
export function useServerTableParams(options: UseServerTableParamsOptions = {}) {
  const schema = useMemo(
    () =>
      ({
        ...TABLE_URL_SCHEMA,
        pageIndex: { ...TABLE_URL_SCHEMA.pageIndex, default: options.initialPageIndex ?? 1 },
        pageSize: { ...TABLE_URL_SCHEMA.pageSize, default: options.initialPageSize ?? DEFAULT_PAGE_SIZE },
      }) as const satisfies UrlParamSchema,
    [options.initialPageIndex, options.initialPageSize]
  );

  const { state, setParams } = useUrlState(schema);

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: state.pageIndex - 1,
      pageSize: state.pageSize,
    }),
    [state.pageIndex, state.pageSize]
  );

  /** Writes table pagination state to the URL, preserving all other params. */
  const setPagination = useCallback<PaginationChangeHandler>(
    (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;

      if (
        next.pageIndex === pagination.pageIndex &&
        next.pageSize === pagination.pageSize
      ) {
        return;
      }

      setParams({ pageIndex: next.pageIndex + 1, pageSize: next.pageSize });
    },
    [pagination, setParams]
  );

  /** Writes a search keyword to the URL, resetting to page 1. */
  const setSearch = useCallback(
    (value: string) => {
      setParams({ search: value, pageIndex: 1 });
    },
    [setParams]
  );

  /** Returns to page 1 (e.g. when a filter changes without touching `search`). */
  const resetPageIndex = useCallback(() => {
    setParams({ pageIndex: 1 });
  }, [setParams]);

  return {
    pagination,
    setPagination,
    search: state.search,
    setSearch,
    resetPageIndex,
  };
}