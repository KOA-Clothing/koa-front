"use client";

import { useState, useEffect } from "react";
import { ClothingSizeEnum } from "@/types/enums";
import type { ProductDetailsDto, ProductDetailsVariantDto } from "@/types/product";
import ColorButton from "@/components/shop-front/color-button";
import SizeButton from "@/components/shop-front/size-button";

interface VariantSelectorProps {
  product: ProductDetailsDto;
  onVariantChange?: (variant: ProductDetailsVariantDto | null) => void;
}

export default function VariantSelector({
  product,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<ClothingSizeEnum | null>(null);

  const { colors, availableSizes, variants } = product;

  // Get available variants
  const activeVariants = variants.filter((v) => v.isActive && v.inStock);

  // Determine which colors are available given selected size
  const availableColorIds = new Set<string>();
  if (selectedSize) {
    activeVariants
      .filter((v) => v.size === selectedSize)
      .forEach((v) => availableColorIds.add(v.colorId));
  } else {
    activeVariants.forEach((v) => availableColorIds.add(v.colorId));
  }

  // Determine which sizes are available given selected color
  const availableSizeSet = new Set<ClothingSizeEnum>();
  if (selectedColorId) {
    activeVariants
      .filter((v) => v.colorId === selectedColorId)
      .forEach((v) => availableSizeSet.add(v.size));
  } else {
    activeVariants.forEach((v) => availableSizeSet.add(v.size));
  }

  // Find current selected variant
  useEffect(() => {
    if (selectedColorId && selectedSize) {
      const variant = activeVariants.find(
        (v) => v.colorId === selectedColorId && v.size === selectedSize
      );
      onVariantChange?.(variant || null);
    } else {
      onVariantChange?.(null);
    }
  }, [selectedColorId, selectedSize, activeVariants, onVariantChange]);

  const handleColorSelect = (colorId: string) => {
    if (selectedColorId === colorId) {
      setSelectedColorId(null);
    } else {
      setSelectedColorId(colorId);
      // If current size not available for this color, clear it
      if (selectedSize && !availableSizeSet.has(selectedSize)) {
        setSelectedSize(null);
      }
    }
  };

  const handleSizeSelect = (size: ClothingSizeEnum) => {
    if (selectedSize === size) {
      setSelectedSize(null);
    } else {
      setSelectedSize(size);
      // If current color not available for this size, clear it
      if (selectedColorId && !availableColorIds.has(selectedColorId)) {
        setSelectedColorId(null);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {colors.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isAvailable = availableColorIds.has(color.id);
              const isSelected = selectedColorId === color.id;
              return (
                <ColorButton
                  key={color.id}
                  color={color}
                  isSelected={isSelected}
                  isAvailable={isAvailable}
                  onClick={() => handleColorSelect(color.id)}
                />
              );
            })}
          </div>
        </div>
      )}

      {(availableSizes.length > 0 || activeVariants.length > 0) && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Size</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes
              .sort((a, b) => a - b)
              .map((size) => {
                const isAvailable = availableSizeSet.has(size);
                const isSelected = selectedSize === size;
                return (
                  <SizeButton
                    key={size}
                    size={size}
                    isSelected={isSelected}
                    isAvailable={isAvailable}
                    onClick={() => handleSizeSelect(size)}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
