"use client";

import { Button } from "@/components/ui/button";
import { KoaSwitch } from "@/components/general/koa-switch";
import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import { ColorDto } from "@/types/color";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface ColorColumnActions {
  onEdit: (color: ColorDto) => void;
  onDelete: (color: ColorDto) => void;
  toggleActiveStatus: (color: ColorDto) => void;
}

const columnHelper = createDataTableColumnHelper<ColorDto>();

export function getColorColumns({
  onEdit,
  onDelete,
  toggleActiveStatus,
}: ColorColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: () => <div>Name</div>,
      meta: { headerClassName: "w-full text-left", cellClassName: "text-left" } as any,
      enableSorting: true,
    }),
    columnHelper.accessor("hexCode", {
      header: () => <div>Hex Code</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "text-center" } as any,
      cell: ({ row, getValue }) => {
        const hex = getValue();

        if (row.original.swatchImageUrl || !hex) {
          return <div className="w-full text-center text-muted-foreground text-xs">—</div>;
        }

        return (
          <div className="flex flex-row items-center justify-center gap-2">
            <span
              className="inline-block size-4 rounded-full border border-border"
              style={{ backgroundColor: `#${hex}` }}
            />
            <span className="font-mono text-xs">{hex}</span>
          </div>
        );
      },
      enableSorting: true,
    }),
    columnHelper.accessor("swatchImageUrl", {
      header: () => <div>Swatch Image</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "text-center" } as any,
      cell: (info) => {
        const url = info.getValue();

        if (!url) {
          return <div className="w-full text-center text-muted-foreground text-xs">—</div>;
        }

        return (
          <div className="flex justify-center">
            <Button variant="outline" size="icon-sm" title="Open swatch image">
              <Link href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" />
                <span className="sr-only">Open swatch image in new tab</span>
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
      enableSorting: true,
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div>Actions</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "text-center" } as any,
      cell: ({ row }) => (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row.original)}
            title="Edit color"
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit color</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(row.original)}
            title="Delete color"
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Delete color</span>
          </Button>
        </div>
      ),
    }),
  ]);
}