/**
 * PayHere Onsite Checkout SDK (`https://www.payhere.lk/lib/payhere.js`).
 *
 * The SDK is a global script rather than an npm package, so this is the only
 * place that describes its shape. Keep the payment object in sync with
 * https://support.payhere.lk/api-&-mobile-sdk/payhere-checkout.
 */

export interface PayHerePayment {
  sandbox: boolean;
  merchant_id: string;
  /** Return/cancel URLs are only used by the redirect flow; the onsite modal ignores them. */
  return_url?: string;
  cancel_url?: string;
  /** Server-to-server notification endpoint. Required for the backend webhook. */
  notify_url?: string;
  order_id: string;
  items: string;
  /** Always a 2-decimal string, matching the backend's `ToString("F2")` hash input. */
  amount: string;
  currency: string;
  hash: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_country?: string;
  custom_1?: string;
  custom_2?: string;
}

export interface PayHere {
  startPayment(payment: PayHerePayment): void;
  /**
   * Fires when the modal closes after a payment attempt. It fires for both
   * approved and declined cards, so it is never proof of success.
   */
  onCompleted: ((orderId: string) => void) | null;
  /** The customer closed the modal without finishing. */
  onDismissed: (() => void) | null;
  onError: ((error: string) => void) | null;
}

declare global {
  interface Window {
    payhere?: PayHere;
  }
}
