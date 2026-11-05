"use client";

import { useState } from "react";
import ProductGallery from "./product-gallery";
import ProductInfo from "./product-info";
import ProductPricing from "./product-pricing";
import SizeGuide from "./size-guide";
import VariantSelector from "./variant-selector";
import ProductActions from "./product-actions";
import type { ProductDetailsDto, ProductDetailsVariantDto } from "@/types/product";

interface ProductDetailsClientProps {
  product: ProductDetailsDto;
}

export default function ProductDetailsClient({
  product,
}: ProductDetailsClientProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductDetailsVariantDto | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  const handleVariantChange = (variant: ProductDetailsVariantDto | null) => {
    setSelectedVariant(variant);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      <div>
        <ProductGallery
          key={selectedColorId ?? "default"}
          images={product.images}
          selectedColorId={selectedColorId}
        />
      </div>

      <div className="flex flex-col gap-6">
        <ProductInfo product={product} />
        <ProductPricing
          sellingPrice={product.sellingPrice}
          discountPercentage={product.discountPercentage}
        />
        <div className="flex flex-col gap-6">
          <VariantSelector
            product={product}
            onVariantChange={handleVariantChange}
            onColorChange={setSelectedColorId}
          />
          <ProductActions
            selectedVariant={selectedVariant}
            inStock={product.inStock}
            totalAvailableQuantity={product.totalAvailableQuantity}
          />
        </div>
        <SizeGuide
          sizeGuide={product.sizeGuide}
          categorySizeGuideUrl={product.category.sizeGuideUrl}
        />
      </div>
    </div>
  );
}
