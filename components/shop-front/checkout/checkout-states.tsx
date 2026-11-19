"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LogIn, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";

interface CheckoutStatusProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

function CheckoutStatus({
  icon,
  title,
  description,
  children,
}: CheckoutStatusProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 py-24 text-center md:px-8">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

/** Shown while Clerk and the persisted cart/checkout stores are loading. */
export function CheckoutSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
}

/** Nothing to check out — the cart is empty and there is no buy-now item. */
export function CheckoutEmptyState() {
  return (
    <CheckoutStatus
      icon={<ShoppingBag className="size-6" aria-hidden="true" />}
      title="Your checkout is empty"
      description="Add items to your cart, or choose Buy Now on a product to check out a single item."
    >
      <Button
        nativeButton={false}
        render={<Link href={PAGE_ROUTES.SHOP.SEARCH} />}
      >
        Continue shopping
      </Button>
    </CheckoutStatus>
  );
}

/**
 * Fallback gate for a direct visit while signed out. The cart/buy-now buttons
 * send the customer to Clerk themselves; this catches a deep link or an
 * expired session.
 */
export function CheckoutSignInRequired({
  onSignIn,
}: {
  onSignIn: () => void;
}) {
  return (
    <CheckoutStatus
      icon={<LogIn className="size-6" aria-hidden="true" />}
      title="Sign in to continue"
      description="Your cart is saved. Sign in or create an account to complete your order."
    >
      <Button size="lg" onClick={onSignIn}>
        <LogIn className="mr-2 size-4" aria-hidden="true" />
        Sign in to continue
      </Button>
    </CheckoutStatus>
  );
}
