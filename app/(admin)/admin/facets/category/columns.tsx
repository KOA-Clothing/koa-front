"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createDataTableColumnHelper } from "@/lib/data-table/configs";
import { CategoryDto } from "@/types/category";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

interface CategoryColumnActions {
  onEdit: (category: CategoryDto) => void;
  onDelete: (category: CategoryDto) => void;
}

const columnHelper = createDataTableColumnHelper<CategoryDto>();

/**
 * Everything table-shape-related for the categories route lives here.
 * page.tsx only calls this and hands the result to <DataTable />.
 */
export function getCategoryColumns({
  onEdit,
  onDelete,
}: CategoryColumnActions) {
  // `columnHelper.columns([...])` (not a bare array literal) normalizes
  // this array — whose entries each have a different, precise value type
  // (string, boolean, number, unknown for the display column) — into a
  // single ColumnDef<Features, Category, unknown>[], which is what
  // <DataTable />'s `columns` prop expects. Returning a plain array here
  // instead is exactly what produces the "Type ... is not assignable"
  // errors when this gets passed into <DataTable columns={columns} />.
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("isActive", {
      header: "Status",
      cell: (info) => (
        <span
          className={
            "rounded-full px-2 py-0.5 text-xs font-medium " +
            (info.getValue()
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800")
          }
        >
          {info.getValue() ? "Active" : "Inactive"}
        </span>
      ),
    }),
    columnHelper.accessor("sortOrder", {
      header: () => <div className="text-right">Sort Order</div>,
      cell: (info) => <div className="text-right">{info.getValue()}</div>,
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon-sm" />}
            >
              <Ellipsis className="size-3.5" />
              <span className="sr-only">Open row actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="size-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(row.original)}
              >
                <Trash2 className="size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }),
  ]);
}