import { z } from "zod";
import { ProductDtoSchema } from "./product";

export const CollectionDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type CollectionDto = z.infer<typeof CollectionDtoSchema>;

/**
 * What the create form carries — the shape of `CreateCollectionCommand`
 * (`Name`, `Description`, `ImageUrl`), not of `CollectionDto`: the command's
 * image field is `ImageUrl` while the DTO the response comes back as is
 * `CoverImageUrl`, so this posts as-is and the response is re-parsed as a
 * `CollectionDto` by the list query's invalidation.
 *
 * Length limits mirror `CreateCollectionCommandValidator`.
 */
export const CollectionFormInputSchema = z.object({
  name: z.string()
    .min(1, "Collection name is required")
    .max(100, "Collection name must not exceed 100 characters"),
  description: z.string()
    .max(1000, "Description must not exceed 1000 characters")
    .nullable()
    .optional(),
  imageUrl: z.string()
    .url("Image URL must be a valid URL")
    .nullable()
    .optional(),
});

export type CollectionFormInput = z.infer<typeof CollectionFormInputSchema>;

export const emptyCollectionForm: CollectionFormInput = {
  name: "",
  description: "",
  imageUrl: null,
};

/**
 * Maps a collection DTO onto the form shape, translating the DTO's
 * `coverImageUrl` into the form's `imageUrl` (which is the create command's
 * field name). Used when opening the edit modal on an existing collection.
 */
export function toCollectionForm(collection: CollectionDto): CollectionFormInput {
  return {
    name: collection.name,
    description: collection.description ?? "",
    imageUrl: collection.coverImageUrl ?? null,
  };
}

/**
 * Wire body for `PATCH /api/v1/collections/{collectionId}`
 * (`UpdateCollectionCommand` minus the `CollectionId` the route supplies).
 *
 * The image field is named `CoverImageUrl` here while `Create` takes
 * `ImageUrl` — the two backend commands simply don't agree, so the edit modal
 * maps its shared `imageUrl` form field onto this name at the request boundary
 * rather than carrying a second form shape.
 */
export interface CollectionUpdateInput {
  name: string;
  description?: string | null;
  coverImageUrl?: string | null;
}

/**
 * One product link inside a collection (`product_collections` row with its
 * product eagerly loaded). Mirrors the backend `CollectionItemDto`; `product`
 * reuses `ProductDtoSchema` because the handler maps the full `ProductDto`
 * field-for-field.
 */
export const CollectionItemDtoSchema = z.object({
  id: z.string(),
  collectionId: z.string(),
  productId: z.string(),
  product: ProductDtoSchema,
  createdAt: z.string().datetime({ offset: true }),
});

export type CollectionItemDto = z.infer<typeof CollectionItemDtoSchema>;
