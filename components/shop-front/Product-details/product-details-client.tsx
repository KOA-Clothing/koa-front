"use client";

import { useState } from "react";
import ProductGallery from "./product-gallery";
import ProductInfo from "./product-info";
import ProductPricing from "./product-pricing";
import SizeGuide from "./size-guide";
import VariantSelector from "./variant-selector";
import QuantitySelector from "./quantity-selector";
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
  const [quantity, setQuantity] = useState(0);

  const handleVariantChange = (variant: ProductDetailsVariantDto | null) => {
    // VariantSelector re-fires this callback on every render (its effect
    // depends on a freshly-built variants array), so only reset the quantity
    // when the selection actually changes — otherwise the count the user
    // just picked would immediately snap back to the default.
    if (variant?.id !== selectedVariant?.id) {
      // Default to 1 so a stale count can never exceed the new variant's
      // available stock; 0 if the variant somehow has none.
      setQuantity(variant ? Math.min(1, variant.availableQuantity) : 0);
    }
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
          {selectedVariant && (
            <QuantitySelector
              quantity={quantity}
              maxQuantity={selectedVariant.availableQuantity}
              onQuantityChange={setQuantity}
            />
          )}
          <ProductActions
            selectedVariant={selectedVariant}
            inStock={product.inStock}
            totalAvailableQuantity={product.totalAvailableQuantity}
            quantity={quantity}
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
