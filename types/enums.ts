import { z } from "zod";

export const AddressTypeSchema = z.enum(["Shipping", "Billing", "Both"]);
export type AddressType = z.infer<typeof AddressTypeSchema>;

export const PhoneNumberTypeSchema = z.enum(["Mobile", "Home", "Work", "Other"]);
export type PhoneNumberType = z.infer<typeof PhoneNumberTypeSchema>;