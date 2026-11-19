"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authHrefs, PAGE_ROUTES } from "@/lib/configs/page-routes";
import { useAddresses } from "@/features/checkout/hooks/use-addresses";
import { useCheckoutItems } from "@/features/checkout/hooks/use-checkout-items";
import {
  CheckoutAddressFormSchema,
  emptyCheckoutAddress,
  toNewDeliveryAddress,
  toPlaceOrderItems,
  toSavedDeliveryAddress,
  type CheckoutAddressForm,
  type DeliveryAddressPayload,
  type PaymentMethod,
  type PlaceOrderCommand,
} from "@/types/checkout";
import {
  CheckoutEmptyState,
  CheckoutSignInRequired,
  CheckoutSkeleton,
} from "./checkout-states";
import DeliveryAddressSection from "./delivery-address-section";
import OrderSummary from "./order-summary";
import PaymentMethodSection from "./payment-method-section";

type AddressFieldErrors = Partial<Record<keyof CheckoutAddressForm, string>>;

/**
 * The checkout page.
 *
 * Reads the order from the persisted cart/buy-now stores, asks the API for the
 * signed-in customer's saved addresses, and only then renders the form. The
 * gate order matters:
 *
 *   loading → empty → signed out → checkout
 *
 * so a signed-out customer with an empty cart sees "empty" (nothing to protect)
 * and a signed-out customer with a cart is sent through Clerk before any
 * address request is made.
 */
export default function CheckoutPageClient() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { items, mode, isReady } = useCheckoutItems();

  const addressesQuery = useAddresses(isLoaded && isSignedIn === true);
  const addresses = addressesQuery.data ?? [];

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<CheckoutAddressForm>(emptyCheckoutAddress);
  const [newAddressErrors, setNewAddressErrors] = useState<AddressFieldErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  // Selection is derived, not stored, so the default address can appear as soon
  // as the list arrives without a setState-in-effect. `selectedAddressId` only
  // holds an explicit customer choice; until then the default (or first)
  // address wins. A customer with no saved addresses lands in the new-address
  // form automatically instead of on an empty picker.
  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
  const explicitAddress = selectedAddressId
    ? addresses.find((address) => address.id === selectedAddressId) ?? null
    : null;
  const usingNewAddress = showNewAddressForm || (addressesQuery.isSuccess && addresses.length === 0);
  const effectiveAddressId = usingNewAddress ? null : explicitAddress?.id ?? defaultAddress?.id ?? null;

  if (!isReady || !isLoaded) {
    return <CheckoutSkeleton />;
  }

  if (items.length === 0) {
    return <CheckoutEmptyState />;
  }

  if (!isSignedIn) {
    return (
      <CheckoutSignInRequired
        onSignIn={() => router.push(authHrefs.signIn(PAGE_ROUTES.SHOP.CHECKOUT))}
      />
    );
  }

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    setShowNewAddressForm(false);
  };

  const handleSelectNewAddress = () => {
    setShowNewAddressForm(true);
    setSelectedAddressId(null);
  };

  const handleCancelNewAddress = () => {
    // Clearing the explicit choice is enough: the derived selection falls back
    // to the default address.
    setShowNewAddressForm(false);
  };

  const handleNewAddressChange = <K extends keyof CheckoutAddressForm>(
    field: K,
    value: CheckoutAddressForm[K]
  ) => {
    setNewAddress((current) => ({ ...current, [field]: value }));
    setNewAddressErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handlePlaceOrder = () => {
    let deliveryAddress: DeliveryAddressPayload;

    if (usingNewAddress) {
      const result = CheckoutAddressFormSchema.safeParse(newAddress);

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        const mapped: AddressFieldErrors = {};

        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (messages?.[0]) {
            mapped[field as keyof CheckoutAddressForm] = messages[0];
          }
        }

        setNewAddressErrors(mapped);
        return;
      }

      deliveryAddress = toNewDeliveryAddress(result.data);
    } else {
      if (!effectiveAddressId) return;
      deliveryAddress = toSavedDeliveryAddress(effectiveAddressId);
    }

    // No `notes` key: the backend command accepts one, but the storefront does
    // not expose a notes field yet, so it must stay unset.
    const payload: PlaceOrderCommand = {
      deliveryAddress,
      items: toPlaceOrderItems(items),
    };

    // TODO: POST the payload to API_ROUTES.ORDERS.BASE once the order endpoint
    // is wired up. Until then the order is only logged for inspection.
    console.log("[checkout] Place order", {
      ...payload,
      paymentMethod,
      mode,
    });
  };

  const canPlaceOrder = usingNewAddress || effectiveAddressId !== null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
      <header className="flex flex-col gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Back
        </Button>
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
          Secure checkout
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Complete your order
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Confirm your delivery address and payment method, then place your
          order. We&apos;ll take it from there.
        </p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="flex flex-col gap-6">
          <DeliveryAddressSection
            addresses={addresses}
            isLoading={addressesQuery.isLoading}
            isError={addressesQuery.isError}
            isFetching={addressesQuery.isFetching}
            onRetry={() => void addressesQuery.refetch()}
            selectedAddressId={effectiveAddressId}
            showNewAddressForm={usingNewAddress}
            onSelectAddress={handleSelectAddress}
            onSelectNewAddress={handleSelectNewAddress}
            onCancelNewAddress={handleCancelNewAddress}
            newAddress={newAddress}
            newAddressErrors={newAddressErrors}
            onNewAddressChange={handleNewAddressChange}
            canCancelNewAddress={addresses.length > 0}
          />

          <PaymentMethodSection
            value={paymentMethod}
            onChange={setPaymentMethod}
          />

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground lg:justify-start">
            <Lock className="size-3.5 shrink-0" aria-hidden="true" />
            You won&apos;t be charged until the order is confirmed.
          </p>
        </div>

        <OrderSummary
          items={items}
          onPlaceOrder={handlePlaceOrder}
          canPlaceOrder={canPlaceOrder}
          isBuyNow={mode === "buy-now"}
        />
      </div>
    </div>
  );
}
