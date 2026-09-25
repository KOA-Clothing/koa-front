import { z } from "zod";
import { ColorDtoSchema } from "./color";
import { ClothingSizeSchema } from "./enums";

export const ProductVariantDtoSchema = z.object({
  id: z.string(), // Product variant id
  productId: z.string(),
  color: ColorDtoSchema,
  size: ClothingSizeSchema,
  sku: z.string(),
  isActive: z.boolean(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type ProductVariantDto = z.infer<typeof ProductVariantDtoSchema>;

/**
 * Groups all variants of one product. The backend serializes the variants
 * list under a typo'd field name (`Variatns` → `variatns`), so both
 * spellings are accepted and normalized to `variants` — consumers never
 * see the quirk.
 */
export const ProductVariantsCollectionDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  variants: z.array(ProductVariantDtoSchema), // Make it required, drop the transform
});

export type ProductVariantsCollectionDto = z.infer<typeof ProductVariantsCollectionDtoSchema>;

/** Response of the "does this variant already exist?" check endpoint. */
export const CheckVariationExistsResponseSchema = z.object({
  isExist: z.boolean(),
  variant: ProductVariantDtoSchema.nullable().optional(),
});
export type CheckVariationExistsResponse = z.infer<typeof CheckVariationExistsResponseSchema>;

/** Payload for creating a product variant under an existing product. */
export const CreateProductVariantInputSchema = z.object({
  colorId: z.string().min(1, "Color is required"),
  size: ClothingSizeSchema,
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(100, "SKU must not exceed 100 characters"),
});
export type CreateProductVariantInput = z.infer<typeof CreateProductVariantInputSchema>;