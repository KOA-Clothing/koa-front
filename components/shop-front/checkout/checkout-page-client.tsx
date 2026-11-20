"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { showErrorToast } from "@/components/toasts/message-toast";
import { Button } from "@/components/ui/button";
import { useAddresses } from "@/features/checkout/hooks/use-addresses";
import { useCheckoutCustomer } from "@/features/checkout/hooks/use-checkout-customer";
import { useCheckoutItems } from "@/features/checkout/hooks/use-checkout-items";
import { usePayHereCheckout } from "@/features/checkout/hooks/use-payhere-checkout";
import { usePayHereSdk } from "@/features/checkout/hooks/use-payhere-sdk";
import { useCheckoutStore } from "@/stores/checkout-store";
import {
  authHrefs,
  PAGE_ROUTES,
  shopHrefs,
} from "@/lib/configs/page-routes";
import {
  CheckoutAddressFormSchema,
  CheckoutPhoneSchema,
  emptyCheckoutAddress,
  isValidCheckoutPhone,
  toNewDeliveryAddress,
  toPlaceOrderItems,
  toSavedDeliveryAddress,
  type CheckoutAddressForm,
  type CheckoutPaymentAddress,
  type DeliveryAddressPayload,
  type PaymentMethod,
  type PlaceOrderCommand,
} from "@/types/checkout";
import {
  CheckoutEmptyState,
  CheckoutSignInRequired,
  CheckoutSkeleton,
} from "./checkout-states";
import ContactDetailsSection from "./contact-details-section";
import DeliveryAddressSection from "./delivery-address-section";
import OrderSummary from "./order-summary";
import PaymentMethodSection from "./payment-method-section";
import PayHereScript from "./payhere-script";

type AddressFieldErrors = Partial<Record<keyof CheckoutAddressForm, string>>;

function toPaymentAddress(address: {
  houseNo: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  country: string;
}): CheckoutPaymentAddress {
  return {
    line1: [address.houseNo, address.addressLine1, address.addressLine2]
      .filter(Boolean)
      .join(", "),
    city: address.city,
    country: address.country,
  };
}

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
  const { customer, primaryPhone, isLoaded: isCustomerLoaded } = useCheckoutCustomer();
  const { isReady: isSdkReady, handleReady } = usePayHereSdk();

  const setContactPhone = useCheckoutStore((state) => state.setContactPhone);
  const setPendingOrder = useCheckoutStore((state) => state.setPendingOrder);

  const addressesQuery = useAddresses(isLoaded && isSignedIn === true);
  const addresses = addressesQuery.data ?? [];

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<CheckoutAddressForm>(emptyCheckoutAddress);
  const [newAddressErrors, setNewAddressErrors] = useState<AddressFieldErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [manualPhone, setManualPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | undefined>();

  // PayHere closes the modal for approved *and* declined cards, so completion
  // only means "go and verify". The status page polls until the webhook has
  // settled the order and only then clears the cart.
  const handlePaymentCompleted = useCallback(
    (orderId: string) => {
      // Remember which order this modal belongs to, so the status page clears
      // the cart for this purchase only — not for any older completed order.
      setPendingOrder(orderId, mode);
      router.push(shopHrefs.checkoutStatus(orderId));
    },
    [mode, router, setPendingOrder]
  );

  const { placeOrderAndPay, isProcessing } = usePayHereCheckout({ onCompleted: handlePaymentCompleted });

  // Selection is derived, not stored, so the default address can appear as soon
  // as the list arrives without a setState-in-effect. `selectedAddressId` only
  // holds an explicit customer choice; until then the default (or first)
  // address wins. A customer with no saved addresses lands in the new-address
  // form automatically instead of on an empty picker.
  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
  const explicitAddress = selectedAddressId ? addresses.find((address) => address.id === selectedAddressId) ?? null : null;
  const usingNewAddress = showNewAddressForm || (addressesQuery.isSuccess && addresses.length === 0);
  const effectiveAddressId = usingNewAddress ? null : explicitAddress?.id ?? defaultAddress?.id ?? null;
  const selectedSavedAddress = usingNewAddress ? null : addresses.find((address) => address.id === effectiveAddressId) ?? null;

  // Clerk's phone is used when it is valid; otherwise the inline input supplies it.
  const hasValidProfilePhone = isValidCheckoutPhone(primaryPhone);
  const effectivePhone = hasValidProfilePhone ? primaryPhone : manualPhone;
  const showPhoneInput = !hasValidProfilePhone;

  if (!isReady || !isLoaded || !isCustomerLoaded) {
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

  const handlePhoneChange = (value: string) => {
    setManualPhone(value);
    if (phoneError) setPhoneError(undefined);
  };

  const handlePlaceOrder = () => {
    let deliveryAddress: DeliveryAddressPayload;
    let paymentAddress: CheckoutPaymentAddress;

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
      paymentAddress = toPaymentAddress(result.data);
    } else {
      if (!effectiveAddressId || !selectedSavedAddress) return;
      deliveryAddress = toSavedDeliveryAddress(effectiveAddressId);
      paymentAddress = toPaymentAddress(selectedSavedAddress);
    }

    const phoneResult = CheckoutPhoneSchema.safeParse(effectivePhone);
    if (!phoneResult.success) {
      setPhoneError(
        phoneResult.error.issues[0]?.message ?? "Enter a valid phone number"
      );
      return;
    }

    // No `notes` key: the backend command accepts one, but the storefront does
    // not expose a notes field yet, so it must stay unset.
    const payload: PlaceOrderCommand = {
      deliveryAddress,
      items: toPlaceOrderItems(items),
    };

    // Keep the phone for the status page: a retry after a reload must not have
    // to ask for it again when Clerk has none.
    setContactPhone(phoneResult.data);

    const itemsDescription = items
      .map((item) => `${item.productName} x${item.quantity}`)
      .join(", ")
      .slice(0, 250);

    void placeOrderAndPay({
      payload,
      itemsDescription,
      customer: { ...customer, phone: phoneResult.data },
      address: paymentAddress,
    });
  };

  const canPlaceOrder = usingNewAddress || effectiveAddressId !== null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
      <PayHereScript
        onReady={handleReady}
        onError={() =>
          showErrorToast(
            "Could not load PayHere. Check your connection and refresh the page."
          )
        }
      />

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

          <ContactDetailsSection
            phone={effectivePhone}
            phoneError={phoneError}
            onPhoneChange={handlePhoneChange}
            showPhoneInput={showPhoneInput}
          />

          <PaymentMethodSection
            value={paymentMethod}
            onChange={setPaymentMethod}
          />

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground lg:justify-start">
            <Lock className="size-3.5 shrink-0" aria-hidden="true" />
            You won&apos;t be charged until you confirm the payment in PayHere.
          </p>
        </div>

        <OrderSummary
          items={items}
          onPlaceOrder={handlePlaceOrder}
          canPlaceOrder={canPlaceOrder}
          isBuyNow={mode === "buy-now"}
          isProcessing={isProcessing}
          isSdkReady={isSdkReady}
        />
      </div>
    </div>
  );
}
