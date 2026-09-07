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
 *
 * Keeping this as one shared, module-scoped `tableFeatures()` call (rather
 * than redefining it per route) is what lets every columns.tsx file use
 * the same `DataTableColumnDef` / `createDataTableColumnHelper` below.
 */
export const tableFeatureSet = tableFeatures({
  rowPaginationFeature,
});

export type AppTableFeatures = typeof tableFeatureSet;

/**
 * Shorthand so a route's columns.tsx doesn't need to repeat
 * `ColumnDef<typeof tableFeatureSet, TData, TValue>` for every column.
 *
 * Usage in a route's columns.tsx:
 *   const columns: DataTableColumnDef<Category>[] = [...]
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
 *   columnHelper.accessor('name', { header: 'Name' })
 */
export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<AppTableFeatures, TData>();
}