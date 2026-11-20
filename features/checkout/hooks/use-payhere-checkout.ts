"use client";

import { useCallback, useRef, useState } from "react";
import { showErrorToast } from "@/components/toasts/message-toast";
import { useAxiosClient } from "@/hooks/use-api-client";
import { getErrorMessage } from "@/lib/api/errors";
import { API_ROUTES } from "@/lib/configs/api-routes";
import type {
  PlaceOrderAndPayArgs,
  StartPaymentArgs,
} from "@/types/checkout";
import { CheckoutHashResponseSchema, OrderDtoSchema } from "@/types/order";

interface UsePayHereCheckoutOptions {
  /**
   * PayHere's `onCompleted` fires for declined cards too, so callers must
   * treat it as "go and verify", never as success.
   */
  onCompleted: (orderId: string) => void;
  /** The customer closed the modal; the order has been cancelled by then. */
  onDismissed?: (orderId: string) => void;
}

function buildNotifyUrl(): string | undefined {
  const explicitNotifyUrl = process.env.NEXT_PUBLIC_DEV_TUNNEL_URL;
  if (explicitNotifyUrl) return `${explicitNotifyUrl.replace(/\/+$/, "")}/api/webhooks/payhere`;

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return undefined;
  return `${base.replace(/\/+$/, "")}/api/webhooks/payhere`;
}

/**
 * Creates the order, fetches its PayHere hash, and opens the onsite modal.
 *
 * The modal is the only place card data is entered. The backend remains the
 * source of truth for the amount and the hash, and the order is only ever
 * considered paid once the webhook has updated `paymentStatus` — which is why
 * `onCompleted` hands off to the status page instead of clearing the cart.
 */
export function usePayHereCheckout({
  onCompleted,
  onDismissed,
}: UsePayHereCheckoutOptions) {
  const axiosClient = useAxiosClient();
  const [isProcessing, setIsProcessing] = useState(false);
  // A ref as well as state: two fast clicks must not create two orders before
  // React has re-rendered the disabled button.
  const processingRef = useRef(false);

  const releaseProcessing = useCallback(() => {
    processingRef.current = false;
    setIsProcessing(false);
  }, []);

  const startPayment = useCallback(
    async (args: StartPaymentArgs) => {
      const payhere = typeof window !== "undefined" ? window.payhere : undefined;

      if (!payhere) {
        showErrorToast("The payment provider is still loading. Please try again.");
        releaseProcessing();
        return;
      }

      try {
        const response = await axiosClient.get(API_ROUTES.PAYMENTS.CHECKOUT_HASH(args.orderId));
        const checkout = CheckoutHashResponseSchema.parse(response.data);

        // PayHere can fire more than one callback for one attempt; only the
        // first one is allowed to change the page.
        let settled = false;
        const claim = () => {
          if (settled) return false;
          settled = true;
          return true;
        };

        payhere.onCompleted = () => {
          if (!claim()) return;
          releaseProcessing();
          onCompleted(args.orderId);
        };

        payhere.onDismissed = () => {
          if (!claim()) return;

          // The customer abandoned the payment window. Cancel the pending order
          // immediately so its reserved stock is released; the cart and the
          // checkout selection stay intact for another attempt.
          void axiosClient
            .post(API_ROUTES.ORDERS.CANCEL(args.orderId))
            .catch((error) => {
              showErrorToast(getErrorMessage(error));
            })
            .finally(() => {
              releaseProcessing();
              onDismissed?.(args.orderId);
            });
        };

        payhere.onError = (error) => {
          if (!claim()) return;
          releaseProcessing();
          showErrorToast(
            error || "The payment could not be started. Please try again."
          );
        };

        const siteBase = window.location.origin;
        const notifyUrl = buildNotifyUrl();

        if (!notifyUrl) {
          showErrorToast("Payment webhook URL is not configured.");
          releaseProcessing();
          return;
        }

        payhere.startPayment({
          sandbox: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX !== "false",
          merchant_id: checkout.merchantId,
          return_url: `${siteBase}/checkout/status?orderId=${args.orderId}`,
          cancel_url: `${siteBase}/checkout`,
          notify_url: notifyUrl,
          order_id: checkout.orderId,
          items: args.itemsDescription || `Order ${checkout.orderId}`,
          amount: Number(checkout.amount).toFixed(2),
          currency: "LKR",
          hash: checkout.hash,
          first_name: args.customer.firstName.trim() || "Customer",
          last_name: args.customer.lastName.trim() || "User",
          email: args.customer.email.trim(),
          phone: args.customer.phone.trim() || "0770000000",
          address: args.address.line1.trim(),
          city: args.address.city.trim(),
          country: args.address.country.trim() || "Sri Lanka",
          delivery_address: args.address.line1.trim(),
          delivery_city: args.address.city.trim(),
          delivery_country: args.address.country.trim() || "Sri Lanka",
        });
      } catch (error) {
        releaseProcessing();
        showErrorToast(getErrorMessage(error));
      }
    },
    [axiosClient, onCompleted, onDismissed, releaseProcessing]
  );

  const placeOrderAndPay = useCallback(
    async (args: PlaceOrderAndPayArgs) => {
      if (processingRef.current) return;
      processingRef.current = true;
      setIsProcessing(true);

      try {
        const response = await axiosClient.post(
          API_ROUTES.ORDERS.BASE,
          args.payload
        );
        const order = OrderDtoSchema.parse(response.data);

        await startPayment({
          orderId: order.id,
          itemsDescription: args.itemsDescription,
          customer: args.customer,
          address: args.address,
        });
      } catch (error) {
        releaseProcessing();
        showErrorToast(getErrorMessage(error));
      }
    },
    [axiosClient, releaseProcessing, startPayment]
  );

  /**
   * Re-opens the modal for an existing order (failed payment, or a page
   * reload). Deliberately does not POST a new order, so retrying cannot
   * reserve stock twice.
   */
  const retryPayment = useCallback(
    async (args: StartPaymentArgs) => {
      if (processingRef.current) return;
      processingRef.current = true;
      setIsProcessing(true);
      await startPayment(args);
    },
    [startPayment]
  );

  return { placeOrderAndPay, retryPayment, isProcessing };
}
