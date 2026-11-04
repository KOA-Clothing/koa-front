import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProductStatusEnum } from "@/types/enums";
import { genderLabels, ageGroupLabels, productStatusLabels } from "@/types/enum-labels";
import type { ProductDetailsDto } from "@/types/product";
import DesignBadge from "@/components/shop-front/design-badge";

const statusBadgeClasses: Record<ProductStatusEnum, string> = {
  [ProductStatusEnum.Draft]: "bg-foreground/90 text-background",
  [ProductStatusEnum.Discontinued]: "bg-destructive text-white",
  [ProductStatusEnum.OutOfStock]: "bg-amber-400 text-amber-950",
  [ProductStatusEnum.Available]: "",
};

export function calculatePriceBreakdown(sellingPrice: number, discountPercentage: number) {
  const hasDiscount = discountPercentage > 0;
  const finalPrice = sellingPrice * (1 - discountPercentage / 100);
  return { hasDiscount, finalPrice };
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

interface ProductInfoProps {
  product: ProductDetailsDto;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const statusLabel =
    product.status === ProductStatusEnum.Available
      ? null
      : productStatusLabels[product.status];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {product.category.name}
          </p>
          {product.isFeatured && (
            <Badge className="bg-foreground text-background">Featured</Badge>
          )}
          {statusLabel && (
            <Badge
              className={cn(
                "border-transparent",
                statusBadgeClasses[product.status]
              )}
            >
              {statusLabel}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {product.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{genderLabels[product.gender]}</span>
          <span>•</span>
          <span>{ageGroupLabels[product.ageGroup]}</span>
        </div>
      </div>

      {product.description && (
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p className="whitespace-pre-wrap">{product.description}</p>
        </div>
      )}

      {product.designs && product.designs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.designs.map((design) => (
            <DesignBadge key={design.id} design={design} />
          ))}
        </div>
      )}

      {(product.material || product.careInstructions) && (
        <div className="flex flex-col gap-4 border-t border-border pt-6">
          {product.material && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Material</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {product.material}
              </p>
            </div>
          )}
          {product.careInstructions && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Care Instructions</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {product.careInstructions}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
