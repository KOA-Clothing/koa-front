"use client";

import { useEffect, useMemo } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  calculatePriceBreakdown,
  formatPrice,
} from "@/components/shop-front/Product-details/product-info";
import { showClearCartToast } from "@/components/toasts/clear-cart-toast";
import { showRemoveFromCartToast } from "@/components/toasts/remove-from-cart-toast";
import { useCartStore } from "@/stores/cart-store";
import CartItem from "./cart-item";

/**
 * Slide-out cart. Mounted once by the shop header so any page can open it
 * through the store (`openCart`) without a navigation or a refresh.
 */
export default function CartSheet() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  // localStorage does not exist on the server. `skipHydration` keeps the server
  // HTML and the first client render identical (an empty cart), and the
  // persisted lines are pulled in here — after mount — instead of during
  // render, which would cause a hydration mismatch.
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  const { subtotal, total, itemCount } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const { finalPrice } = calculatePriceBreakdown(
          item.sellingPrice,
          item.discountPercentage
        );

        acc.subtotal += item.sellingPrice * item.quantity;
        acc.total += finalPrice * item.quantity;
        acc.itemCount += item.quantity;

        return acc;
      },
      { subtotal: 0, total: 0, itemCount: 0 }
    );
  }, [items]);

  const savings = subtotal - total;

  const handleCheckout = () => {
    // No checkout flow yet — log the snapshot the order API will eventually
    // receive, including the totals shown to the customer.
    console.log("[cart] Checkout", { items, subtotal, total });
  };

  const handleRemove = (inventoryId: string) => {
    // Read the line before removing it: the store no longer has it afterwards,
    // and the toast has to name the exact product/colour/size that went away.
    const removed = items.find((item) => item.inventoryId === inventoryId);

    removeItem(inventoryId);

    if (removed) {
      showRemoveFromCartToast(removed);
    }
  };

  const handleClearCart = () => {
    // The button is disabled when the cart is empty, but the guard keeps the
    // "cleared" confirmation from lying if that ever changes.
    if (items.length === 0) return;

    clearCart();
    showClearCartToast();
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => (open ? openCart() : closeCart())}
    >
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-4 pr-12">
          <SheetTitle className="flex items-baseline gap-2">
            Your Cart
            {itemCount > 0 && (
              <span className="text-sm font-normal tabular-nums text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            {itemCount > 0
              ? "Review your items before checking out."
              : "Items you add will show up here."}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground">
                Pick a size and colour, then add something you love.
              </p>
            </div>
          </div>
        ) : (
          <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto px-4">
            {items.map((item) => (
              <CartItem
                key={item.inventoryId}
                item={item}
                onRemove={handleRemove}
                onNavigate={closeCart}
              />
            ))}
          </ul>
        )}

        <SheetFooter className="gap-3 border-t border-border p-4">
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums text-foreground">
                {formatPrice(subtotal)}
              </span>
            </div>

            {savings > 0 && (
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-muted-foreground">Discount</span>
                <span className="tabular-nums text-foreground">
                  −{formatPrice(savings)}
                </span>
              </div>
            )}

            <div className="flex items-baseline justify-between gap-2 border-t border-border pt-2">
              <span className="text-base font-semibold text-foreground">
                Total
              </span>
              <span className="text-base font-semibold tabular-nums text-foreground">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              className="w-full"
              disabled={items.length === 0}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              disabled={items.length === 0}
              onClick={handleClearCart}
            >
              Clear All
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
