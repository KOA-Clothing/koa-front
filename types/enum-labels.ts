import {
  AgeGroupEnum,
  ClothingSizeEnum,
  GenderEnum,
  ProductStatusEnum,
} from "./enums";

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

export const clothingSizeLabels: Record<ClothingSizeEnum, string> = {
  [ClothingSizeEnum.XS]: "XS",
  [ClothingSizeEnum.S]: "S",
  [ClothingSizeEnum.M]: "M",
  [ClothingSizeEnum.L]: "L",
  [ClothingSizeEnum.XL]: "XL",
  [ClothingSizeEnum.XXL]: "XXL",
  [ClothingSizeEnum.XXXL]: "XXXL",
  [ClothingSizeEnum.OS]: "OS",
};