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
 *
 * Deliberately carries no color list. Each image already names its own
 * `color`, and the colors a product is *stocked in* are variant data — a
 * different concern from its images. The "Add image" modal needs that list, but
 * it asks for it directly via `useProductVariantColors(productId)`, keyed off
 * `/products/{id}/variants/related-colors`.
 *
 * That is also the only correct source: `images[].color` is a **subset** of the
 * product's variant colors. A product with a Navy variant and no Navy shot yet
 * would offer no Navy at all, which is precisely the shot an admin needs to
 * upload.
 */
export const ProductImagesCollectionDtoSchema = z.object({
  id: z.string(), // Product Id
  name: z.string(), // Product Name
  images: z.array(ProductImageDtoSchema),
});

export type ProductImagesCollectionDto = z.infer<typeof ProductImagesCollectionDtoSchema>;

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

export type ProductImageTableDetailsDto = z.infer<typeof ProductImageTableDetailsDtoSchema>;

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

/**
 * Payload for `PATCH /api/v1/product-images/{productId}/change-primary` —
 * mirrors `ChangePrimaryImageCommand(Guid ProductId, Guid NewPrimaryImageId)`.
 *
 * `productId` goes in the **body** as well as the route. The command declares it
 * as a non-nullable `Guid`, and the controller is meant to overwrite it from the
 * route value (`command with { ProductId = productId }`), so sending both is
 * correct whichever way that lands. Omitting the body field wouldn't fail loudly
 * either: a non-nullable value type with no matching property binds to
 * `Guid.Empty`, which is a silent wrong-target bug rather than a 400.
 */
export interface ChangePrimaryImageInput {
  productId: string;
  newPrimaryImageId: string;
}

/**
 * Payload for `DELETE /api/v1/product-images/{productId}/images/{imageId}` —
 * mirrors `DeleteProductImageCommand(Guid ProductId, Guid ProductImageId)`.
 *
 * The server refuses to delete a product's **last** image, and promotes another
 * image when the deleted one was primary. The card disables delete in that
 * one-image case so the admin doesn't reach a rejection, but the API stays the
 * authority — this input carries nothing about either rule.
 *
 * Note the second field is `productImageId`, not `imageId`: the command names
 * the *image's* id with the `Product` prefix, while the route segment and
 * `ProductImageDto.id` both call it a plain `imageId`. They are the same value.
 *
 * Both fields go in the **body** as well as the route, for the same reason as
 * `ChangePrimaryImageInput`: the controller is meant to overwrite them from the
 * route via a `with` expression but currently sends the unbound `command`
 * instead. A DELETE's complex parameter binds from the body, so omitting it
 * fails model binding outright rather than defaulting — this endpoint needs the
 * body until that line is fixed.
 */
export interface DeleteProductImageInput {
  productId: string;
  productImageId: string;
}

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
