import { z } from "zod";

export const CategoryDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  sizeGuideUrl: z.string().url().nullable().optional(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type CategoryDto = z.infer<typeof CategoryDtoSchema>;

export const CategoryFormInputSchema = CategoryDtoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  description: z.string().nullable().optional(),
  sizeGuideUrl: z.string()
    .max(500, "Size guide URL must not exceed 500 characters")
    .nullable()
    .optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export type CategoryFormInput = z.infer<typeof CategoryFormInputSchema>;

export const emptyCategoryForm: CategoryFormInput = {
  name: "",
  description: "",
  sizeGuideUrl: "",
  isActive: true,
  sortOrder: 0,
};

export function toCategoryForm(category: CategoryDto): CategoryFormInput {
  return {
    name: category.name,
    description: category.description ?? "",
    sizeGuideUrl: category.sizeGuideUrl ?? "",
    isActive: category.isActive,
    sortOrder: category.sortOrder,
  };
}