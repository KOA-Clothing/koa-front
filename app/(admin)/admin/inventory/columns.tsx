"use client";

import { BaseShirtIcon } from "@/components/general/custom-icons/base-shirt-icon";
import ColorSwatch from "@/components/general/koa-color-badge";
import KoaEnumBadge from "@/components/general/koa-enum-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clothingSizeBadgeStyles } from "@/lib/configs/enum-badge-styles";
import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import { clothingSizeLabels } from "@/types/enum-labels";
import { InventoryDto } from "@/types/inventory";
import { Flag, LayersPlus, X } from "lucide-react";

const columnHelper = createDataTableColumnHelper<InventoryDto>();

/**
 * Numeric/count cell right-aligned per table alignment rules. `null` means
 * "not configured" (low stock threshold) and is rendered as an em dash.
 */
function CountCell({ value }: { value: number | null }) {
  if (value === null) {
    return <div className="w-full text-right text-xs text-muted-foreground">—</div>;
  }

  return <div className="w-full text-right">{value}</div>;
}

interface InventoryColumnActions {
  onBaseProductView: (item: InventoryDto) => void;
  onAddInventory: (item: InventoryDto) => void;
  setLowStockThreshold: (item: InventoryDto) => void;
}

export function getInventoryColumns({
  onBaseProductView,
  onAddInventory,
  setLowStockThreshold,
}: InventoryColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("productName", {
      header: () => <div>Product Name</div>,
      meta: { headerClassName: "w-full text-left", cellClassName: "text-left" } as any,
      enableSorting: true,
    }),
    columnHelper.display({
      id: "variant",
      header: () => <div>Variant</div>,
      meta: { headerClassName: "w-full text-left", cellClassName: "text-left" } as any,
      cell: ({ row }) => {
        const { color, size } = row.original.variant;

        return (
          // Changed from flex to grid with explicit column widths
          <div className="grid grid-cols-[100px_auto_1fr] items-center gap-2">
            <Badge variant="outline" className="gap-1.5 h-7 justify-start">
              <ColorSwatch color={color} />
              <span className="truncate">{color.name}</span>
            </Badge>

            <X className="size-3.5 shrink-0 text-muted-foreground justify-self-center" />

            <KoaEnumBadge
              labels={clothingSizeLabels}
              value={size}
              styles={clothingSizeBadgeStyles}
              className="justify-self-start"
            />
          </div>
        );
      },
      enableSorting: false,
    }),
    columnHelper.accessor("quantity", {
      header: () => <div>Quantity</div>,
      meta: { headerClassName: "w-full text-right justify-end", cellClassName: "text-right" } as any,
      cell: ({ getValue }) => <CountCell value={getValue()} />,
      enableSorting: false,
    }),
    columnHelper.accessor("reservedQuantity", {
      header: () => <div>Reserved Quantity</div>,
      meta: { headerClassName: "w-full text-right justify-end", cellClassName: "text-right" } as any,
      cell: ({ getValue }) => <CountCell value={getValue()} />,
      enableSorting: false,
    }),
    columnHelper.accessor("lowStockThreshold", {
      header: () => <div>Low Stock Threshold</div>,
      meta: { headerClassName: "w-full text-right justify-end", cellClassName: "text-right" } as any,
      cell: ({ getValue }) => <CountCell value={getValue()} />,
      enableSorting: false,
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div>Actions</div>,
      meta: { headerClassName: "flex flex-row items-center justify-center", cellClassName: "text-center" } as any,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onAddInventory(row.original)}
            title="Add Inventory"
          >
            <LayersPlus className="size-3.5" />
            <span className="sr-only">Add Inventory</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setLowStockThreshold(row.original)}
            title="Set Low Stock Threshold"
          >
            <Flag className="size-3.5" />
            <span className="sr-only">Set Low Stock Threshold</span>
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
      enableSorting: false,
    }),
  ]);
}
