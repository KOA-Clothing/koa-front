import { z } from "zod";
import { AddressDtoSchema } from "./address";
import { PhoneNumberDtoSchema } from "./phone-number";

// User Profile DTO Schema
export const UserProfileDtoSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  profileImageUrl: z.url(),
  addresses: z.array(AddressDtoSchema),
  phoneNumbers: z.array(PhoneNumberDtoSchema),
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
  email: true,
}).extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;