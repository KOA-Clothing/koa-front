"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import KoaBoolBadge from "@/components/general/koa-bool-badge";
import KoaEnumBadge from "@/components/general/koa-enum-badge";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaPricingSummary from "@/components/general/koa-pricing-summary";
import KoaViewOnlyField from "@/components/general/koa-view-only-field";
import KoaViewOnlySizeGuide from "@/components/general/koa-view-only-size-guide";
import {
  ageGroupBadgeStyles,
  genderBadgeStyles,
  productStatusBadgeStyles,
} from "@/lib/configs/enum-badge-styles";
import {
  ageGroupLabels,
  genderLabels,
  productStatusLabels,
} from "@/types/enum-labels";
import { ProductDto } from "@/types/product";

interface ViewProductModalProps {
  product: ProductDto | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: ProductDto) => void;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6">
        {children}
      </dl>
    </section>
  );
}

export default function ViewProductModal({
  product,
  onOpenChange,
  onEdit,
}: ViewProductModalProps) {
  const handleEdit = () => {
    if (product) onEdit(product);
  };

  return (
    <Dialog
      open={!!product}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl gap-0 overflow-y-auto p-0">
        {product && (
          <>
            <DialogHeader className="border-b p-5">
              <DialogTitle>{product.name}</DialogTitle>
              <DialogDescription>
                Complete product details. Use{" "}
                <span className="font-medium text-foreground">Edit</span> to
                make changes.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 p-5">
              <Section title="Overview">
                <KoaViewOnlyField label="Name" value={product.name} />
                <KoaViewOnlyField label="Category" value={product.category?.name} />
                <KoaViewOnlyField
                  label="Product status"
                  value={
                    <KoaEnumBadge
                      labels={productStatusLabels}
                      value={product.status}
                      styles={productStatusBadgeStyles}
                    />
                  }
                />
                <KoaViewOnlyField
                  label="Description"
                  value={product.description}
                  className="sm:col-span-2"
                />
                <KoaViewOnlySizeGuide
                  productSizeGuide={product.sizeGuide}
                  categorySizeGuide={product.category?.sizeGuideUrl}
                  className="sm:col-span-2"
                />
              </Section>

              <Section title="Pricing">
                <KoaViewOnlyField
                  label="Cost price"
                  value={currencyFormatter.format(product.costPrice)}
                />
                <KoaViewOnlyField
                  label="Selling price"
                  value={currencyFormatter.format(product.sellingPrice)}
                />
                <KoaViewOnlyField
                  label="Discount percentage"
                  value={`${product.discountPercentage}%`}
                />
              </Section>

              <KoaPricingSummary
                costPrice={product.costPrice}
                sellingPrice={product.sellingPrice}
                discountPercentage={product.discountPercentage}
              />

              <Section title="Classification">
                <KoaViewOnlyField
                  label="Gender"
                  value={
                    <KoaEnumBadge
                      labels={genderLabels}
                      value={product.gender}
                      styles={genderBadgeStyles}
                    />
                  }
                />
                <KoaViewOnlyField
                  label="Age group"
                  value={
                    <KoaEnumBadge
                      labels={ageGroupLabels}
                      value={product.ageGroup}
                      styles={ageGroupBadgeStyles}
                    />
                  }
                />
              </Section>

              <Section title="Display">
                <KoaViewOnlyField
                  label="Featured"
                  value={
                    <KoaBoolBadge active={product.isFeatured} label="Yes" />
                  }
                />
                <KoaViewOnlyField
                  label="Active"
                  value={<KoaBoolBadge active={product.isActive} label="Yes" />}
                />
              </Section>

              <Section title="Details">
                <KoaViewOnlyField label="Material" value={product.material} />
                <KoaViewOnlyField
                  label="Care instructions"
                  value={product.careInstructions}
                />
              </Section>

              <Section title="Search Engine Optimization">
                <KoaViewOnlyField
                  label="Meta title"
                  value={product.metaTitle}
                  className="sm:col-span-2"
                />
                <KoaViewOnlyField
                  label="Meta description"
                  value={product.metaDescription}
                  className="sm:col-span-2"
                />
              </Section>

              <Section title="Record">
                <KoaViewOnlyField
                  label="ID"
                  value={
                    <code className="font-mono text-xs break-all">
                      {product.id}
                    </code>
                  }
                  className="sm:col-span-2"
                />
                <KoaViewOnlyField
                  label="Created"
                  value={new Date(product.createdAt).toLocaleString()}
                />
                <KoaViewOnlyField
                  label="Updated"
                  value={new Date(product.updatedAt).toLocaleString()}
                />
              </Section>
            </div>

            <DialogFooter className="border-t p-5">
              <KoaModalCancelButton onClick={() => onOpenChange(false)}>
                Close
              </KoaModalCancelButton>
              <Button onClick={handleEdit}>Edit</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}