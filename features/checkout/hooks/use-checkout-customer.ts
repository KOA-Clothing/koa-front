"use client";

import { useUser } from "@clerk/nextjs";
import type { CheckoutCustomer } from "@/types/checkout";

interface CheckoutCustomerResult {
  customer: CheckoutCustomer;
  /** The phone already on the Clerk profile, if any. Empty means "ask for one". */
  primaryPhone: string;
  isLoaded: boolean;
}

/**
 * The identity block PayHere requires. Clerk's profile is the source of truth
 * for name/email/phone; checkout only asks for a phone when the profile has
 * none, which is why the raw `primaryPhone` is exposed alongside the resolved
 * customer.
 */
export function useCheckoutCustomer(): CheckoutCustomerResult {
  const { user, isLoaded } = useUser();

  const primaryPhone = user?.primaryPhoneNumber?.phoneNumber ?? "";

  return {
    isLoaded,
    primaryPhone,
    customer: {
      // PayHere rejects blank names, and Clerk allows a profile with only an
      // email, so fall back to a neutral display name.
      firstName: user?.firstName?.trim() || "KOA",
      lastName: user?.lastName?.trim() || "Customer",
      email:
        user?.primaryEmailAddress?.emailAddress ??
        user?.emailAddresses[0]?.emailAddress ??
        "",
      phone: primaryPhone,
    },
  };
}
