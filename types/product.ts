import { z } from "zod";
import { CategoryDtoSchema } from "./category";
import { DesignDtoSchema } from "./design";
import {
  AgeGroupSchema,
  GenderSchema,
  ProductStatusSchema,
} from "./enums";

export const ProductDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  category: CategoryDtoSchema,
  designs: z.array(DesignDtoSchema),
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

export const ProductUpdateInputSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(200, "Name must not exceed 200 characters"),
  description: z.string().nullable().optional(),
  sizeGuide: z.string().nullable().optional(),
  costPrice: z.number().min(0, "Cost price must not be negative"),
  sellingPrice: z.number().min(0, "Selling price must not be negative"),
  material: z.string()
    .max(200, "Material must not exceed 200 characters")
    .nullable()
    .optional(),
  careInstructions: z.string().nullable().optional(),
  discountPercentage: z.number()
    .min(0, "Discount must not be negative")
    .max(100, "Discount must not exceed 100"),
  metaTitle: z.string()
    .max(200, "Meta title must not exceed 200 characters")
    .nullable()
    .optional(),
  metaDescription: z.string().nullable().optional(),
});

export type ProductUpdateInput = z.infer<typeof ProductUpdateInputSchema>;

export const emptyProductUpdateForm: ProductUpdateInput = {
  name: "",
  description: "",
  sizeGuide: "",
  costPrice: 0,
  sellingPrice: 0,
  material: "",
  careInstructions: "",
  discountPercentage: 0,
  metaTitle: "",
  metaDescription: "",
};

export function toProductUpdateForm(product: ProductDto): ProductUpdateInput {
  return {
    name: product.name,
    description: product.description ?? "",
    sizeGuide: product.sizeGuide ?? "",
    costPrice: product.costPrice,
    sellingPrice: product.sellingPrice,
    material: product.material ?? "",
    careInstructions: product.careInstructions ?? "",
    discountPercentage: product.discountPercentage,
    metaTitle: product.metaTitle ?? "",
    metaDescription: product.metaDescription ?? "",
  };
}

export const ProductFormInputSchema = ProductUpdateInputSchema.extend({
  categoryId: z.string().min(1, "Category is required"),
});

export type ProductFormInput = z.infer<typeof ProductFormInputSchema>;

export const emptyProductForm: ProductFormInput = {
  categoryId: "",
  name: "",
  description: "",
  sizeGuide: "",
  costPrice: 0,
  sellingPrice: 0,
  material: "",
  careInstructions: "",
  discountPercentage: 0,
  metaTitle: "",
  metaDescription: "",
};