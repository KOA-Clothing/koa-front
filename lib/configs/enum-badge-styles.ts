import {
  AgeGroupEnum,
  ClothingSizeEnum,
  GenderEnum,
  ProductStatusEnum,
} from "@/types/enums";

const neutralTaxonomyBadge = "border-border bg-muted text-muted-foreground";

export const genderBadgeStyles: Record<GenderEnum, string> = {
  [GenderEnum.Male]: neutralTaxonomyBadge,
  [GenderEnum.Female]: neutralTaxonomyBadge,
  [GenderEnum.Unisex]: neutralTaxonomyBadge,
};

export const ageGroupBadgeStyles: Record<AgeGroupEnum, string> = {
  [AgeGroupEnum.Infant]: neutralTaxonomyBadge,
  [AgeGroupEnum.Toddler]: neutralTaxonomyBadge,
  [AgeGroupEnum.Kids]: neutralTaxonomyBadge,
  [AgeGroupEnum.Teen]: neutralTaxonomyBadge,
  [AgeGroupEnum.Adult]: neutralTaxonomyBadge,
};

export const productStatusBadgeStyles: Record<ProductStatusEnum, string> = {
  [ProductStatusEnum.Draft]: neutralTaxonomyBadge,
  [ProductStatusEnum.Discontinued]:
    "border-destructive/20 bg-destructive/10 text-destructive",
  [ProductStatusEnum.OutOfStock]:
    "border-warning/20 bg-warning/10 text-warning",
  [ProductStatusEnum.Available]:
    "border-success/20 bg-success/10 text-success",
};

export const clothingSizeBadgeStyles: Record<ClothingSizeEnum, string> = {
  [ClothingSizeEnum.XS]: neutralTaxonomyBadge,
  [ClothingSizeEnum.S]: neutralTaxonomyBadge,
  [ClothingSizeEnum.M]: neutralTaxonomyBadge,
  [ClothingSizeEnum.L]: neutralTaxonomyBadge,
  [ClothingSizeEnum.XL]: neutralTaxonomyBadge,
  [ClothingSizeEnum.XXL]: neutralTaxonomyBadge,
  [ClothingSizeEnum.XXXL]: neutralTaxonomyBadge,
  [ClothingSizeEnum.OS]: neutralTaxonomyBadge,
};
