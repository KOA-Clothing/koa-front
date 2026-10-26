"use client";

import { BaseShirtIcon } from "@/components/general/custom-icons/base-shirt-icon";
import ColorSwatch from "@/components/general/koa-color-badge";
import KoaEnumBadge from "@/components/general/koa-enum-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clothingSizeBadgeStyles } from "@/lib/configs/enum-badge-styles";
import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import { clothingSizeLabels } from "@/types/enum-labels";
import { ProductVariantsCollectionDto } from "@/types/product-variant";
import { CirclePlus, Eye, ShelvingUnit } from "lucide-react";

const columnHelper = createDataTableColumnHelper<ProductVariantsCollectionDto>();

/** Dedupes an array while preserving first-seen order. */
function distinctBy<T>(items: T[], key: (item: T) => unknown): T[] {
  const seen = new Set<unknown>();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

interface ProductVariantsColumnActions {
  onView: (product: ProductVariantsCollectionDto) => void;
  onCreate: (product: ProductVariantsCollectionDto) => void;
  onBaseProductView: (product: ProductVariantsCollectionDto) => void;
  onInventoryView: (product: ProductVariantsCollectionDto) => void;
}

export function getProductVariantColumns({ onView, onCreate, onBaseProductView, onInventoryView }: ProductVariantsColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: () => <div>Product Name</div>,
      meta: { headerClassName: "w-full text-left", cellClassName: "text-left" } as any,
      enableSorting: true,
    }),
    columnHelper.display({
      id: "availableVariantCount",
      header: () => <div>Total Variant Count</div>,
      meta: { headerClassName: "w-full text-right justify-end", cellClassName: "text-right" } as any,
      cell: ({ row }) => <div className="w-full text-right">{row.original.variants.length}</div>,
      enableSorting: false,
    }),
    columnHelper.display({
      id: "availableSizes",
      header: () => <div>Available Sizes</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "align-top" } as any,
      cell: ({ row }) => {
        const sizes = distinctBy(
          row.original.variants.map((variant) => variant.size),
          (size) => size
        );

        if (sizes.length === 0) {
          return (
            <div className="w-full text-center text-xs text-muted-foreground">—</div>
          );
        }

        return (
          <div className="flex flex-wrap justify-center gap-1.5">
            {sizes.map((size) => (
              <KoaEnumBadge
                key={size}
                labels={clothingSizeLabels}
                value={size}
                styles={clothingSizeBadgeStyles}
              />
            ))}
          </div>
        );
      },
      enableSorting: false,
    }),
    columnHelper.display({
      id: "availableColors",
      header: () => <div>Available Colors</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "align-top" } as any,
      cell: ({ row }) => {
        const colors = distinctBy(
          row.original.variants.map((variant) => variant.color),
          (color) => color.id
        );

        if (colors.length === 0) {
          return (
            <div className="w-full text-center text-xs text-muted-foreground">—</div>
          );
        }

        return (
          <div className="flex flex-wrap justify-start gap-1.5">
            {colors.map((color) => (
              <Badge
                key={color.id}
                variant="outline"
                className="gap-1.5 h-7 max-w-37.5 justify-start"
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
            title="View variants"
          >
            <Eye className="size-3.5" />
            <span className="sr-only">View variants</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onCreate(row.original)}
            title="Create variant"
          >
            <CirclePlus className="size-3.5" />
            <span className="sr-only">Create variant</span>
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
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onInventoryView(row.original)}
            title="View Inventory Items"
          >
            <ShelvingUnit className="size-3.5" />
            <span className="sr-only">View Inventory Items</span>
          </Button>
        </div>
      ),
    }),
  ]);
}