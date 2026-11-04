"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, Zap } from "lucide-react";
import type { ProductDetailsVariantDto } from "@/types/product";

interface ProductActionsProps {
  selectedVariant: ProductDetailsVariantDto | null;
  inStock: boolean;
  totalAvailableQuantity: number;
}

export default function ProductActions({
  selectedVariant,
  inStock,
  totalAvailableQuantity,
}: ProductActionsProps) {
  const canPurchase = inStock && selectedVariant && selectedVariant.inStock;

  return (
    <div className="flex flex-col gap-3">
      {selectedVariant && (
        <p className="text-sm text-muted-foreground">
          {selectedVariant.availableQuantity} {selectedVariant.availableQuantity === 1 ? "item" : "items"} available
        </p>
      )}
      {!inStock && (
        <p className="text-sm text-destructive">Out of stock</p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          disabled={!canPurchase}
          onClick={() => console.log("inventoryId: ", selectedVariant!.inventoryId)}
        >
          <Zap className="mr-2 size-4" />
          Buy Now
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          disabled={!canPurchase}
          onClick={() => console.log("inventoryId: ", selectedVariant!.inventoryId)}
        >
          <ShoppingBag className="mr-2 size-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
