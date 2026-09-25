"use client";

import ColorSwatch from "@/components/general/koa-color-badge";
import type { ColorDto } from "@/types/color";
import type { ClothingSize } from "@/types/enums";
import { ClothingSizeEnum } from "@/types/enums";
import { clothingSizeLabels } from "@/types/enum-labels";
import { CheckCircle2, TriangleAlert } from "lucide-react";

interface VariantAvailabilityIndicatorProps {
  color: ColorDto | null;
  size: ClothingSize | null;
  /** True while the existence check request is in flight. */
  isChecking: boolean;
  /** `null` until a check has completed. */
  isExist: boolean | null;
  /** The existing variant's SKU, when the check found one. */
  existingSku?: string | null;
}

/**
 * Communicates the outcome of the "does this variant already exist?" check:
 * a neutral hint while checking, a destructive banner when the combination
 * exists, and a success banner when it is free to create.
 */
export default function VariantAvailabilityIndicator({
  color,
  size,
  isChecking,
  isExist,
  existingSku,
}: VariantAvailabilityIndicatorProps) {
  if (isChecking) {
    return (
      <p className="text-xs text-muted-foreground">
        Checking if this variant already exists...
      </p>
    );
  }

  // Nothing to show until a check has actually run.
  if (isExist == null) return null;

  const sizeLabel = size ? clothingSizeLabels[size as ClothingSizeEnum] : "";
  const colorName = color?.name ?? "color";

  if (isExist) {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
        <TriangleAlert className="size-4 shrink-0 text-destructive" />
        {color && size && <ColorSwatch color={color} className="size-4" />}
        <span className="text-destructive">
          A {colorName} / {sizeLabel} variant already exists
          {existingSku ? ` (SKU: ${existingSku})` : ""}.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-emerald-600/30 bg-emerald-600/5 p-3 text-sm">
      <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
      {color && size && <ColorSwatch color={color} className="size-4" />}
      <span className="text-emerald-700 dark:text-emerald-400">
        {colorName} / {sizeLabel} is available — enter a SKU to create it.
      </span>
    </div>
  );
}