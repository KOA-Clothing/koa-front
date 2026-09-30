import { z } from "zod";
import { ColorDtoSchema } from "./color";

export const ProductImageDtoSchema = z.object({
  id: z.string(),
  productId: z.string(),
  // `ColorDto? Color` on the backend: an image doesn't have to belong to a
  // colorway, so `null` is meaningful data here — not a field that went missing.
  // Consumers must therefore handle an untagged image rather than assume a
  // color is always present.
  color: ColorDtoSchema.nullable(),
  imageUrl: z.string(),
  altText: z.string().nullable().optional(),
  isPrimary: z.boolean(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type ProductImageDto = z.infer<typeof ProductImageDtoSchema>;

/**
 * `ProductImagesCollectionDto` — the payload behind
 * `/admin/product-configs/images/{productId}`.
 *
 * A *product* with its images nested, not an image. `id` is therefore the
 * product's own id, which is what "View Base Product" navigates with.
 */
export const ProductImagesCollectionDtoSchema = z.object({
  id: z.string(), // Product Id
  name: z.string(), // Product Name
  images: z.array(ProductImageDtoSchema),
});

export type ProductImagesCollectionDto = z.infer<
  typeof ProductImagesCollectionDtoSchema
>;

/**
 * `ProductImageTableDetailsDto` — one row of the product-images table.
 *
 * Deliberately *not* the aggregate: the table draws a name, two counts and a
 * swatch strip, so shipping every image (each with a nested `ColorDto`) would
 * scale the payload with image count rather than row count. Counts come from the
 * server, so the row and the gallery can never disagree after an invalidation.
 */
export const ProductImageTableDetailsDtoSchema = z.object({
  id: z.string(), // Product Id
  name: z.string(), // Product Name
  totalImages: z.number(),
  totalVariants: z.number(),
  availableColors: z.array(ColorDtoSchema),
});

export type ProductImageTableDetailsDto = z.infer<
  typeof ProductImageTableDetailsDtoSchema
>;

/**
 * Payload for `POST /api/v1/product-images` — mirrors
 * `CreateProductImageCommand(Guid ProductId, Guid? ColorId, string ImageUrl, string? AltText)`.
 *
 * `colorId` is optional on purpose: an image doesn't have to belong to a
 * specific colorway (a pack shot, or a flat that reads the same in every color).
 * The form holds `""` for "nothing picked" and converts it to `null` on submit,
 * because ASP.NET Core cannot bind an empty string to a `Guid?`.
 */
export const CreateProductImageInputSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  colorId: z.string().nullable().optional(),
  imageUrl: z.string().min(1, "Image is required").url("Image URL must be a valid URL"),
  altText: z
    .string()
    .trim()
    .max(500, "Alt text must not exceed 500 characters")
    .nullable()
    .optional(),
});

export type CreateProductImageInput = z.infer<typeof CreateProductImageInputSchema>;

/** The form's own state — what the modal holds before a file has been uploaded. */
export const productImageFormSchema = z.object({
  colorId: z.string(),
  altText: z.string(),
});

export type ProductImageFormInput = z.infer<typeof productImageFormSchema>;

export const emptyProductImageForm: ProductImageFormInput = {
  colorId: "",
  altText: "",
};
