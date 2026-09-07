"use client";

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
import { PAGE_SIZE_OPTIONS } from "@/types/pagination";

interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  /** Total row count across every page, from the API. */
  rowCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  canLastPage: boolean;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
  pageSizeOptions?: number[];
}

/**
 * Pure presentational pagination bar — it knows nothing about TanStack
 * Table or its types. <DataTable /> reads pagination state/APIs off its
 * own `table` instance (where they're correctly typed) and passes plain
 * values + callbacks down here. This sidesteps re-declaring TanStack's
 * table type on a prop, which loses the extra properties (`state`,
 * `FlexRender`) that only exist on the value `useTable()` actually
 * returns, not on the exported `Table<TFeatures, TData>` type.
 */
export function DataTablePagination({
  pageIndex,
  pageSize,
  pageCount,
  rowCount,
  canPreviousPage,
  canNextPage,
  canLastPage,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
  onPageSizeChange,
  isLoading = false,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}: DataTablePaginationProps) {
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
            onValueChange={(value) => onPageSizeChange(Number(value))}
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
            onClick={onFirstPage}
            disabled={controlsDisabled || !canPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onPreviousPage}
            disabled={controlsDisabled || !canPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onNextPage}
            disabled={controlsDisabled || !canNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden lg:flex"
            onClick={onLastPage}
            disabled={controlsDisabled || !canLastPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}