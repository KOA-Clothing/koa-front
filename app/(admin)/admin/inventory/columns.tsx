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
import { LayersPlus, X } from "lucide-react";

const columnHelper = createDataTableColumnHelper<InventoryDto>();

/**
 * A centred count cell. `null` is a real value on `lowStockThreshold` — it
 * means "not configured" — so it prints an em dash rather than `0`, which
 * would read as "alert me at zero".
 */
function CountCell({ value }: { value: number | null }) {
  if (value === null) {
    return <div className="text-center text-xs text-muted-foreground">—</div>;
  }

  return <div className="text-center">{value}</div>;
}

interface InventoryColumnActions {
  onBaseProductView: (item: InventoryDto) => void;
  onAddInventory: (item: InventoryDto) => void;
}

export function getInventoryColumns({
  onBaseProductView, onAddInventory
}: InventoryColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("productName", {
      header: () => <div className="text-center">Product Name</div>,
      enableSorting: true,
    }),
    columnHelper.display({
  id: "variant",
  header: () => <div className="text-center">Variant</div>,
  cell: ({ row }) => {
    const { color, size } = row.original.variant;

    return (
      // Changed from flex to grid with explicit column widths
      <div className="grid grid-cols-[100px_auto_1fr] items-center gap-2">
        <Badge
          variant="outline"
          className="gap-1.5 h-7 justify-start"
        >
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
      header: () => <div className="text-center">Quantity</div>,
      cell: ({ getValue }) => <CountCell value={getValue()} />,
      enableSorting: false,
    }),
    columnHelper.accessor("reservedQuantity", {
      header: () => <div className="text-center">Reserved Quantity</div>,
      cell: ({ getValue }) => <CountCell value={getValue()} />,
      enableSorting: false,
    }),
    columnHelper.accessor("lowStockThreshold", {
      header: () => <div className="text-center">Low Stock Threshold</div>,
      cell: ({ getValue }) => <CountCell value={getValue()} />,
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
            onClick={() => onAddInventory(row.original)}
            title="Add Inventory"
          >
            <LayersPlus className="size-3.5" />
            <span className="sr-only">Add Inventory</span>
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
