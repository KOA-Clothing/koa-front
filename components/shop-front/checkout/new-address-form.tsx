"use client";

import KoaFormField from "@/components/general/koa-form-field";
import type { CheckoutAddressForm } from "@/types/checkout";

type AddressFieldErrors = Partial<Record<keyof CheckoutAddressForm, string>>;

interface NewAddressFormProps {
  value: CheckoutAddressForm;
  errors: AddressFieldErrors;
  onChange: <K extends keyof CheckoutAddressForm>(
    field: K,
    value: CheckoutAddressForm[K]
  ) => void;
}

/**
 * Inline new-address form. Kept on the page instead of a dialog because the
 * customer is already mid-form and a modal would hide the order summary they
 * are checking against.
 */
export default function NewAddressForm({
  value,
  errors,
  onChange,
}: NewAddressFormProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground">
          New delivery address
        </h3>
        <p className="text-xs text-muted-foreground">
          Enter the address you want this order delivered to.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KoaFormField
          label="Label"
          id="checkout-address-label"
          placeholder="e.g. Home, Office"
          value={value.label}
          onChange={(event) => onChange("label", event.target.value)}
          error={errors.label}
        />
        <KoaFormField
          label="House number"
          id="checkout-address-house-no"
          placeholder="e.g. 714/3"
          value={value.houseNo}
          onChange={(event) => onChange("houseNo", event.target.value)}
          error={errors.houseNo}
        />
      </div>

      <KoaFormField
        label="Address line 1"
        id="checkout-address-line-1"
        placeholder="Street address"
        value={value.addressLine1}
        onChange={(event) => onChange("addressLine1", event.target.value)}
        error={errors.addressLine1}
      />
      <KoaFormField
        label="Address line 2 (optional)"
        id="checkout-address-line-2"
        placeholder="Apartment, suite, unit, etc."
        value={value.addressLine2}
        onChange={(event) => onChange("addressLine2", event.target.value)}
        error={errors.addressLine2}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KoaFormField
          label="City"
          id="checkout-address-city"
          placeholder="City"
          value={value.city}
          onChange={(event) => onChange("city", event.target.value)}
          error={errors.city}
        />
        <KoaFormField
          label="State / Province"
          id="checkout-address-province"
          placeholder="State or province"
          value={value.province}
          onChange={(event) => onChange("province", event.target.value)}
          error={errors.province}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KoaFormField
          label="Zip / Postal code"
          id="checkout-address-zipcode"
          placeholder="Postal code"
          value={value.zipcode}
          onChange={(event) => onChange("zipcode", event.target.value)}
          error={errors.zipcode}
        />
        <KoaFormField
          label="Country"
          id="checkout-address-country"
          value={value.country}
          disabled
          error={errors.country}
        />
      </div>
    </div>
  );
}
