import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import type { ClothingSize } from "@/types/enums";
import { ClothingSizeEnum } from "@/types/enums";
import { clothingSizeLabels } from "@/types/enum-labels";
import type { ProductVariantsCollectionDto } from "@/types/product-variant";

interface AvailableVariantSummaryProps {
  product: ProductVariantsCollectionDto;
}

/**
 * Summarizes the variants a product already has, grouped by size:
 * `Small - Black, Red` / `Medium - Red, Blue`.
 */
export default function AvailableVariantSummary({
  product,
}: AvailableVariantSummaryProps) {
  const groups = useMemo(() => {
    const bySize = new Map<ClothingSize, string[]>();
    for (const variant of product.variants) {
      const current = bySize.get(variant.size) ?? [];
      if (!current.includes(variant.color.name)) {
        current.push(variant.color.name);
        bySize.set(variant.size, current);
      }
    }
    // Smallest size first.
    return [...bySize.entries()].sort((a, b) => a[0] - b[0]);
  }, [product.variants]);

  return (
    <div className="flex flex-col gap-2 rounded-xl border p-4">
      <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Available variants
      </Label>

      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">No variants yet.</p>
      ) : (
        <ul className="flex flex-col gap-1.5 text-sm ml-3">
          {groups.map(([size, colors]) => (
            <li key={size} className="flex items-baseline gap-2">
              <span className="w-16 shrink-0 font-medium">
                {clothingSizeLabels[size as ClothingSizeEnum]}
              </span>
              <span className="text-muted-foreground">{colors.join(", ")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}