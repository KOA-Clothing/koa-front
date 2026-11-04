import { calculatePriceBreakdown, formatPrice } from "./product-info";

interface ProductPricingProps {
  sellingPrice: number;
  discountPercentage: number;
}

export default function ProductPricing({
  sellingPrice,
  discountPercentage,
}: ProductPricingProps) {
  const { hasDiscount, finalPrice } = calculatePriceBreakdown(
    sellingPrice,
    discountPercentage
  );

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-3xl font-bold tabular-nums text-foreground">
        {formatPrice(hasDiscount ? finalPrice : sellingPrice)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-lg tabular-nums text-muted-foreground line-through">
            {formatPrice(sellingPrice)}
          </span>
          <span className="rounded-full bg-foreground px-2.5 py-0.5 text-xs font-semibold text-background">
            −{Math.round(discountPercentage)}%
          </span>
        </>
      )}
    </div>
  );
}
