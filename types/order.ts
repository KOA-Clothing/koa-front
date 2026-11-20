import { z } from "zod";
import { OrderStatusSchema, PaymentStatusSchema } from "./enums";

/**
 * `Domain.Models.OrderDto` as the API serializes it. Enums arrive as numbers
 * (see `OrderStatusEnum` / `PaymentStatusEnum`) and the order's delivery
 * address is the subset of `AddressDto` the backend actually populates.
 */
export const OrderDeliveryAddressSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  houseNo: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().nullable().optional(),
  city: z.string(),
  province: z.string(),
  zipcode: z.string(),
  country: z.string(),
});

export type OrderDeliveryAddress = z.infer<typeof OrderDeliveryAddressSchema>;

export const OrderItemDtoSchema = z.object({
  id: z.uuid(),
  inventoryId: z.uuid(),
  quantity: z.number().int(),
  unitPrice: z.number(),
  discountAmount: z.number(),
  totalPrice: z.number(),
  createdAt: z.iso.datetime({ offset: true }),
});

export type OrderItemDto = z.infer<typeof OrderItemDtoSchema>;

export const OrderDtoSchema = z.object({
  id: z.uuid(),
  orderNumber: z.string(),
  userId: z.uuid(),
  deliveryAddress: OrderDeliveryAddressSchema,
  status: OrderStatusSchema,
  paymentStatus: PaymentStatusSchema,
  subtotal: z.number(),
  discountAmount: z.number(),
  shippingFee: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  orderItems: z.array(OrderItemDtoSchema),
  notes: z.string().nullable().optional(),
  cancelReason: z.string().nullable().optional(),
  createdAt: z.iso.datetime({ offset: true }),
});

export type OrderDto = z.infer<typeof OrderDtoSchema>;

/** `Application.Payments.Queries.GetCheckoutHash.GetCheckoutHashResponse`. */
export const CheckoutHashResponseSchema = z.object({
  merchantId: z.string(),
  hash: z.string(),
  amount: z.number(),
  orderId: z.string(),
});

export type CheckoutHashResponse = z.infer<typeof CheckoutHashResponseSchema>;
