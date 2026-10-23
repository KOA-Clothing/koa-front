"use client";

import KoaEnumBadge from "@/components/general/koa-enum-badge";
import { Badge } from "@/components/ui/badge";
import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import { productStatusBadgeStyles } from "@/lib/configs/enum-badge-styles";
import type { CollectionItemDto } from "@/types/collection";
import { productStatusLabels } from "@/types/enum-labels";

const columnHelper = createDataTableColumnHelper<CollectionItemDto>();

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
export function getCollectionItemColumns() {
  return columnHelper.columns([
    columnHelper.accessor((item) => item.product.name, {
      id: "product",
      header: () => <div className="text-center">Product</div>,
      enableSorting: true,
    }),
    columnHelper.accessor((item) => item.product.category.name, {
      id: "category",
      header: () => <div className="text-center">Category</div>,
      cell: (info) => <div className="text-left">{info.getValue()}</div>,
      enableSorting: true,
    }),
    columnHelper.accessor((item) => item.product.sellingPrice, {
      id: "sellingPrice",
      header: () => <div className="text-center">Selling Price</div>,
      cell: (info) => (
        <div className="text-center">{currencyFormatter.format(info.getValue())}</div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor((item) => item.product.status, {
      id: "status",
      header: () => <div className="text-center">Product Status</div>,
      cell: (info) => (
        <div className="flex justify-center">
          <KoaEnumBadge
            labels={productStatusLabels}
            styles={productStatusBadgeStyles}
            value={info.getValue()}
          />
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor((item) => item.product.isActive, {
      id: "isActive",
      header: () => <div className="text-center">Is Active</div>,
      cell: (info) => (
        <div className="flex justify-center">
          <Badge variant={info.getValue() ? "secondary" : "outline"}>
            {info.getValue() ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor((item) => item.createdAt, {
      id: "added",
      header: () => <div className="text-center">Added</div>,
      cell: (info) => (
        <div className="text-center text-muted-foreground">
          {new Date(info.getValue()).toLocaleDateString()}
        </div>
      ),
      enableSorting: true,
    }),
  ]);
}
