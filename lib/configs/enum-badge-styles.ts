import {
  AgeGroupEnum,
  ClothingSizeEnum,
  GenderEnum,
  ProductStatusEnum,
} from "@/types/enums";

export const genderBadgeStyles: Record<GenderEnum, string> = {
  [GenderEnum.Male]: "bg-sky-600/10 text-sky-600 border-sky-600/20",
  [GenderEnum.Female]: "bg-pink-600/10 text-pink-600 border-pink-600/20",
  [GenderEnum.Unisex]: "bg-slate-600/10 text-slate-600 border-slate-600/20",
};

export const ageGroupBadgeStyles: Record<AgeGroupEnum, string> = {
  [AgeGroupEnum.Infant]: "bg-rose-600/10 text-rose-600 border-rose-600/20",
  [AgeGroupEnum.Toddler]:
    "bg-orange-600/10 text-orange-600 border-orange-600/20",
  [AgeGroupEnum.Kids]: "bg-amber-600/10 text-amber-600 border-amber-600/20",
  [AgeGroupEnum.Teen]: "bg-cyan-600/10 text-cyan-600 border-cyan-600/20",
  [AgeGroupEnum.Adult]: "bg-indigo-600/10 text-indigo-600 border-indigo-600/20",
};

export const productStatusBadgeStyles: Record<ProductStatusEnum, string> = {
  [ProductStatusEnum.Draft]: "bg-muted text-muted-foreground border-border",
  [ProductStatusEnum.Discontinued]:
    "bg-destructive/10 text-destructive border-destructive/20",
  [ProductStatusEnum.OutOfStock]:
    "bg-amber-600/10 text-amber-600 border-amber-600/20",
  [ProductStatusEnum.Available]:
    "bg-emerald-600/10 text-emerald-600 border-emerald-600/20",
};

export const clothingSizeBadgeStyles: Record<ClothingSizeEnum, string> = {
  [ClothingSizeEnum.XS]: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  [ClothingSizeEnum.S]: "bg-sky-600/10 text-sky-600 border-sky-600/20",
  [ClothingSizeEnum.M]: "bg-emerald-600/10 text-emerald-600 border-emerald-600/20",
  [ClothingSizeEnum.L]: "bg-amber-600/10 text-amber-600 border-amber-600/20",
  [ClothingSizeEnum.XL]: "bg-orange-600/10 text-orange-600 border-orange-600/20",
  [ClothingSizeEnum.XXL]: "bg-rose-600/10 text-rose-600 border-rose-600/20",
  [ClothingSizeEnum.XXXL]: "bg-violet-600/10 text-violet-600 border-violet-600/20",
  [ClothingSizeEnum.OS]: "bg-indigo-600/10 text-indigo-600 border-indigo-600/20",
};