import { z } from "zod";
import { AddressTypeSchema } from "./enums";

export const AddressDtoSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  houseNo: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().nullable().optional(),
  city: z.string(),
  province: z.string(),
  zipcode: z.string(),
  country: z.string(),
  type: AddressTypeSchema,
  isDefault: z.boolean(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

export type AddressDto = z.infer<typeof AddressDtoSchema>;

export const CreateAddressInputSchema = AddressDtoSchema.omit({
  id: true,
  country: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  label: z.string().min(1, "Label is required (e.g. Home, Office)"),
  houseNo: z.string().min(1, "House number is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "State/Province is required"),
  zipcode: z.string().min(1, "Zip/Postal code is required"),
  type: AddressTypeSchema
});

export type CreateAddressInput = z.infer<typeof CreateAddressInputSchema>;

export const UpdateAddressInputSchema = AddressDtoSchema.omit({
  id: true,
  country: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  label: z.string().min(1, "Label is required (e.g. Home, Office)"),
  houseNo: z.string().min(1, "House number is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "State/Province is required"),
  zipcode: z.string().min(1, "Zip/Postal code is required"),
  type: AddressTypeSchema
});

export type UpdateAddressInput = z.infer<typeof UpdateAddressInputSchema>;

export function toUpdateInput(address: AddressDto): UpdateAddressInput {
  return {
    label: address.label,
    houseNo: address.houseNo,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 ?? "",
    city: address.city,
    province: address.province,
    zipcode: address.zipcode,
    type: address.type as number,
  };
}