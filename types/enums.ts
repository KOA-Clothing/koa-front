import { z } from "zod";

export enum AddressTypeEnum {
  Delivery = 1,
  Billing = 2,
  Other = 3,
}
export const AddressTypeSchema = z.enum(AddressTypeEnum);
export type AddressType = z.infer<typeof AddressTypeSchema>;

export enum PhoneNumberTypeEnum { 
  Mobile = 1,
  Home = 2,
  Work = 3,
  Other = 4
}
export const PhoneNumberTypeSchema = z.enum(PhoneNumberTypeEnum);
export type PhoneNumberType = z.infer<typeof PhoneNumberTypeSchema>;