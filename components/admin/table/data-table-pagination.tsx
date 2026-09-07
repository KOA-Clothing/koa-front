"use client";

import type { RowData, Table as TanstackTable } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppTableFeatures } from "@/lib/data-table/configs";
import { PAGE_SIZE_OPTIONS } from "@/types/pagination";

interface DataTablePaginationProps<TData extends RowData> {
  table: TanstackTable<AppTableFeatures, TData>;
  /** Total row count across every page, from the API. */
  rowCount: number;
  isLoading?: boolean;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData extends RowData>({
  table,
  rowCount,
  isLoading = false,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}: DataTablePaginationProps<TData>) {
  // `table.state.pagination` is a reactive read: this component re-renders
  // whenever pagination state changes because <DataTable /> (the component
  // that owns the useTable() call) re-renders with a fresh `table`
  // reference and passes it down as a prop.
  const { pageIndex, pageSize } = table.state.pagination;
  const pageCount = table.getPageCount();
  const controlsDisabled = isLoading;

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-border px-4 py-3 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        {rowCount === 0
          ? "No results"
          : `Showing ${pageIndex * pageSize + 1}\u2013${Math.min(
              (pageIndex + 1) * pageSize,
              rowCount
            )} of ${rowCount.toLocaleString()}`}
      </p>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
            disabled={controlsDisabled}
          >
            <SelectTrigger size="sm" className="w-17.5">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-27.5 items-center justify-center text-sm font-medium">
          Page {pageIndex + 1} of {Math.max(1, pageCount)}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden lg:flex"
            onClick={() => table.firstPage()}
            disabled={controlsDisabled || !table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={controlsDisabled || !table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={controlsDisabled || !table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden lg:flex"
            onClick={() => table.lastPage()}
            disabled={controlsDisabled || !table.getCanLastPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}