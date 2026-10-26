"use client";

import { Button } from "@/components/ui/button";
import { KoaSwitch } from "@/components/general/koa-switch";
import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import { CategoryDto } from "@/types/category";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface CategoryColumnActions {
  onEdit: (category: CategoryDto) => void;
  onDelete: (category: CategoryDto) => void;
  toggleActiveStatus: (category: CategoryDto) => void;
}

const columnHelper = createDataTableColumnHelper<CategoryDto>();

export function getCategoryColumns({
  onEdit,
  onDelete,
  toggleActiveStatus,
}: CategoryColumnActions) {
  return columnHelper.columns(
  [
    columnHelper.accessor("name", {
      header: () => <div>Name</div>,
      meta: { headerClassName: "w-full text-left", cellClassName: "text-left" } as any,
      enableSorting: true
    }),
    columnHelper.accessor("description", {
      header: () => <div>Description</div>,
      meta: { headerClassName: "w-full text-left", cellClassName: "text-left" } as any,
      cell: (info) => <div className="text-left">{info.getValue()}</div>,
      enableSorting: true
    }),
    columnHelper.accessor("sizeGuideUrl", {
      header: () => <div>Size Guide</div>,
      meta: { headerClassName: "w-full text-center", cellClassName: "text-center" } as any,
      cell: (info) => {
        const url = info.getValue();

        if (!url) {
          return <div className="w-full text-center text-muted-foreground text-xs">—</div>;
        }

        return (
          <div className="flex justify-center">
            <Button variant="outline" size="icon-sm" title="Open size guide">
              <Link href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" />
                <span className="sr-only">Open size guide in new tab</span>
              </Link>
            </Button>
          </div>
        );
      },
      enableSorting: false,
    }),
    columnHelper.accessor("isActive", {
      header: () => <div>Active Status</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "text-center" } as any,
      cell: ({ row, getValue }) => (
        <div className="flex flex-row items-center justify-center">
          <KoaSwitch
            checked={getValue()}
            onCheckedChange={() => toggleActiveStatus(row.original)}
          />
        </div>
      ),
      enableSorting: true
    }),
    columnHelper.accessor("sortOrder", {
      header: () => <div>Sort Order</div>,
      meta: { headerClassName: "w-full items-center justify-end", cellClassName: "text-right" } as any,
      cell: (info) => <div className="w-full text-right">{info.getValue()}</div>,
      enableSorting: true
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div>Actions</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "text-center" } as any,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row.original)}
            title="Edit category"
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit category</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(row.original)}
            title="Delete category"
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Delete category</span>
          </Button>
        </div>
      ),
    })
  ]);
}