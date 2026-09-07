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
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
}

interface CategoryColumnActions {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const columnHelper = createDataTableColumnHelper<Category>();

/**
 * Everything table-shape-related for the categories route lives here.
 * page.tsx only calls this and hands the result to <DataTable />.
 */
export function getCategoryColumns({
  onEdit,
  onDelete,
}: CategoryColumnActions) {
  return [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("slug", {
      header: "Slug",
      cell: (info) => (
        <span className="text-muted-foreground">{info.getValue()}</span>
      ),
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
  ];
}