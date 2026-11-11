"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, Zap } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { toCartItem } from "@/types/cart";
import type { ProductDetailsDto, ProductDetailsVariantDto } from "@/types/product";

interface ProductActionsProps {
  product: ProductDetailsDto;
  selectedVariant: ProductDetailsVariantDto | null;
  inStock: boolean;
  totalAvailableQuantity: number;
  quantity: number;
}

export default function ProductActions({
  product,
  selectedVariant,
  inStock,
  totalAvailableQuantity,
  quantity,
}: ProductActionsProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const canPurchase =
    inStock && selectedVariant && selectedVariant.inStock && quantity > 0;

  const handleAddToCart = () => {
    if (!selectedVariant || quantity <= 0) return;

    addItem(toCartItem(product, selectedVariant, quantity));
    // Open the drawer so the customer gets immediate feedback and can keep
    // shopping from the same page.
    openCart();
  };

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
          onClick={() =>
            console.log(
              "inventoryId: ", selectedVariant!.inventoryId,
              "quantity: ", quantity
            )
          }
        >
          <Zap className="mr-2 size-4" />
          Buy Now
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          disabled={!canPurchase}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="mr-2 size-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
