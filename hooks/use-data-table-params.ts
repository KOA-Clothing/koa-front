"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PaginationState } from "@tanstack/react-table";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  type PaginationChangeHandler,
} from "@/types/pagination";

interface UseDataTableParamsOptions {
  /** Fallbacks when the URL has no page params (e.g. an unpaged deep link). */
  initialPageIndex?: number;
  initialPageSize?: number;
}

/** Parses `?pageIndex=&pageSize=` (1-based, matching the .NET API). Returns null for missing/invalid. */
function getPositiveInt(value: string | null): number | null {
  if (!value || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Owns the `PaginationState` for one server-paginated table, with the
 * browser URL as the source of truth.
 *
 * Why the URL? Paging through a server-paginated table changes which
 * data the page shows, so it deserves a shareable, bookmarkable URL
 * (`?pageIndex=2&pageSize=20`) — exactly like a search query would. Each
 * page flip updates the URL via `router.replace` (no scroll jump, no
 * history spam), and a changed URL re-derives `pagination` on render.
 *
 * - The URL and the .NET API both use a **1-based** `pageIndex`;
 *   TanStack Table state is **0-based**, so the conversion happens here.
 * - Future search/filter params simply become extra keys in the URL that
 *   this hook preserves and this pattern extends to.
 *
 * Drop the returned `pagination` object straight into your TanStack Query
 * `queryKey` — a page or page-size change updates the URL, which creates
 * a new `pagination` object, which automatically triggers a refetch.
 * `setPagination` is exactly what <DataTable /> expects for its
 * `onPaginationChange` prop and accepts TanStack's updater signatures.
 */
export function useDataTableParams(options: UseDataTableParamsOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pagination = useMemo<PaginationState>(() => {
    const urlPageIndex = getPositiveInt(searchParams.get("pageIndex"));
    const urlPageSize = getPositiveInt(searchParams.get("pageSize"));

    const pageSize = urlPageSize !== null && PAGE_SIZE_OPTIONS.includes(urlPageSize) ? urlPageSize : options.initialPageSize ?? DEFAULT_PAGE_SIZE;

    const pageIndex =
      urlPageIndex !== null
        ? urlPageIndex - 1 // URL/API is 1-based, table state is 0-based
        : options.initialPageIndex ?? 0;

    return { pageIndex, pageSize };
  }, [searchParams, options.initialPageIndex, options.initialPageSize]);

  /** The current `?search=` keyword ('' when absent). */
  const search = useMemo(
    () => searchParams.get("search") ?? "",
    [searchParams]
  );

  /** Writes table pagination state to the URL, preserving other search params. */
  const setPagination = useCallback<PaginationChangeHandler>(
    (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;

      if (
        next.pageIndex === pagination.pageIndex &&
        next.pageSize === pagination.pageSize
      ) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("pageIndex", String(next.pageIndex + 1));
      params.set("pageSize", String(next.pageSize));

      // `replace` (not `push`) avoids filling history with every page flip;
      // `scroll: false` keeps the user's scroll position while paging.
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pagination, pathname, router, searchParams]
  );

  /** Call this whenever a search/filter value changes so the user lands back on page 1. */
  const resetPageIndex = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [setPagination]);

  /** Writes a search keyword to the URL, resetting to page 1 whenever it changes. */
  const setSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("pageIndex", "1");

      if (value.trim() === "") {
        params.delete("search");
      } else {
        params.set("search", value.trim());
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return { pagination, setPagination, search, setSearch, resetPageIndex };
}