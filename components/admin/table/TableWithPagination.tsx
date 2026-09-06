'use client'

import { forwardRef, useImperativeHandle, useState } from "react"
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type PaginationState,
  type RowData,
} from "@tanstack/react-table"
import { Loader2 } from "lucide-react"
import { DataTable } from "./data-table"
import TablePaginator from "./paginator"

const features = tableFeatures({
  rowPaginationFeature,
})
type Features = typeof features

interface TableWithPaginationProps<TData extends RowData> {
  columns: ColumnDef<Features, TData, any>[]
  data: TData[]
  isLoading?: boolean
  totalRecords: number
  initialPageSize?: number
  onPaginationChange: (pagination: PaginationState) => void
  loadingComponent?: React.ReactNode
  className?: string
}

export interface TableWithPaginationRef {
  getPagination: () => PaginationState
  resetPagination: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  goToPage: (pageIndex: number) => void
  setPageSize: (pageSize: number) => void
}

export const TableWithPagination = forwardRef(function TableWithPagination<
  TData extends RowData,
>(
  {
    columns,
    data,
    isLoading = false,
    totalRecords,
    initialPageSize = 10,
    onPaginationChange,
    loadingComponent,
    className = "",
  }: TableWithPaginationProps<TData>,
  ref: React.ForwardedRef<TableWithPaginationRef>
) {
  // 1. Controlled pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  // 2. Initialize table with rowPaginationFeature and manualPagination
  const table = useTable({
    features,
    columns,
    data: data ?? [],
    manualPagination: true,
    rowCount: totalRecords,
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      setPagination((old) => {
        const next = updater instanceof Function ? updater(old) : updater
        onPaginationChange?.(next)
        return next
      })
    },
  })

  // 3. Delegate imperative methods to the table's built-in APIs
  useImperativeHandle(
    ref,
    () => ({
      getPagination: () => table.state.pagination,
      resetPagination: () => table.resetPagination(),
      goToFirstPage: () => table.firstPage(),
      goToLastPage: () => table.lastPage(),
      goToPage: (pageIndex: number) => table.setPageIndex(pageIndex),
      setPageSize: (pageSize: number) => table.setPageSize(pageSize),
    }),
    [table]
  )

  if (isLoading) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center p-8 border">
          <Loader2
            size={25}
            className="animate-spin"
            role="status"
            aria-label="Loading..."
          />
          <span className="ml-2 font-semibold">Loading...</span>
        </div>
      )
    )
  }


  return (
    <div className={`w-full flex flex-col ${className}`}>
      <h1 className="text-gray-500 font-semibold mb-2 text-sm">
        Total Records : {totalRecords}
      </h1>

      {/* Render table using the shared instance */}
      <DataTable table={table as any} columnsLength={columns.length} />

      {/* Pass table directly to paginator */}
      <TablePaginator table={table as any} />
    </div>
  )
})

TableWithPagination.displayName = 'TableWithPagination'
export default TableWithPagination