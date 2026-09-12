"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import { ProductDto } from "@/types/product";
import { ageGroupLabels, genderLabels, ProductStatus, ProductStatusEnum, productStatusLabels } from "@/types/enums";
import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { KoaSwitch } from "@/components/general/koa-switch";

interface ProductColumnActions {
  onEdit: (product: ProductDto) => void;
  onDelete: (product: ProductDto) => void;
  onView: (product: ProductDto) => void;
  toggleFeaturedStatus: (product: ProductDto) => void;
  toggleActiveStatus: (product: ProductDto) => void;
}

const columnHelper = createDataTableColumnHelper<ProductDto>();

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function getProductColumns({ onEdit, onDelete, onView, toggleFeaturedStatus, toggleActiveStatus }: ProductColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: () => <div className="text-center">Name</div>,
      enableSorting: true,
    }),
    columnHelper.accessor("description", {
      header: () => <div className="text-center">Description</div>,
      enableSorting: false,
    }),
    columnHelper.accessor("sizeGuide", {
      header: () => <div className="text-center">Size Guide</div>,
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
              title="Open size guide"
            >
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-3.5" />
                <span className="sr-only">Open size guide in new tab</span>
              </Link>
            </Button>
          </div>
        );
      },
      enableSorting: false,
    }),
    columnHelper.accessor("category", {
      header: () => <div className="text-center">Category</div>,
      cell: (info) => <div className="text-left">{info.getValue()?.name}</div>,
      enableSorting: true,
    }),
    columnHelper.accessor("costPrice", {
      header: () => <div className="text-center">Cost Price</div>,
      cell: (info) => (
        <div className="text-center">{currencyFormatter.format(info.getValue())}</div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("sellingPrice", {
      header: () => <div className="text-center">Selling Price</div>,
      cell: (info) => (
        <div className="text-center">{currencyFormatter.format(info.getValue())}</div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("discountPercentage", {
      header: () => <div className="text-center">Discount</div>,
      cell: (info) => (
        <div className="text-right">{info.getValue()} <span>%</span></div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("gender", {
      header: () => <div className="text-center">Gender</div>,
      cell: (info) => (
        <div className="flex justify-center">
          <Badge variant="default">
            {genderLabels[info.getValue()]}
          </Badge>
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("ageGroup", {
      header: () => <div className="text-center">Age Group</div>,
      cell: (info) => (
        <div className="flex justify-center">
          <Badge variant="default">
            {ageGroupLabels[info.getValue()]}
          </Badge>
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("status", {
      header: () => <div className="text-center">Product Status</div>,
      cell: (info) => (
        <div className="flex justify-center">
          <Badge variant="default">
            {productStatusLabels[info.getValue()]}
          </Badge>
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("isFeatured", {
      header: () => <div className="text-center">Is Featured</div>,
      cell: ({ row, getValue }) => (
        <div className="flex flex-row items-center justify-center">
          <KoaSwitch
            checked={getValue()}
            onCheckedChange={() => toggleFeaturedStatus(row.original)}
          />
        </div>
      ),
      enableSorting: true
    }),
    columnHelper.accessor("isActive", {
      header: () => <div className="text-center">Is Active</div>,
      cell: ({ row, getValue }) => (
        <div className="flex flex-row items-center justify-center">
          <KoaSwitch
            checked={getValue()}
            onCheckedChange={() => toggleActiveStatus(row.original)}
          />
        </div>
      ),
      enableSorting: true
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
            title="View product"
          >
            <Eye className="size-3.5" />
            <span className="sr-only">View product</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row.original)}
            title="Edit product"
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit product</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(row.original)}
            title="Delete product"
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Delete product</span>
          </Button>
        </div>
      ),
    }),
  ]);
}