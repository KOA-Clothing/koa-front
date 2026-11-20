"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { showErrorToast } from "@/components/toasts/message-toast";
import KoaFormField from "@/components/general/koa-form-field";
import { formatPrice } from "@/components/shop-front/Product-details/product-info";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCheckoutCustomer } from "@/features/checkout/hooks/use-checkout-customer";
import { useCheckoutItems } from "@/features/checkout/hooks/use-checkout-items";
import { useOrder } from "@/features/checkout/hooks/use-order";
import { usePayHereCheckout } from "@/features/checkout/hooks/use-payhere-checkout";
import { usePayHereSdk } from "@/features/checkout/hooks/use-payhere-sdk";
import { getErrorMessage } from "@/lib/api/errors";
import { authHrefs, PAGE_ROUTES, shopHrefs } from "@/lib/configs/page-routes";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import {
  CheckoutPhoneSchema,
  isValidCheckoutPhone,
} from "@/types/checkout";
import { OrderStatusEnum, PaymentStatusEnum } from "@/types/enums";
import PayHereScript from "./payhere-script";
import { CheckoutSignInRequired } from "./checkout-states";

const POLL_INTERVAL_MS = 2500;
const CONFIRMATION_TIMEOUT_MS = 30_000;

interface StatusShellProps {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

function StatusShell({ icon, title, description, children }: StatusShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center px-4 py-20 text-center md:px-8">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {children && <div className="mt-6 w-full">{children}</div>}
    </div>
  );
}

function StatusSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-4 py-20 md:px-8">
      <Skeleton className="size-14 rounded-full" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full max-w-sm" />
      <Skeleton className="mt-2 h-24 w-full rounded-xl" />
    </div>
  );
}

interface CheckoutStatusClientProps {
  orderId: string | null;
}

/**
 * Post-PayHere confirmation.
 *
 * `onCompleted` only proves the modal closed after an attempt — PayHere fires
 * it for declined cards too. So this page polls the order until the backend's
 * webhook has actually settled `paymentStatus`, and only then clears the cart.
 */
export default function CheckoutStatusClient({
  orderId,
}: CheckoutStatusClientProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { customer, primaryPhone, isLoaded: isCustomerLoaded } = useCheckoutCustomer();
  const { isReady: isSdkReady, handleReady } = usePayHereSdk();
  const { isReady: storesReady } = useCheckoutItems();

  const storedPhone = useCheckoutStore((state) => state.contactPhone ?? "");
  const pendingOrderId = useCheckoutStore((state) => state.pendingOrderId);
  const pendingOrderMode = useCheckoutStore((state) => state.pendingOrderMode);
  const setContactPhone = useCheckoutStore((state) => state.setContactPhone);
  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);
  const clearCart = useCartStore((state) => state.clearCart);

  const [timedOut, setTimedOut] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Set after a retry completes: the cached order is still FAILED until the
  // webhook settles it, so polling has to ignore that stale value for a while.
  const [isAwaitingRetry, setIsAwaitingRetry] = useState(false);
  const [manualPhone, setManualPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const clearedRef = useRef(false);

  const orderQuery = useOrder(orderId, {
    enabled: isLoaded && isSignedIn === true,
    refetchInterval: (query) => {
      if (timedOut) return false;
      const data = query.state.data;
      // Terminal states stop the poll even while a retry is settling.
      if (
        data &&
        (data.paymentStatus === PaymentStatusEnum.COMPLETED ||
          data.status === OrderStatusEnum.CANCELLED)
      ) {
        return false;
      }
      if (isAwaitingRetry) return POLL_INTERVAL_MS;
      // Stop as soon as the webhook has moved the order out of PENDING.
      if (data && data.paymentStatus !== PaymentStatusEnum.PENDING) {
        return false;
      }
      return POLL_INTERVAL_MS;
    },
  });

  const { refetch } = orderQuery;
  const order = orderQuery.data;

  // Each attempt (first load or a retry) gets a fresh confirmation window.
  // Handlers reset `timedOut` themselves; this effect only owns the timer, so
  // it never calls setState synchronously during render/commit.
  useEffect(() => {
    const timer = window.setTimeout(
      () => setTimedOut(true),
      CONFIRMATION_TIMEOUT_MS
    );
    return () => window.clearTimeout(timer);
  }, [orderId, attempt]);

  const handleCompleted = useCallback(() => {
    setTimedOut(false);
    setIsAwaitingRetry(true);
    setAttempt((current) => current + 1);
    void refetch();
  }, [refetch]);

  const handleDismissed = useCallback(() => {
    void refetch();
  }, [refetch]);

  const { retryPayment, isProcessing } = usePayHereCheckout({
    onCompleted: handleCompleted,
    onDismissed: handleDismissed,
  });

  const isCompleted = order?.paymentStatus === PaymentStatusEnum.COMPLETED;
  const isCancelled = order?.status === OrderStatusEnum.CANCELLED;
  // While a retry is settling, the FAILED value is the previous attempt, not
  // this one, so the page keeps showing the confirmation spinner instead.
  const isFailed =
    order?.paymentStatus === PaymentStatusEnum.FAILED && !isAwaitingRetry;

  // Clear the cart only once the backend confirms the payment *and* this is
  // the order checkout actually placed. Revisiting an older completed order
  // must not wipe a cart the customer has since filled again.
  const isPendingOrder =
    order !== undefined &&
    pendingOrderId !== null &&
    pendingOrderId.toLowerCase() === order.id.toLowerCase();

  useEffect(() => {
    if (!storesReady || !isCompleted || !isPendingOrder || clearedRef.current) {
      return;
    }

    clearedRef.current = true;
    if (pendingOrderMode === "cart") clearCart();
    resetCheckout();
  }, [
    storesReady,
    isCompleted,
    isPendingOrder,
    pendingOrderMode,
    clearCart,
    resetCheckout,
  ]);

  const hasProfilePhone = isValidCheckoutPhone(primaryPhone);
  const hasStoredPhone = isValidCheckoutPhone(storedPhone);
  const effectivePhone = hasProfilePhone
    ? primaryPhone
    : hasStoredPhone
      ? storedPhone
      : manualPhone;
  const needsPhone = !hasProfilePhone && !hasStoredPhone;

  const handleRefresh = () => {
    setTimedOut(false);
    setIsAwaitingRetry(false);
    setAttempt((current) => current + 1);
    void refetch();
  };

  const handleRetry = () => {
    if (!order) return;

    const phoneResult = CheckoutPhoneSchema.safeParse(effectivePhone);
    if (!phoneResult.success) {
      setPhoneError(
        phoneResult.error.issues[0]?.message ?? "Enter a valid phone number"
      );
      return;
    }

    setPhoneError(undefined);
    setContactPhone(phoneResult.data);

    void retryPayment({
      orderId: order.id,
      itemsDescription: `KOA order ${order.orderNumber}`,
      customer: { ...customer, phone: phoneResult.data },
      address: {
        line1: [
          order.deliveryAddress.houseNo,
          order.deliveryAddress.addressLine1,
          order.deliveryAddress.addressLine2,
        ]
          .filter(Boolean)
          .join(", "),
        city: order.deliveryAddress.city,
        country: order.deliveryAddress.country,
      },
    }).finally(() => {
      // If the order settled while this page sat on a stale failure (the
      // webhook completed it, or the hash was refused as already paid), pull
      // the current state instead of leaving the customer on the failed view.
      void refetch();
    });
  };

  if (!orderId) {
    return (
      <StatusShell
        icon={<AlertCircle className="size-6" aria-hidden="true" />}
        title="No order to check"
        description="This page needs an order id. Start again from checkout."
      >
        <Button
          nativeButton={false}
          render={<Link href={PAGE_ROUTES.SHOP.CHECKOUT} />}
        >
          Back to checkout
        </Button>
      </StatusShell>
    );
  }

  if (!isLoaded || !isCustomerLoaded) {
    return <StatusSkeleton />;
  }

  if (!isSignedIn) {
    return (
      <CheckoutSignInRequired
        onSignIn={() =>
          router.push(authHrefs.signIn(shopHrefs.checkoutStatus(orderId)))
        }
      />
    );
  }

  if (orderQuery.isLoading) {
    return <StatusSkeleton />;
  }

  if (!order) {
    return (
      <StatusShell
        icon={<AlertCircle className="size-6" aria-hidden="true" />}
        title="Couldn't load this order"
        description={
          orderQuery.isError
            ? getErrorMessage(orderQuery.error)
            : "The order could not be found."
        }
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={handleRefresh} disabled={orderQuery.isFetching}>
            <RefreshCw className="mr-2 size-4" aria-hidden="true" />
            {orderQuery.isFetching ? "Checking…" : "Try again"}
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={PAGE_ROUTES.SHOP.CHECKOUT} />}
          >
            Back to checkout
          </Button>
        </div>
      </StatusShell>
    );
  }

  if (isCompleted) {
    return (
      <StatusShell
        icon={
          <CheckCircle2
            className="size-6 text-emerald-600"
            aria-hidden="true"
          />
        }
        title="Payment confirmed"
        description="Your order is confirmed and will be prepared for delivery."
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Order number</span>
              <span className="font-mono text-foreground">
                {order.orderNumber}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Total paid</span>
              <span className="font-semibold tabular-nums text-foreground">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground">Delivering to</span>
              <span className="text-right text-foreground">
                {order.deliveryAddress.houseNo},{" "}
                {order.deliveryAddress.addressLine1}
                <br />
                {order.deliveryAddress.city}, {order.deliveryAddress.country}
              </span>
            </div>
          </div>

          <Button
            nativeButton={false}
            render={<Link href={PAGE_ROUTES.SHOP.SEARCH} />}
          >
            Continue shopping
          </Button>
        </div>
      </StatusShell>
    );
  }

  if (isCancelled) {
    return (
      <StatusShell
        icon={<XCircle className="size-6" aria-hidden="true" />}
        title="Order cancelled"
        description="This order was cancelled and no payment was taken. Your cart is still intact."
      >
        <Button
          nativeButton={false}
          render={<Link href={PAGE_ROUTES.SHOP.CHECKOUT} />}
        >
          Back to checkout
        </Button>
      </StatusShell>
    );
  }

  if (isFailed) {
    return (
      <>
        {/* Retrying opens the same PayHere modal, so the SDK has to be present
            on a direct visit to this page too. */}
        <PayHereScript
          onReady={handleReady}
          onError={() =>
            showErrorToast(
              "Could not load PayHere. Check your connection and refresh the page."
            )
          }
        />
        <StatusShell
          icon={<XCircle className="size-6" aria-hidden="true" />}
          title="Payment didn't go through"
          description="No money was taken. You can try the same order again while its stock is still reserved."
        >
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-left text-sm text-destructive">
              {order.cancelReason ??
                "PayHere declined or cancelled the payment."}
            </div>

            {needsPhone && (
              <div className="text-left">
                <KoaFormField
                  label="Phone number"
                  id="status-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="e.g. 0771234567"
                  value={manualPhone}
                  onChange={(event) => {
                    setManualPhone(event.target.value);
                    if (phoneError) setPhoneError(undefined);
                  }}
                  error={phoneError}
                />
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                onClick={handleRetry}
                disabled={isProcessing || !isSdkReady}
              >
                {isProcessing ? (
                  <Loader2
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <RefreshCw className="mr-2 size-4" aria-hidden="true" />
                )}
                {isProcessing ? "Opening PayHere…" : "Try payment again"}
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href={PAGE_ROUTES.SHOP.CHECKOUT} />}
              >
                Back to checkout
              </Button>
            </div>
          </div>
        </StatusShell>
      </>
    );
  }

  if (timedOut) {
    return (
      <StatusShell
        icon={<Clock className="size-6" aria-hidden="true" />}
        title="Still confirming your payment"
        description="PayHere hasn't confirmed the payment yet. If you were charged, don't pay again — check the status once more."
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={handleRefresh} disabled={orderQuery.isFetching}>
            <RefreshCw className="mr-2 size-4" aria-hidden="true" />
            {orderQuery.isFetching ? "Checking…" : "Check status again"}
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={PAGE_ROUTES.SHOP.SEARCH} />}
          >
            Continue shopping
          </Button>
        </div>
      </StatusShell>
    );
  }

  return (
    <StatusShell
      icon={<Loader2 className="size-6 animate-spin" aria-hidden="true" />}
      title="Confirming your payment"
      description="PayHere is finalising the payment. This page updates automatically — please don't close it."
    >
      <p className="text-sm text-muted-foreground">
        Order <span className="font-mono text-foreground">{order.orderNumber}</span>
      </p>
    </StatusShell>
  );
}
