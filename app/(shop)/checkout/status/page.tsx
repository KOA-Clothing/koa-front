import type { Metadata } from "next";
import CheckoutStatusClient from "@/components/shop-front/checkout/checkout-status-client";

export const metadata: Metadata = {
  title: "Payment status | KOA Clothing",
  description: "Confirming your KOA Clothing payment with PayHere.",
  robots: { index: false, follow: false },
};

interface CheckoutStatusPageProps {
  searchParams: Promise<{ orderId?: string | string[] }>;
}

/**
 * PayHere's modal closes before the webhook settles the order, so the client
 * polls the order here instead of assuming the payment succeeded. `orderId`
 * stays in the URL so a refresh resumes the same confirmation.
 */
export default async function CheckoutStatusPage({
  searchParams,
}: CheckoutStatusPageProps) {
  const params = await searchParams;
  const raw = params.orderId;
  const orderId = Array.isArray(raw) ? raw[0] ?? null : raw ?? null;

  // Keyed by order id so switching orders resets the polling/timer state
  // instead of carrying the previous order's confirmation window across.
  return <CheckoutStatusClient key={orderId ?? "none"} orderId={orderId} />;
}
