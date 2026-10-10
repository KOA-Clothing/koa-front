"use client";

import ColorSwatch from "@/components/general/koa-color-badge";
import KoaEnumBadge from "@/components/general/koa-enum-badge";
import { Badge } from "@/components/ui/badge";
import { clothingSizeBadgeStyles } from "@/lib/configs/enum-badge-styles";
import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import { clothingSizeLabels } from "@/types/enum-labels";
import { InventoryDto } from "@/types/inventory";
import { X } from "lucide-react";

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

export function getInventoryColumns() {
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
      <div className="grid grid-cols-[120px_auto_1fr] items-center gap-2">
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
      // No row actions yet — actions (adjust stock, etc.) will be added here.
      cell: () => (
        <div className="text-center text-xs text-muted-foreground">—</div>
      ),
      enableSorting: false,
    }),
  ]);
}
