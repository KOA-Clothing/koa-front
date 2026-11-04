"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProductStatusEnum } from "@/types/enums";
import { productStatusLabels } from "@/types/enum-labels";

const statusBadgeClasses: Record<ProductStatusEnum, string> = {
  [ProductStatusEnum.Draft]: "bg-foreground/90 text-background",
  [ProductStatusEnum.Discontinued]: "bg-destructive text-white",
  [ProductStatusEnum.OutOfStock]: "bg-amber-400 text-amber-950",
  [ProductStatusEnum.Available]: "",
};

interface ProductStatusBadgeProps {
  status: ProductStatusEnum;
}

export default function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  if (status === ProductStatusEnum.Available) return null;
  const statusLabel = productStatusLabels[status];

  return (
    <Badge className={cn("border-transparent", statusBadgeClasses[status])}>
      {statusLabel}
    </Badge>
  );
}
