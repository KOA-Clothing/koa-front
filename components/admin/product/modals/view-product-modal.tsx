"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import { cn } from "@/lib/utils";
import { calculatePriceBreakdown } from "@/lib/pricing/price-calculations";
import {
  ageGroupLabels,
  genderLabels,
  productStatusLabels,
  ProductStatusEnum,
} from "@/types/enums";
import { ProductDto } from "@/types/product";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface ViewProductModalProps {
  product: ProductDto | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: ProductDto) => void;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const statusVariant: Record<
  ProductStatusEnum,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [ProductStatusEnum.Available]: "default",
  [ProductStatusEnum.Draft]: "secondary",
  [ProductStatusEnum.Discontinued]: "destructive",
  [ProductStatusEnum.OutOfStock]: "outline",
};

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm text-foreground">
        {value === null || value === undefined || value === "" ? (
          <span className="text-muted-foreground/60">—</span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6">
        {children}
      </dl>
    </section>
  );
}

function BoolBadge({ active, label }: { active: boolean; label: string }) {
  return active ? (
    <Badge className="bg-emerald-600/10 text-emerald-600">{label}</Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      {label}
    </Badge>
  );
}

function EnumBadge({ children }: { children: ReactNode }) {
  return <Badge variant="secondary">{children}</Badge>;
}

const roundToTwo = (value: number) => Math.round(value * 100) / 100;

function PricingSummaryCard({ product }: { product: ProductDto }) {
  const breakdown = calculatePriceBreakdown(
    product.costPrice,
    product.sellingPrice,
    product.discountPercentage
  );
  const isProfit = breakdown.profitLoss >= 0;
  const pnlColor = isProfit ? "text-emerald-600" : "text-red-600";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-emerald-600/20 bg-emerald-600/5 p-4">
      <h3 className="text-sm font-semibold text-foreground">Pricing Summary</h3>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6">
        <Field
          label="Final price"
          value={
            <span className="text-lg font-semibold text-emerald-600">
              {currencyFormatter.format(breakdown.finalPrice)}
            </span>
          }
        />
        <Field
          label="Discount amount"
          value={currencyFormatter.format(breakdown.discountAmount)}
        />
        <Field
          label="Profit / loss"
          value={
            <span className={pnlColor}>
              {currencyFormatter.format(breakdown.profitLoss)}
            </span>
          }
        />
        <Field
          label="Profit / loss %"
          value={
            <span className={pnlColor}>
              {roundToTwo(breakdown.profitLossPercentage)}%
            </span>
          }
        />
      </dl>
    </div>
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

            <div className="flex flex-col gap-6 p-5">
              <Section title="Overview">
                <Field label="Name" value={product.name} />
                <Field label="Category" value={product.category?.name} />
                <Field
                  label="Product status"
                  value={
                    <Badge variant={statusVariant[product.status]}>
                      {productStatusLabels[product.status]}
                    </Badge>
                  }
                />
                <Field
                  label="Size guide"
                  value={
                    product.sizeGuide ? (
                      <div className="flex w-fit items-center gap-2">
                        <Link
                          href={product.sizeGuide}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                        >
                          Open size guide
                          <ExternalLink className="size-3.5" />
                        </Link>
                      </div>
                    ) : null
                  }
                />
                <Field
                  label="Description"
                  value={product.description}
                  className="sm:col-span-2"
                />
              </Section>

              <Section title="Pricing">
                <Field
                  label="Cost price"
                  value={currencyFormatter.format(product.costPrice)}
                />
                <Field
                  label="Selling price"
                  value={currencyFormatter.format(product.sellingPrice)}
                />
                <Field
                  label="Discount percentage"
                  value={`${product.discountPercentage}%`}
                />
              </Section>

              <PricingSummaryCard product={product} />

              <Section title="Classification">
                <Field
                  label="Gender"
                  value={
                    <EnumBadge>{genderLabels[product.gender]}</EnumBadge>
                  }
                />
                <Field
                  label="Age group"
                  value={
                    <EnumBadge>{ageGroupLabels[product.ageGroup]}</EnumBadge>
                  }
                />
              </Section>

              <Section title="Display">
                <Field
                  label="Featured"
                  value={
                    <BoolBadge active={product.isFeatured} label="Yes" />
                  }
                />
                <Field
                  label="Active"
                  value={<BoolBadge active={product.isActive} label="Yes" />}
                />
              </Section>

              <Section title="Details">
                <Field label="Material" value={product.material} />
                <Field
                  label="Care instructions"
                  value={product.careInstructions}
                />
              </Section>

              <Section title="Search Engine Optimization">
                <Field
                  label="Meta title"
                  value={product.metaTitle}
                  className="sm:col-span-2"
                />
                <Field
                  label="Meta description"
                  value={product.metaDescription}
                  className="sm:col-span-2"
                />
              </Section>

              <Section title="Record">
                <Field
                  label="ID"
                  value={
                    <code className="font-mono text-xs break-all">
                      {product.id}
                    </code>
                  }
                  className="sm:col-span-2"
                />
                <Field
                  label="Created"
                  value={new Date(product.createdAt).toLocaleString()}
                />
                <Field
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