"use client";

import { BaseShirtIcon } from "@/components/general/custom-icons/base-shirt-icon";
import ColorSwatch from "@/components/general/koa-color-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import { ProductImageTableDetailsDto } from "@/types/product-image";
import { CirclePlus, Eye } from "lucide-react";

const columnHelper =
  createDataTableColumnHelper<ProductImageTableDetailsDto>();

/**
 * A centred count cell. `0` is a real value — it means the product has no shots
 * and needs one — so it prints the number rather than falling back to an em
 * dash, which would read as "nothing to report".
 */
function CountCell({ value }: { value: number }) {
  return <div className="text-center">{value}</div>;
}

interface ProductImageColumnActions {
  onView: (product: ProductImageTableDetailsDto) => void;
  onCreate: (product: ProductImageTableDetailsDto) => void;
  onBaseProductView: (product: ProductImageTableDetailsDto) => void;
}

export function getProductImageColumns({
  onView,
  onCreate,
  onBaseProductView,
}: ProductImageColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: () => <div>Product Name</div>,
      meta: { headerClassName: "w-full text-left", cellClassName: "text-left" } as any,
      enableSorting: true,
    }),
    columnHelper.display({
      id: "totalImages",
      header: () => <div>Total Image Count</div>,
      meta: { headerClassName: "w-full text-right justify-end", cellClassName: "text-right" } as any,
      cell: ({ row }) => <div className="w-full text-right">{row.original.totalImages}</div>,
      enableSorting: false,
    }),
    columnHelper.display({
      id: "totalVariants",
      header: () => <div>Total Variant Count</div>,
      meta: { headerClassName: "w-full text-right justify-end", cellClassName: "text-right" } as any,
      cell: ({ row }) => <div className="w-full text-right">{row.original.totalVariants}</div>,
      enableSorting: false,
    }),
    columnHelper.display({
      id: "availableColors",
      header: () => <div>Available Colors</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "text-start" } as any,
      cell: ({ row }) => {
        const colors = row.original.availableColors;

        if (colors.length === 0) {
          return (
            <div className="text-center text-xs text-muted-foreground">—</div>
          );
        }

        return (
          <div className="grid grid-cols-4 gap-1.5 w-fit justify-items-start">
            {colors.map((color) => (
              <Badge
                key={color.id}
                variant="outline"
                className="gap-1.5 h-7 w-fit justify-start"
              >
                <ColorSwatch color={color} />
                <span className="truncate">{color.name}</span>
              </Badge>
            ))}
          </div>
        );
      },
      enableSorting: false,
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
            onClick={() => onView(row.original)}
            title="View images"
          >
            <Eye className="size-3.5" />
            <span className="sr-only">View images</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onCreate(row.original)}
            title="Add image"
          >
            <CirclePlus className="size-3.5" />
            <span className="sr-only">Add image</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onBaseProductView(row.original)}
            title="View Base Product"
          >
            <BaseShirtIcon className="size-3.5" />
            <span className="sr-only">View Base Product</span>
          </Button>
        </div>
      ),
    }),
  ]);
}
