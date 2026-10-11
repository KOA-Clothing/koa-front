import { z } from "zod";
import { ProductVariantDtoSchema } from "./product-variant";

/**
 * `InventoryDto` — one row of the inventory table
 * (`GET /api/v1/inventory`).
 *
 * Stock is tracked per product *variant* (a color + size pairing), so the row
 * carries the full `variant` (with its nested `ColorDto`) rather than a flat
 * color/size pair. `productId`/`productName` are denormalized on the backend so
 * the table doesn't need a second request to label the row.
 *
 * `lowStockThreshold` is `int?` on the backend: `null` means the threshold has
 * not been configured, which is different from a threshold of `0`, so the
 * schema keeps it nullable and consumers must render the "not set" case
 * explicitly.
 */
export const InventoryDtoSchema = z.object({
  id: z.string(), // Inventory id
  productId: z.string(),
  productName: z.string(),
  variant: ProductVariantDtoSchema,
  quantity: z.number(),
  reservedQuantity: z.number(), // Held for orders / other purposes
  lowStockThreshold: z.number().nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type InventoryDto = z.infer<typeof InventoryDtoSchema>;

/**
 * Payload for `PATCH /api/v1/inventory/{inventoryId}/add`, which increases a
 * variant's stock by `quantity`. The endpoint *adds* to the current level
 * rather than setting it, so the value must be a positive whole number — a
 * negative or fractional value is a client error, caught here before the round
 * trip. Field/params default to `null` when empty, so `coerce` maps `""`/`null`
 * onto `0` and lets the `.positive()` rule produce the message.
 */
export const AddInventoryInputSchema = z.object({
  quantity: z.coerce
    .number({ error: "Enter a quantity to add" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
});

export type AddInventoryInput = z.infer<typeof AddInventoryInputSchema>;

/** Response of the add-stock endpoint, carrying the new stock level. */
export const AddInventoryResponseSchema = z.object({
  inventoryId: z.string(),
  variantId: z.string(),
  quantity: z.number(),
  updatedAt: z.string().datetime({ offset: true }),
});

export type AddInventoryResponse = z.infer<typeof AddInventoryResponseSchema>;

/**
 * Orders inventory rows the way the table presents them: by product name,
 * then by the variant's color name, then by size.
 *
 * `variant.size` is the `ClothingSizeEnum` numeric value (XS = 1 … OS = 8), so
 * plain numeric comparison already yields the natural size order — no need to
 * map through `clothingSizeLabels`.
 *
 * Returns a new array; the caller's page data is never mutated.
 */
export function sortInventoryRows(rows: InventoryDto[]): InventoryDto[] {
  return [...rows].sort((a, b) => {
    const byProduct = a.productName.localeCompare(b.productName);
    if (byProduct !== 0) return byProduct;

    const byColor = a.variant.color.name.localeCompare(b.variant.color.name);
    if (byColor !== 0) return byColor;

    return a.variant.size - b.variant.size;
  });
}
