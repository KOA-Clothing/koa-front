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