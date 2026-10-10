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
