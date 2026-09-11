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
      header: () => <div className="text-center">Name</div>,
      enableSorting: true,
    }),
    columnHelper.accessor("hexCode", {
      header: () => <div className="text-center">Hex Code</div>,
      cell: ({ row, getValue }) => {
        const hex = getValue();

        if (row.original.swatchImageUrl || !hex) {
          return <div className="text-center text-muted-foreground text-xs">—</div>;
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
      header: () => <div className="text-center">Swatch Image</div>,
      cell: (info) => {
        const url = info.getValue();

        if (!url) {
          return <div className="text-center text-muted-foreground text-xs">—</div>;
        }

        return (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon-sm"
              title="Open swatch image"
            >
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
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