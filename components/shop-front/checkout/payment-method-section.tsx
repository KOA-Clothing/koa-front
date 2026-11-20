"use client";

import { CreditCard, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PaymentMethod } from "@/types/checkout";
import CheckoutSection from "./checkout-section";
import RadioIndicator from "./radio-indicator";

interface PaymentMethodSectionProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

/**
 * Payment selection. Only card payment exists today (PayHere sandbox); the
 * radio structure is kept so adding another method later is a one-item change.
 */
export default function PaymentMethodSection({
  value,
  onChange,
}: PaymentMethodSectionProps) {
  return (
    <CheckoutSection
      step={3}
      title="Payment method"
      description="Choose how you'd like to pay for this order."
    >
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">Payment method</legend>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-foreground bg-muted/40 p-4 has-focus-visible:ring-3 has-focus-visible:ring-ring/50">
          <input
            type="radio"
            name="payment-method"
            value="card"
            checked={value === "card"}
            onChange={() => onChange("card")}
            className="sr-only"
          />
          <RadioIndicator checked={value === "card"} />

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                Card payment
              </span>
              <Badge variant="secondary">Secure</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Pay with your debit or credit card through PayHere.
            </p>
          </div>

          <CreditCard
            className="size-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
            color="green"
          />
        </label>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" color="green" />
          <p>Payments are processed securely by <span className="text-blue-600">Pay</span><span className="text-yellow-600">Here</span>.</p>
        </div>
      </fieldset>
    </CheckoutSection>
  );
}
