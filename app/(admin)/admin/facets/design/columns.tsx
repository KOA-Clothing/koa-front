"use client";

import { Button } from "@/components/ui/button";
import { KoaSwitch } from "@/components/general/koa-switch";
import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import { DesignDto } from "@/types/design";
import { Pencil, Trash2 } from "lucide-react";

interface DesignColumnActions {
  onEdit: (design: DesignDto) => void;
  onDelete: (design: DesignDto) => void;
  toggleActiveStatus: (design: DesignDto) => void;
}

const columnHelper = createDataTableColumnHelper<DesignDto>();

export function getDesignColumns({
  onEdit,
  onDelete,
  toggleActiveStatus,
}: DesignColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: () => <div className="text-center">Name</div>,
      enableSorting: true,
    }),
    columnHelper.accessor("description", {
      header: () => <div className="text-center">Description</div>,
      cell: (info) => <div className="text-left">{info.getValue()}</div>,
      enableSorting: true,
    }),
    columnHelper.accessor("isActive", {
      header: () => <div className="text-center">Active Status</div>,
      cell: ({ row, getValue }) => (
        <div className="flex flex-row items-center justify-center">
          <KoaSwitch
            checked={getValue()}
            onCheckedChange={() => toggleActiveStatus(row.original)}
          />
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row.original)}
            title="Edit design"
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit design</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(row.original)}
            title="Delete design"
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Delete design</span>
          </Button>
        </div>
      ),
    }),
  ]);
}
