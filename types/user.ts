import { z } from "zod";
import { AddressDtoSchema } from "./address";
import { PhoneNumberDtoSchema } from "./phone-number";
import { SsoProviderSchema } from "./enums";

export const UserExternalAccountDtoSchema = z.object({
  provider: SsoProviderSchema, // Consider using z.enum(["Google", "Github", etc]) if you have strict types
  providerUserId: z.string(),
  emailAddress: z.email().nullable().optional(),
});
export type UserExternalAccountDto = z.infer<typeof UserExternalAccountDtoSchema>;

// User Profile DTO Schema
export const UserProfileDtoSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  passwordEnabled: z.boolean(),
  profileImageUrl: z.url().or(z.string().length(0)).nullable().optional(),
  addresses: z.array(AddressDtoSchema),
  phoneNumbers: z.array(PhoneNumberDtoSchema),
  externalAccounts: z.array(UserExternalAccountDtoSchema),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

export type UserProfileDto = z.infer<typeof UserProfileDtoSchema>;

export const BasicProfileDtoSchema = UserProfileDtoSchema.omit({
  addresses: true,
  phoneNumbers: true,
});

export type BasicProfileDto = z.infer<typeof BasicProfileDtoSchema>;

export const UpdateProfileInputSchema = BasicProfileDtoSchema.pick({
  firstName: true,
  lastName: true,
}).extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;