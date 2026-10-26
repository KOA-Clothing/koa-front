"use client";

import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import type { CollectionItemDto } from "@/types/collection";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { ProductDto } from "@/types/product";
import { BaseShirtIcon } from "@/components/general/custom-icons/base-shirt-icon";

const columnHelper = createDataTableColumnHelper<CollectionItemDto>();

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface CollectionItemsColumnActions {
  onViewBaseProduct: (product: ProductDto) => void;
  onDelete: (product: ProductDto) => void;
}

/**
 * The columns for one collection's product list.
 *
 * Every accessor reads through `item.product` — a row here is a link between a
 * collection and a product, not a product on its own, and the link's own data
 * (its `id`, the date it was added) only appears where it adds something. The
 * product fields decide sort order because that's what an admin scans by.
 *
 * Read-only by design: adding and removing products are separate mutations
 * that need the product they act on, so they live in their own controls rather
 * than as a column of buttons here.
 */
export function getCollectionItemColumns({
  onViewBaseProduct, onDelete
}: CollectionItemsColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor((item) => item.product.name, {
      id: "product",
      header: () => <div>Product</div>,
      meta: { headerClassName: "w-full text-center", cellClassName: "text-center" } as any,
      enableSorting: true,
    }),
    columnHelper.accessor((item) => item.product.category.name, {
      id: "category",
      header: () => <div>Category</div>,
      meta: { headerClassName: "w-full text-center", cellClassName: "text-left" } as any,
      enableSorting: true,
    }),
    columnHelper.accessor((item) => item.product.sellingPrice, {
      id: "sellingPrice",
      header: () => <div>Selling Price</div>,
      meta: { headerClassName: "w-full text-right justify-end", cellClassName: "text-right" } as any,
      cell: (info) => <div className="w-full text-right">{currencyFormatter.format(info.getValue())}</div>,
      enableSorting: true,
    }),
    // columnHelper.accessor((item) => item.product.status, {
    //   id: "status",
    //   header: () => <div>Product Status</div>,
    //   meta: { headerClassName: "w-full justify-center text-center", cellClassName: "text-center" },
    //   cell: (info) => (
    //     <div className="flex justify-center">
    //       <KoaEnumBadge
    //         labels={productStatusLabels}
    //         styles={productStatusBadgeStyles}
    //         value={info.getValue()}
    //       />
    //     </div>
    //   ),
    //   enableSorting: true,
    // }),
    // columnHelper.accessor((item) => item.product.isActive, {
    //   id: "isActive",
    //   header: () => <div>Is Active</div>,
    //   meta: { headerClassName: "w-full justify-center text-center", cellClassName: "text-center" },
    //   cell: (info) => (
    //     <div className="flex justify-center">
    //       <Badge variant={info.getValue() ? "secondary" : "outline"}>
    //         {info.getValue() ? "Active" : "Inactive"}
    //       </Badge>
    //     </div>
    //   ),
    //   enableSorting: true,
    // }),
    columnHelper.accessor((item) => item.createdAt, {
      id: "added",
      header: () => <div>Added Date</div>,
      meta: { headerClassName: "w-full text-right justify-end"} as any,
      cell: (info) => (
        <div className="text-muted-foreground w-full text-end"> {new Date(info.getValue()).toLocaleDateString()} </div>
      ),
      enableSorting: true,
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="w-full text-center">Actions</div>,
      meta: { headerClassName: "w-full text-center", cellClassName: "text-center" } as any,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onViewBaseProduct(row.original.product)}
            title="View base product"
          >
            <BaseShirtIcon className="size-3.5" />
            <span className="sr-only">View base product</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(row.original.product)}
            title="Delete product from colletion"
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Delete product from collection</span>
          </Button>
        </div>
      ),
    })
  ]);
}
