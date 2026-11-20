"use client";

import Script from "next/script";

interface PayHereScriptProps {
  onReady: () => void;
  onError?: () => void;
}

/**
 * PayHere's Onsite Checkout SDK. Rendered per checkout route (instead of
 * globally) so the storefront never pays for it outside the payment flow.
 * `afterInteractive` keeps it off the critical path; Place Order stays
 * disabled until `onReady` fires.
 */
export default function PayHereScript({
  onReady,
  onError,
}: PayHereScriptProps) {
  return (
    <Script
      id="payhere-sdk"
      src="https://www.payhere.lk/lib/payhere-2.0.js"
      strategy="afterInteractive"
      onReady={onReady}
      onError={onError}
    />
  );
}
