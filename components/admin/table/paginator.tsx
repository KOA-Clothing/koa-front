import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Table } from "@tanstack/react-table"

interface TablePaginatorProps {
  table: Table<any, any>
}

export default function TablePaginator({ table }: TablePaginatorProps) {
  const { pageIndex, pageSize } = table.initialState.pagination

  return (
    <div className="mt-2">
      <div className="flex justify-center dark:border dark:border-neutral-600 items-center space-x-6 lg:space-x-8 border py-2 rounded-md">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-25 items-center justify-center text-sm font-medium">
          Page {pageIndex + 1} of {table.getPageCount()}
        </div>

        <div className="flex items-center space-x-2">
          {/* First page button */}
          <Button
            variant="outline"
            size="icon"
            className="size-8 lg:flex dark:border dark:border-neutral-700 dark:hover:bg-neutral-700"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>

          {/* Previous page button */}
          <Button
            variant="outline"
            size="icon"
            className="size-8 dark:border dark:border-neutral-700 dark:hover:bg-neutral-700"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>

          {/* Next page button */}
          <Button
            variant="outline"
            size="icon"
            className="size-8 dark:border dark:border-neutral-700 dark:hover:bg-neutral-700"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>

          {/* Last page button */}
          <Button
            variant="outline"
            size="icon"
            className="size-8 lg:flex dark:border dark:border-neutral-700 dark:hover:bg-neutral-700"
            onClick={() => table.lastPage()}
            disabled={!table.getCanLastPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}