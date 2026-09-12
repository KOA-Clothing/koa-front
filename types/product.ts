import { z } from "zod";
import { CategoryDtoSchema } from "./category";
import { AgeGroupEnum, AgeGroupSchema, GenderEnum, GenderSchema, ProductStatusEnum, ProductStatusSchema } from "./enums";

export const ProductDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  category: CategoryDtoSchema,
  sizeGuide: z.string().nullable().optional(),
  costPrice: z.number(),
  sellingPrice: z.number(),
  gender: GenderSchema,
  ageGroup: AgeGroupSchema,
  material: z.string().nullable().optional(),
  careInstructions: z.string().nullable().optional(),
  discountPercentage: z.number(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  status: ProductStatusSchema,
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type ProductDto = z.infer<typeof ProductDtoSchema>;

export const ProductFormInputSchema = ProductDtoSchema.omit({
  id: true,
  category: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string()
    .min(1, "Name is required")
    .max(200, "Name must not exceed 200 characters"),
  description: z.string().nullable().optional(),
  categoryId: z.string().min(1, "Category is required"),
  sizeGuide: z.string().nullable().optional(),
  costPrice: z.number().min(0, "Cost price must not be negative"),
  sellingPrice: z.number().min(0, "Selling price must not be negative"),
  discountPercentage: z.number()
    .min(0, "Discount must not be negative")
    .max(100, "Discount must not exceed 100"),
  gender: GenderSchema,
  ageGroup: AgeGroupSchema,
  material: z.string()
    .max(200, "Material must not exceed 200 characters")
    .nullable()
    .optional(),
  careInstructions: z.string().nullable().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  status: ProductStatusSchema,
  metaTitle: z.string()
    .max(200, "Meta title must not exceed 200 characters")
    .nullable()
    .optional(),
  metaDescription: z.string().nullable().optional(),
});

export type ProductFormInput = z.infer<typeof ProductFormInputSchema>;

export const emptyProductForm: ProductFormInput = {
  name: "",
  description: "",
  categoryId: "",
  sizeGuide: "",
  costPrice: 0,
  sellingPrice: 0,
  discountPercentage: 0,
  gender: GenderEnum.Male,
  ageGroup: AgeGroupEnum.Adult,
  material: "",
  careInstructions: "",
  isFeatured: false,
  isActive: false,
  status: ProductStatusEnum.Draft,
  metaTitle: "",
  metaDescription: "",
};

export function toProductForm(product: ProductDto): ProductFormInput {
  return {
    name: product.name,
    description: product.description ?? "",
    categoryId: product.category.id,
    sizeGuide: product.sizeGuide ?? "",
    costPrice: product.costPrice,
    sellingPrice: product.sellingPrice,
    discountPercentage: product.discountPercentage,
    gender: product.gender,
    ageGroup: product.ageGroup,
    material: product.material ?? "",
    careInstructions: product.careInstructions ?? "",
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    status: product.status,
    metaTitle: product.metaTitle ?? "",
    metaDescription: product.metaDescription ?? "",
  };
}