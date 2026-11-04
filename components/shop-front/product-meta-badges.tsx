"use client";

import CategoryName from "@/components/shop-front/category-name";
import IsFeaturedBadge from "@/components/shop-front/is-featured-badge";
import ProductStatusBadge from "@/components/shop-front/product-status-badge";
import { ProductStatusEnum } from "@/types/enums";

interface ProductMetaBadgesProps {
  categoryName: string;
  isFeatured: boolean;
  status: ProductStatusEnum;
}

export default function ProductMetaBadges({
  categoryName,
  isFeatured,
  status,
}: ProductMetaBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CategoryName name={categoryName} />
      <IsFeaturedBadge isFeatured={isFeatured} />
      <ProductStatusBadge status={status} />
    </div>
  );
}
