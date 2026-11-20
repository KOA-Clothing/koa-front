"use client";

import { Phone } from "lucide-react";
import KoaFormField from "@/components/general/koa-form-field";
import CheckoutSection from "./checkout-section";

interface ContactDetailsSectionProps {
  phone: string;
  phoneError?: string;
  onPhoneChange: (value: string) => void;
  /** True when Clerk has no usable phone, so checkout has to ask for one. */
  showPhoneInput: boolean;
}

/**
 * PayHere requires a contact phone on the payment object. When the Clerk
 * profile already has one, this is a read-only confirmation; otherwise it
 * falls back to an inline input instead of sending the customer to account
 * settings mid-checkout.
 */
export default function ContactDetailsSection({
  phone,
  phoneError,
  onPhoneChange,
  showPhoneInput,
}: ContactDetailsSectionProps) {
  return (
    <CheckoutSection
      step={2}
      title="Contact details"
      description="PayHere uses this number for your payment receipt."
    >
      {showPhoneInput ? (
        <div className="max-w-sm">
          <KoaFormField
            label="Phone number"
            id="checkout-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="e.g. 0771234567"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            error={phoneError}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            We&apos;ll only use this for payment and delivery updates.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
          <Phone
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="font-medium text-foreground">{phone}</span>
          <span className="text-xs text-muted-foreground">
            from your account
          </span>
        </div>
      )}
    </CheckoutSection>
  );
}
