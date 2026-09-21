"use client";

import ColorSwatch from "@/components/general/koa-color-badge";
import KoaEnumBadge from "@/components/general/koa-enum-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clothingSizeBadgeStyles } from "@/lib/configs/enum-badge-styles";
import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import { clothingSizeLabels } from "@/types/enum-labels";
import { ProductVariantsCollectionDto } from "@/types/product-variant";
import { Eye } from "lucide-react";

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
}

export function getProductVariantColumns({ onView }: ProductVariantsColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: () => <div className="text-center">Product Name</div>,
      enableSorting: true,
    }),
    columnHelper.display({
      id: "availableSizes",
      header: () => <div className="text-center">Available Sizes</div>,
      cell: ({ row }) => {
        const sizes = distinctBy(
          row.original.variants.map((variant) => variant.size),
          (size) => size
        );

        if (sizes.length === 0) {
          return (
            <div className="text-center text-xs text-muted-foreground">—</div>
          );
        }

        return (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
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
      header: () => <div className="text-center">Available Colors</div>,
      cell: ({ row }) => {
        const colors = distinctBy(
          row.original.variants.map((variant) => variant.color),
          (color) => color.id
        );

        if (colors.length === 0) {
          return (
            <div className="text-center text-xs text-muted-foreground">—</div>
          );
        }

        return (
          <div className="grid grid-cols-4 gap-1.5 place-items-center max-w-fit mx-auto">
            {colors.map((color) => (
              <Badge key={color.id} variant="outline" className="gap-1.5 w-full justify-start">
                <ColorSwatch color={color} /> {color.name}
              </Badge>
            ))}
          </div>
        );
      },
      enableSorting: false,
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
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
        </div>
      ),
    }),
  ]);
}