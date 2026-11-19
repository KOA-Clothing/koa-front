"use client";

import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AddressDto } from "@/types/address";
import type { CheckoutAddressForm } from "@/types/checkout";
import AddressOptionCard from "./address-option-card";
import CheckoutSection from "./checkout-section";
import NewAddressForm from "./new-address-form";
import RadioIndicator from "./radio-indicator";

type AddressFieldErrors = Partial<Record<keyof CheckoutAddressForm, string>>;

interface DeliveryAddressSectionProps {
  addresses: AddressDto[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
  selectedAddressId: string | null;
  showNewAddressForm: boolean;
  onSelectAddress: (id: string) => void;
  onSelectNewAddress: () => void;
  onCancelNewAddress: () => void;
  newAddress: CheckoutAddressForm;
  newAddressErrors: AddressFieldErrors;
  onNewAddressChange: <K extends keyof CheckoutAddressForm>(
    field: K,
    value: CheckoutAddressForm[K]
  ) => void;
  canCancelNewAddress: boolean;
}

/**
 * Saved-address picker plus the inline new-address escape hatch. Exactly one
 * choice is active: either a saved address id, or the "new address" option
 * (which reveals the form).
 */
export default function DeliveryAddressSection({
  addresses,
  isLoading,
  isError,
  isFetching,
  onRetry,
  selectedAddressId,
  showNewAddressForm,
  onSelectAddress,
  onSelectNewAddress,
  onCancelNewAddress,
  newAddress,
  newAddressErrors,
  onNewAddressChange,
  canCancelNewAddress,
}: DeliveryAddressSectionProps) {
  return (
    <CheckoutSection
      step={1}
      title="Delivery address"
      description="Where should we send your order?"
    >
      <fieldset className="flex flex-col gap-4">
        <legend className="sr-only">Delivery address</legend>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        ) : (
          <>
            {isError && (
              <div
                role="alert"
                className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                  Couldn&apos;t load your saved addresses.
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  disabled={isFetching}
                >
                  {isFetching ? "Retrying..." : "Try again"}
                </Button>
              </div>
            )}

            {addresses.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((address) => (
                  <AddressOptionCard
                    key={address.id}
                    address={address}
                    selected={
                      !showNewAddressForm && selectedAddressId === address.id
                    }
                    onSelect={() => onSelectAddress(address.id)}
                  />
                ))}
              </div>
            )}

            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                "has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                showNewAddressForm
                  ? "border-foreground bg-muted/40"
                  : "border-dashed border-border bg-card hover:border-foreground/30 hover:bg-muted/20"
              )}
            >
              <input
                type="radio"
                name="delivery-address"
                value="new"
                checked={showNewAddressForm}
                onChange={onSelectNewAddress}
                className="sr-only"
              />
              <RadioIndicator checked={showNewAddressForm} />
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Plus
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    Add a new address
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Deliver this order somewhere else.
                  </span>
                </div>
              </div>
            </label>

            {showNewAddressForm && (
              <NewAddressForm
                value={newAddress}
                errors={newAddressErrors}
                onChange={onNewAddressChange}
              />
            )}

            {showNewAddressForm && canCancelNewAddress && (
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancelNewAddress}
                >
                  Use a saved address instead
                </Button>
              </div>
            )}
          </>
        )}
      </fieldset>
    </CheckoutSection>
  );
}
