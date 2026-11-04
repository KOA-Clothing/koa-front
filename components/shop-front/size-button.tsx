"use client";

import { cn } from "@/lib/utils";
import { clothingSizeLabels } from "@/types/enum-labels";
import { ClothingSizeEnum } from "@/types/enums";

interface SizeButtonProps {
  size: ClothingSizeEnum;
  isSelected: boolean;
  isAvailable: boolean;
  onClick: () => void;
}

export default function SizeButton({
  size,
  isSelected,
  isAvailable,
  onClick,
}: SizeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isAvailable && !isSelected}
      className={cn(
        "min-w-12 rounded-md border px-3 py-2 text-sm font-medium transition-all",
        isSelected
          ? "border-foreground bg-foreground text-background"
          : isAvailable
          ? "border-border hover:border-foreground"
          : "border-border opacity-40 cursor-not-allowed"
      )}
    >
      {clothingSizeLabels[size]}
    </button>
  );
}
