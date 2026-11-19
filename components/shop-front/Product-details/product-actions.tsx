"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Zap } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { showAddToCartToast } from "@/components/toasts/add-to-cart-toast";
import { authHrefs, PAGE_ROUTES } from "@/lib/configs/page-routes";
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
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const addItem = useCartStore((state) => state.addItem);
  const startBuyNowCheckout = useCheckoutStore(
    (state) => state.startBuyNowCheckout
  );

  const canPurchase =
    inStock && selectedVariant && selectedVariant.inStock && quantity > 0;

  const handleAddToCart = () => {
    if (!selectedVariant || quantity <= 0) return;

    const item = toCartItem(product, selectedVariant, quantity);
    addItem(item);

    // Deliberately does not open the drawer: the toast confirms the add
    // without pulling the customer out of the page they are still shopping on.
    showAddToCartToast(item);
  };

  const handleBuyNow = () => {
    if (!selectedVariant || quantity <= 0) return;

    // Buy Now deliberately does not touch the cart: it checks out this single
    // selection only, and the checkout store carries it across the auth detour.
    const item = toCartItem(product, selectedVariant, quantity);
    startBuyNowCheckout(item);

    if (isLoaded && !isSignedIn) {
      router.push(authHrefs.signIn(PAGE_ROUTES.SHOP.CHECKOUT));
      return;
    }

    router.push(PAGE_ROUTES.SHOP.CHECKOUT);
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
          onClick={handleBuyNow}
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
