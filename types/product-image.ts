import { z } from "zod";
import { ColorDtoSchema } from "./color";

export const ProductImageDtoSchema = z.object({
  id: z.string(),
  productId: z.string(),
  color: ColorDtoSchema,
  imageUrl: z.string(),
  altText: z.string().nullable().optional(),
  isPrimary: z.boolean(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type ProductImageDto = z.infer<typeof ProductImageDtoSchema>;

/**
 * Groups all images of one product — the row shape the product-images table
 * renders, mirroring `ProductVariantsCollectionDto` on the variants route.
 *
 * A row is a **product** with its images nested (`images[]`), not an image.
 * `id` is therefore the *product's* id: it's what the "View Base Product" action
 * navigates with.
 */
export const ProductImageCollectionDtoSchema = z.object({
  id: z.string(), // Product id
  name: z.string(), // Product name
  images: z.array(ProductImageDtoSchema),
});

export type ProductImageCollectionDto = z.infer<typeof ProductImageCollectionDtoSchema>;
