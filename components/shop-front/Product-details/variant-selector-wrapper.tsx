"use client";

import { useState } from "react";

import type { ProductDetailsDto, ProductDetailsVariantDto } from "@/types/product";
import VariantSelector from "./variant-selector";
import ProductActions from "./product-actions";

interface VariantSelectorWrapperProps {
  product: ProductDetailsDto;
}

export default function VariantSelectorWrapper({
  product,
}: VariantSelectorWrapperProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductDetailsVariantDto | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  // Track selected color separately from variant
  const handleVariantChange = (variant: ProductDetailsVariantDto | null) => {
    setSelectedVariant(variant);
    if (variant) {
      setSelectedColorId(variant.colorId);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <VariantSelector product={product} onVariantChange={handleVariantChange} />
      <ProductActions
        selectedVariant={selectedVariant}
        inStock={product.inStock}
        totalAvailableQuantity={product.totalAvailableQuantity}
      />
    </div>
  );
}
