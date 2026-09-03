import { z } from "zod";
import { PhoneNumberTypeSchema } from "./enums";

// Response DTO Schema (from C# PhoneNumberDto)
export const PhoneNumberDtoSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  phoneNumber: z.string(),
  countryCode: z.string().nullable().optional(),
  type: PhoneNumberTypeSchema,
  isDefault: z.boolean(),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

export type PhoneNumberDto = z.infer<typeof PhoneNumberDtoSchema>;

// Form Input Schema
export const PhoneNumberFormInputSchema = PhoneNumberDtoSchema.omit({
  id: true,
  countryCode: true,
  isDefault: true,
  isActive: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true
}).extend({
  label: z.string()
    .min(1, "Label is required (e.g. Mobile, Home)")
    .max(100, "Label cannot exceed 100 characters"),
  // Assuming property name mapping is handled elsewhere, otherwise rename to phoneNumber
  phoneNumber: z.string()
    .regex(/^[1-9]\d{8}$/, "Phone number must contain exactly 9 digits and should not start with 0"),
  type: PhoneNumberTypeSchema,
});

export type PhoneNumberFormInput = z.infer<typeof PhoneNumberFormInputSchema>;

export const emptyPhoneNumberForm: PhoneNumberFormInput = {
  label: "",
  phoneNumber: "",
  type: 1,
};

export function toPhoneNumberForm(phone: PhoneNumberDto): PhoneNumberFormInput {
  return {
    label: phone.label,
    phoneNumber: phone.phoneNumber,
    type: phone.type as number,
  };
}