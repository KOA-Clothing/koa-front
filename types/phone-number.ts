import { z } from "zod";
import { PhoneNumberTypeSchema } from "./enums";

// Response DTO Schema (from C# PhoneNumberDto)
export const PhoneNumberDtoSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  phoneNo: z.string(),
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
export const CreatePhoneNumberInputSchema = PhoneNumberDtoSchema.pick({
  label: true,
  phoneNo: true,
  countryCode: true,
  type: true,
  isDefault: true,
}).extend({
  label: z.string().min(1, "Label is required"),
  phoneNo: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});

export type CreatePhoneNumberInput = z.infer<typeof CreatePhoneNumberInputSchema>;