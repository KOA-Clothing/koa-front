"use client";

import { Button } from "@/components/ui/button";
import { createDataTableColumnHelper } from "@/lib/configs/table-configs";
import { ProductDto } from "@/types/product";
import {
  ageGroupLabels,
  genderLabels,
  productStatusLabels,
} from "@/types/enum-labels";
import { AgeGroupEnum, GenderEnum, ProductStatusEnum } from "@/types/enums";
import { ExternalLink, Eye, File, Images, Pencil, ShelvingUnit, SplinePointer, SwatchBook, Trash2 } from "lucide-react";
import Link from "next/link";
import { KoaSwitch } from "@/components/general/koa-switch";
import KoaEnumChanger from "@/components/general/koa-enum-changer";
import {
  ageGroupBadgeStyles,
  genderBadgeStyles,
  productStatusBadgeStyles,
} from "@/lib/configs/enum-badge-styles";

interface BaseProductColumnActions {
  onEdit: (product: ProductDto) => void;
  onDelete: (product: ProductDto) => void;
  onView: (product: ProductDto) => void;
  toggleFeaturedStatus: (product: ProductDto) => void;
  toggleActiveStatus: (product: ProductDto) => void;
  onChangeGender: (product: ProductDto, gender: GenderEnum) => void;
  onChangeAgeGroup: (product: ProductDto, ageGroup: AgeGroupEnum) => void;
  onChangeProductStatus: (product: ProductDto, status: ProductStatusEnum) => void;
  manageLinkedDesigns: (product: ProductDto) => void;
  onVariantsView: (product: ProductDto) => void;
  onCategoryView: (product: ProductDto) => void;
  onImagesView: (product: ProductDto) => void;
  onInventoryView: (product: ProductDto) => void;
}

const columnHelper = createDataTableColumnHelper<ProductDto>();

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function getProductColumns({ 
    onEdit, onDelete, onView, 
    toggleFeaturedStatus, toggleActiveStatus, 
    onChangeGender, onChangeAgeGroup, 
    onChangeProductStatus, manageLinkedDesigns, onVariantsView, onCategoryView,
    onImagesView, onInventoryView }: BaseProductColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: () => <div>Name</div>,
      meta: { headerClassName: "w-full text-left", cellClassName: "text-left" } as any,
      enableSorting: true,
    }),
    // columnHelper.accessor("description", {
    //   header: () => <div className="text-center">Description</div>,
    //   enableSorting: false,
    // }),
    columnHelper.accessor("sizeGuide", {
      header: () => <div>Size Guide</div>,
      meta: { headerClassName: "w-full text-center", cellClassName: "text-center" } as any,
      cell: (info) => {
        const url = info.getValue();

        if (!url) {
          return <div className="w-full text-center text-muted-foreground text-xs">—</div>;
        }

        return (
          <div className="flex justify-center">
            <Button variant="outline" size="icon-sm" title="Open size guide">
              <Link href={url} target="_blank" rel="noopener noreferrer">
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
      header: () => <div>Category</div>,
      meta: { headerClassName: "w-full text-left", cellClassName: "text-left" } as any,
      cell: (info) => <div className="text-left">{info.getValue()?.name}</div>,
      enableSorting: true,
    }),
    columnHelper.accessor("costPrice", {
      header: () => <div>Cost Price</div>,
      meta: { headerClassName: "w-full text-right justify-end", cellClassName: "text-right" } as any,
      cell: (info) => (
        <div className="w-full text-right">{currencyFormatter.format(info.getValue())}</div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("sellingPrice", {
      header: () => <div>Selling Price</div>,
      meta: { headerClassName: "w-full text-right justify-end", cellClassName: "text-right" } as any,
      cell: (info) => (
        <div className="w-full text-right">{currencyFormatter.format(info.getValue())}</div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("discountPercentage", {
      header: () => <div>Discount %</div>,
      meta: { headerClassName: "w-full text-right justify-end", cellClassName: "text-right" } as any,
      cell: (info) => (
        <div className="w-full text-right">{info.getValue()} <span>%</span></div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("gender", {
      header: () => <div>Gender</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "text-center" } as any,
      cell: ({ row, getValue }) => (
        <div className="flex justify-center">
          <KoaEnumChanger
            styles={genderBadgeStyles}
            labels={genderLabels}
            value={getValue()}
            onValueChange={(gender) => onChangeGender(row.original, gender)}
          />
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("ageGroup", {
      header: () => <div>Age Group</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "text-center" } as any,
      cell: ({ row, getValue }) => (
        <div className="flex justify-center">
          <KoaEnumChanger
            styles={ageGroupBadgeStyles}
            labels={ageGroupLabels}
            value={getValue()}
            onValueChange={(ageGroup) => onChangeAgeGroup(row.original, ageGroup)}
          />
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("status", {
      header: () => <div>Product Status</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "text-center" } as any,
      cell: ({ row, getValue }) => (
        <div className="flex justify-center">
          <KoaEnumChanger
            styles={productStatusBadgeStyles}
            labels={productStatusLabels}
            value={getValue()}
            onValueChange={(status) => onChangeProductStatus(row.original, status)}
          />
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("isFeatured", {
      header: () => <div>Is Featured</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "text-center" } as any,
      cell: ({ row, getValue }) => (
        <div className="flex flex-row items-center justify-center">
          <KoaSwitch
            checked={getValue()}
            onCheckedChange={() => toggleFeaturedStatus(row.original)}
          />
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("isActive", {
      header: () => <div>Is Active</div>,
      meta: { headerClassName: "w-full items-center justify-center", cellClassName: "text-center" } as any,
      cell: ({ row, getValue }) => (
        <div className="flex flex-row items-center justify-center">
          <KoaSwitch
            checked={getValue()}
            onCheckedChange={() => toggleActiveStatus(row.original)}
          />
        </div>
      ),
      enableSorting: true,
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
            title="View product"
          >
            <Eye className="size-3.5" />
            <span className="sr-only">View product</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => manageLinkedDesigns(row.original)}
            title="Manage linked designs"
          >
            <SplinePointer className="size-3.5" />
            <span className="sr-only">Manage linked designs</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onVariantsView(row.original)}
            title="View product variants"
          >
            <SwatchBook className="size-3.5" />
            <span className="sr-only">View product variants</span>
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

          {/* Sits next to the variants button because images and variants are the
              two per-product galleries an admin works on together — a shot is
              always shot *in* a colorway. */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onImagesView(row.original)}
            title="View product images"
          >
            <Images className="size-3.5" />
            <span className="sr-only">View product images</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onCategoryView(row.original)}
            title="View category"
          >
            <File className="size-3.5" />
            <span className="sr-only">View category</span>
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