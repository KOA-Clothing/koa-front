import { z } from "zod";
import type { CartItem } from "./cart";

/**
 * Checkout is the only place that turns the client-side cart snapshot into the
 * backend's `PlaceOrderCommand` shape. These types mirror
 * `Application.Orders.Commands.PlaceOrder` so checkout can post it unchanged.
 */

/**
 * How a checkout was seeded. "cart" checks out every line in `useCartStore`;
 * "buy-now" checks out only the single item captured from the product page.
 * Shared by the persisted checkout store and the hook that resolves the items.
 */
export type CheckoutMode = "cart" | "buy-now";

/**
 * A delivery address typed in on the checkout page. This deliberately does not
 * reuse `AddressFormInput`: the account form also carries an address `type`
 * and a hard-coded country, while `DeliveryAddressDto` accepts neither a type
 * nor an id for a brand-new address.
 */
export const CheckoutAddressFormSchema = z.object({
  label: z.string().trim().min(1, "Label is required (e.g. Home, Office)"),
  houseNo: z.string().trim().min(1, "House number is required"),
  addressLine1: z.string().trim().min(1, "Address line 1 is required"),
  addressLine2: z.string().trim(),
  city: z.string().trim().min(1, "City is required"),
  province: z.string().trim().min(1, "State / Province is required"),
  zipcode: z.string().trim().min(1, "Postal code is required"),
  country: z.string().trim().min(1, "Country is required"),
});

export type CheckoutAddressForm = z.infer<typeof CheckoutAddressFormSchema>;

/**
 * PayHere requires a contact phone on the payment object. Clerk profiles often
 * have one, but customers who signed up with email may not — checkout falls
 * back to this schema and asks for it inline.
 */
export const CheckoutPhoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{9,15}$/, "Enter a valid phone number");

export function isValidCheckoutPhone(value: string): boolean {
  return CheckoutPhoneSchema.safeParse(value).success;
}

export const emptyCheckoutAddress: CheckoutAddressForm = {
  label: "",
  houseNo: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  province: "",
  zipcode: "",
  country: "Sri Lanka",
};

/** `Domain.Models.DeliveryAddressDto` — `Id` wins when present. */
export interface DeliveryAddressPayload {
  id?: string;
  label?: string | null;
  houseNo?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  province?: string | null;
  zipcode?: string | null;
  country?: string | null;
}

/** The PayHere customer block: Clerk identity plus the contact phone. */
export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/** The flattened address PayHere receives for both billing and delivery. */
export interface CheckoutPaymentAddress {
  line1: string;
  city: string;
  country: string;
}

/** `PlaceOrderItemRequest`. */
export interface PlaceOrderItemRequest {
  inventoryId: string;
  quantity: number;
}

/** `PlaceOrderCommand` — `Notes` stays unset until the UI exposes it. */
export interface PlaceOrderCommand {
  deliveryAddress: DeliveryAddressPayload;
  items: PlaceOrderItemRequest[];
  notes?: string | null;
}

/**
 * Only card payments are supported today (PayHere sandbox). Keeping the value
 * typed means adding a second method later is a UI change, not a payload
 * change.
 */
export type PaymentMethod = "card";

/** Arguments for opening the PayHere modal for an existing order. */
export interface StartPaymentArgs {
  orderId: string;
  /** Free-text line shown in the PayHere modal, e.g. "KOA Tee x2, KOA Shorts x1". */
  itemsDescription: string;
  customer: CheckoutCustomer;
  address: CheckoutPaymentAddress;
}

/** Arguments for creating a new order and immediately opening PayHere for it. */
export interface PlaceOrderAndPayArgs {
  payload: PlaceOrderCommand;
  itemsDescription: string;
  customer: CheckoutCustomer;
  address: CheckoutPaymentAddress;
}

/** A saved address is sent by id only; the backend resolves the rest. */
export function toSavedDeliveryAddress(addressId: string): DeliveryAddressPayload {
  return { id: addressId };
}

/** A new address is sent field-by-field, with no id, so the backend creates it. */
export function toNewDeliveryAddress(
  form: CheckoutAddressForm
): DeliveryAddressPayload {
  return {
    label: form.label,
    houseNo: form.houseNo,
    addressLine1: form.addressLine1,
    addressLine2: form.addressLine2 || null,
    city: form.city,
    province: form.province,
    zipcode: form.zipcode,
    country: form.country,
  };
}

export function toPlaceOrderItems(
  items: Pick<CartItem, "inventoryId" | "quantity">[]
): PlaceOrderItemRequest[] {
  return items.map(({ inventoryId, quantity }) => ({ inventoryId, quantity }));
}
