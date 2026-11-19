import type { Metadata } from "next";
import CheckoutPageClient from "@/components/shop-front/checkout/checkout-page-client";

export const metadata: Metadata = {
  title: "Checkout | KOA Clothing",
  description:
    "Confirm your delivery address and payment method, then place your KOA Clothing order.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
