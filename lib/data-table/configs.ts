import {
  createColumnHelper,
  RowData,
  rowPaginationFeature,
  tableFeatures,
  type ColumnDef,
} from "@tanstack/react-table";

/**
 * Central feature registration, shared by every data table in the app.
 *
 * Only `rowPaginationFeature` is registered, and no client-side row model
 * (`paginatedRowModel`) is added for it, because every table built with
 * <DataTable /> uses *manual* (server-side) pagination — the .NET API
 * returns one page of rows at a time, so the browser never needs to slice
 * pages itself. See "Manual Server-Side Pagination":
 * https://tanstack.com/table/latest/docs/framework/react/guide/pagination
 *
 * If a specific route later needs sortable columns or column filters,
 * register `rowSortingFeature` / `columnFilteringFeature` here too (still
 * without a client-side row model, and with `manualSorting` /
 * `manualFiltering` set on that table's useTable call, since the server
 * does that work as well). See the Features guide for how features, row
 * models, and function registries fit together:
 * https://tanstack.com/table/latest/docs/guide/features
 */
export const tableFeatureSet = tableFeatures({
  rowPaginationFeature,
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