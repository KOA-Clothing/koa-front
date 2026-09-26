"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { PaginationState } from "@tanstack/react-table";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  type PaginationChangeHandler,
} from "@/types/pagination";
import {
  isFilterUnset,
  type FilterSpecsRecord,
  type FilterValue,
  type SpecsToBag,
} from "@/types/filters/table-filters";
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

interface UseServerTableParamsOptions<S extends FilterSpecsRecord> {
  /** Fallbacks when the URL has no page params (e.g. an unpaged deep link). */
  initialPageIndex?: number;
  initialPageSize?: number;
  /**
   * This route's filter metadata, keyed by API query param name. Must be a
   * stable reference (module level, not an inline literal) so the derived URL
   * schema doesn't rebuild on every render.
   */
  filters?: S;
}

/**
 * Owns everything one server-paginated table keeps in the URL: the
 * `PaginationState`, the `search` keyword, and the route's typed filter bag —
 * with the browser URL as the single source of truth (see `useUrlState` for
 * why).
 *
 * The URL/API use a **1-based** `pageIndex`; TanStack Table state is
 * **0-based**, and the conversion happens here (and mirrored in
 * `types/pagination.ts#toApiListParams`).
 *
 * Drop the returned `pagination` object straight into your TanStack Query
 * `queryKey` — a URL change produces new `pagination`/`search`/`filters`,
 * which triggers a refetch. `setPagination` is exactly what <KoaTable />
 * expects for its `onPaginationChange` prop. `search`/`setSearch` are the
 * URL-backed search term used with `useSearchField` (which handles debouncing).
 *
 * ## Filters
 *
 * Pass `filters` (a `FilterSpecs` object, `satisfies`-checked against its
 * filter-bag interface) and you get a fully typed bag back:
 *
 *   const t = useServerTableParams({ filters: productFilterSpecs });
 *   t.filters.gender   // Gender | undefined — no casts, no string keys
 *   t.setFilter("gender", GenderEnum.Unisex);
 *
 * Each spec key is registered as a URL param, so:
 * - writing a filter replaces the URL and resets to page 1, atomically;
 * - writing a filter back to its unset value *removes* it from the URL;
 * - `clearFilters()` clears every filter at once, and deliberately leaves
 *   `search` alone — the search box and the filter bar are independent
 *   controls that happen to feed the same request.
 *
 * A spec's `parse` is what validates the raw URL string, so a hand-edited
 * `?gender=9` or `?productId=nope` reads back as *unset* instead of reaching
 * the API as garbage.
 */
export function useServerTableParams<S extends FilterSpecsRecord = FilterSpecsRecord>(
  options: UseServerTableParamsOptions<S> = {}
) {
  type Bag = SpecsToBag<S>;

  const { filters: specs, initialPageIndex, initialPageSize } = options;
  const searchParams = useSearchParams();

  const schema = useMemo(
    () =>
      ({
        ...TABLE_URL_SCHEMA,
        // Registering each spec key is what lets `writeParams` DELETE it from
        // the URL when the filter is unset. The dynamic keys are deliberately
        // hidden from the inferred type — filter values are read (and parsed)
        // through `searchParams` + `spec.parse` below instead, which keeps the
        // table's own params strongly typed.
        ...Object.fromEntries(
          Object.keys(specs ?? {}).map((key) => [
            key,
            { kind: "string", trim: true, default: "" },
          ])
        ),
        pageIndex: { ...TABLE_URL_SCHEMA.pageIndex, default: initialPageIndex ?? 1 },
        pageSize: { ...TABLE_URL_SCHEMA.pageSize, default: initialPageSize ?? DEFAULT_PAGE_SIZE },
      }) as unknown as typeof TABLE_URL_SCHEMA,
    [specs, initialPageIndex, initialPageSize]
  );

  const { state, setParams } = useUrlState(schema);

  /**
   * The single writer for the URL. Widened because the schema's dynamic filter
   * keys are hidden from its type (see above) while its runtime shape still
   * carries them.
   */
  const writeParams = setParams as unknown as (patch: Record<string, unknown>) => void;

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: state.pageIndex - 1,
      pageSize: state.pageSize,
    }),
    [state.pageIndex, state.pageSize]
  );

  /** Runs every spec's `parse` over the raw URL params into a typed bag. */
  const filters = useMemo(() => {
    const result: Record<string, FilterValue | undefined> = {};

    for (const [key, spec] of Object.entries(specs ?? {})) {
      // `parse` reports "invalid" as `null`; the bag's unset value is
      // `undefined` (matching the optional props on a `FilterBag`). `??` keeps
      // a legitimately falsy value like `false` or `0` intact.
      result[key] = spec.parse(searchParams.get(key) ?? "") ?? undefined;
    }

    return result as Bag;
  }, [specs, searchParams]);

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

      writeParams({ pageIndex: next.pageIndex + 1, pageSize: next.pageSize });
    },
    [pagination, writeParams]
  );

  /** Writes a search keyword to the URL, resetting to page 1. */
  const setSearch = useCallback(
    (value: string) => {
      writeParams({ search: value, pageIndex: 1 });
    },
    [writeParams]
  );

  /**
   * Sets (or clears) one filter, resetting to page 1 in the same write so the
   * new result set can never land on a page that no longer exists.
   */
  const setFilter = useCallback(
    <K extends keyof Bag>(key: K, value: Bag[K] | undefined) => {
      writeParams({
        [key as string]: isFilterUnset(value) ? "" : String(value),
        pageIndex: 1,
      });
    },
    [writeParams]
  );

  /** Clears one filter (same semantics as setting it to `undefined`). */
  const clearFilter = useCallback(
    <K extends keyof Bag>(key: K) => setFilter(key, undefined),
    [setFilter]
  );

  /** Clears every filter at once. Never touches `search`. */
  const clearFilters = useCallback(() => {
    const patch: Record<string, unknown> = { pageIndex: 1 };

    for (const key of Object.keys(specs ?? {})) {
      patch[key] = "";
    }

    writeParams(patch);
  }, [specs, writeParams]);

  /** Returns to page 1 (e.g. when a filter changes without touching `search`). */
  const resetPageIndex = useCallback(() => {
    writeParams({ pageIndex: 1 });
  }, [writeParams]);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((value) => !isFilterUnset(value)),
    [filters]
  );

  return {
    pagination,
    setPagination,
    search: state.search,
    setSearch,
    filters,
    setFilter,
    clearFilter,
    clearFilters,
    hasActiveFilters,
    resetPageIndex,
  };
}
