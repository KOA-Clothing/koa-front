"use client";

import { BaseShirtIcon } from "@/components/general/custom-icons/base-shirt-icon";
import { Button } from "@/components/ui/button";
import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import { ProductImageCollectionDto } from "@/types/product-image";
import { Eye } from "lucide-react";

const columnHelper = createDataTableColumnHelper<ProductImageCollectionDto>();

interface ProductImageColumnActions {
  onView: (product: ProductImageCollectionDto) => void;
  onBaseProductView: (product: ProductImageCollectionDto) => void;
}

export function getProductImageColumns({
  onView,
  onBaseProductView,
}: ProductImageColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: () => <div className="text-center">Product Name</div>,
      enableSorting: true,
    }),
    columnHelper.display({
      id: "imageCount",
      header: () => <div className="text-center">Total Image Count</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.images.length}</div>
      ),
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
            title="View images"
          >
            <Eye className="size-3.5" />
            <span className="sr-only">View images</span>
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
