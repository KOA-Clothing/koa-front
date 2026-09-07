import {
  createColumnHelper,
  createSortedRowModel,
  RowData,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  type ColumnDef,
} from "@tanstack/react-table";

/**
 * Central feature registration, shared by every data table in the app.
 *
 * `rowPaginationFeature` is registered without a client-side row model
 * (`paginatedRowModel`) because every table built with <DataTable /> uses
 * *manual* (server-side) pagination — the .NET API returns one page of rows
 * at a time. See "Manual Server-Side Pagination":
 * https://tanstack.com/table/latest/docs/framework/react/guide/pagination
 *
 * `rowSortingFeature` + `createSortedRowModel` give each table **client-side
 * sorting of the currently fetched rows**. No `manualSorting` is set, so
 * clicking a column header reorders the page of data already in the browser
 * (asc -> desc -> off via TanStack's `getToggleSortingHandler`). Since the
 * sorted row model sorts whatever rows are in `data`, it sorts only the
 * loaded page — which is what <DataTable /> is built for today. If a route
 * later moves sorting to the server, set `manualSorting: true` on that
 * table's useTable call (the feature/APIs stay the same).
 *
 * The `sortFns` registry provides the built-ins that the default
 * `sortFn: 'auto'` resolves to based on column data type (alphanumeric /
 * text / datetime / basic). See the Sorting guide:
 * https://tanstack.com/table/latest/docs/framework/react/guide/sorting
 */
export const tableFeatureSet = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
    basic: sortFn_basic,
  },
});

export type AppTableFeatures = typeof tableFeatureSet;

/**
 * Shorthand so a route's columns.tsx doesn't need to repeat
 * `ColumnDef<typeof tableFeatureSet, TData, TValue>` for every column.
 *
 * TValue is left at its `unknown` default and NOT threaded through as a
 * second generic param on <DataTable />. A single columns.tsx normally
 * defines columns with different value types (string, boolean, number...),
 * so the array returned is a union of precisely-typed ColumnDefs. Trying
 * to force that whole union into one caller-supplied `TValue` is what
 * produces TS errors like "Type 'unknown' is not assignable to type
 * 'TValue'" — `TValue` could be instantiated as anything, so the compiler
 * can't assume it lines up with a specific column's value type.
 *
 * The fix used throughout this app: build columns.tsx's return value with
 * `columnHelper.columns([...])` (not a bare array literal). That helper
 * normalizes the heterogeneous array into ColumnDef<Features, TData,
 * unknown>[], which is exactly what this type — and <DataTable />'s
 * `columns` prop — expect.
 */
export type DataTableColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<
  AppTableFeatures,
  TData,
  TValue
>;

/**
 * Column helper pre-bound to the shared feature set. Use this instead of
 * importing `createColumnHelper` directly in every columns.tsx.
 *
 * Usage:
 *   const columnHelper = createDataTableColumnHelper<Category>()
 *   export function getCategoryColumns(...) {
 *     return columnHelper.columns([
 *       columnHelper.accessor('name', { header: 'Name' }),
 *       ...
 *     ])
 *   }
 */
export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<AppTableFeatures, TData>();
}