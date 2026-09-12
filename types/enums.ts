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

export enum SsoProviderEnum {
  GOOGLE = 1,
  APPLE = 2,
  MICROSOFT = 3,
  LINKEDIN = 4,
  GITHUB = 5,
  FACEBOOK = 6,
}
export const SsoProviderSchema = z.enum(SsoProviderEnum);
export type SsoProvider = z.infer<typeof SsoProviderSchema>

export enum GenderEnum {
  Male = 1,
  Female = 2,
  Unisex = 3
}
export const GenderSchema = z.enum(GenderEnum);
export type Gender = z.infer<typeof GenderSchema>;

export enum AgeGroupEnum {
  Infant = 1,
  Toddler = 2,
  Kids = 3,
  Teen = 4,
  Adult = 5,
}
export const AgeGroupSchema = z.enum(AgeGroupEnum);
export type AgeGroup = z.infer<typeof AgeGroupSchema>;

export enum ProductStatusEnum {
  Draft = 1,
  Discontinued = 2,
  OutOfStock = 3,
  Available = 4,
}
export const ProductStatusSchema = z.enum(ProductStatusEnum);
export type ProductStatus = z.infer<typeof ProductStatusSchema>;

export const genderLabels: Record<GenderEnum, string> = {
  [GenderEnum.Male]: "Male",
  [GenderEnum.Female]: "Female",
  [GenderEnum.Unisex]: "Unisex",
};

export const ageGroupLabels: Record<AgeGroupEnum, string> = {
  [AgeGroupEnum.Infant]: "Infant",
  [AgeGroupEnum.Toddler]: "Toddler",
  [AgeGroupEnum.Kids]: "Kids",
  [AgeGroupEnum.Teen]: "Teen",
  [AgeGroupEnum.Adult]: "Adult",
};

export const productStatusLabels: Record<ProductStatusEnum, string> = {
  [ProductStatusEnum.Draft]: "Draft",
  [ProductStatusEnum.Discontinued]: "Discontinued",
  [ProductStatusEnum.OutOfStock]: "Out of Stock",
  [ProductStatusEnum.Available]: "Available",
};