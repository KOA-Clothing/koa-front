"use client";

import { RowData, useTable, type PaginationState } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaginationChangeHandler } from "@/types/pagination";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableColumnDef, tableFeatureSet } from "@/lib/data-table/configs";

interface DataTableProps<TData extends RowData> {
  // TValue is intentionally not a generic param here — see the note on
  // DataTableColumnDef in lib/data-table/config.ts for why.
  columns: DataTableColumnDef<TData>[];
  data: TData[];
  /** Total row count across every page, from the API — required for manual pagination. */
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: PaginationChangeHandler;
  isLoading?: boolean;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  className?: string;
}

/**
 * Generic, reusable, server-paginated data table.
 *
 * Renders the <table> UI and the pagination bar together. Everything
 * table-specific for a route (which columns, how each cell looks, row
 * actions) lives in that route's own columns.tsx, built with
 * `createDataTableColumnHelper` from `@/lib/data-table/config`. This
 * component and the query/state that feeds it stay the same everywhere.
 */
export function KoaTable<TData extends RowData>({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  isLoading = false,
  emptyMessage = "No results.",
  pageSizeOptions,
  className,
}: DataTableProps<TData>) {
  const table = useTable({
    features: tableFeatureSet,
    columns,
    data,
    rowCount, // lets the table compute pageCount internally from rowCount + pageSize
    manualPagination: true, // the data passed in is already one page from the API
    state: { pagination },
    onPaginationChange,
  });

  const skeletonRowCount = Math.min(pagination.pageSize, 10);

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={`skeleton-cell-${colIndex}`}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/*
        Pagination state/APIs are read HERE, off the `table` value that
        useTable() actually returned (correctly typed, including `.state`),
        and handed down as plain props/callbacks. DataTablePagination never
        touches a TanStack Table type itself.
      */}
      <DataTablePagination
        pageIndex={table.state.pagination.pageIndex}
        pageSize={table.state.pagination.pageSize}
        pageCount={table.getPageCount()}
        rowCount={rowCount}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        canLastPage={table.getCanLastPage()}
        onFirstPage={() => table.firstPage()}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
        onLastPage={() => table.lastPage()}
        onPageSizeChange={(size) => table.setPageSize(size)}
        isLoading={isLoading}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}