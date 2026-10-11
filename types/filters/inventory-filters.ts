import { clothingSizeLabels } from "../enum-labels";
import { ClothingSizeSchema, type ClothingSize } from "../enums";
import {
  enumParser,
  guidParser,
  toOptions,
  type FilterSpecs,
} from "./table-filters";

/**
 * Filters the inventory table supports.
 *
 * Keys are the API query param names, which keeps them easy to follow against
 * the backend contract. The display text lives in each spec's `label` instead.
 *
 * ## Semantics — read before implementing the backend
 *
 * This differs from the product-variants table. There, a row is a *product*
 * with its variants nested and `colorId`/`size` are semi-joins. Here a row IS a
 * single variant (`InventoryDto.variant`), so every filter is a plain equality
 * check on that row:
 *
 * - `productId` keeps every row of one product (a set of rows).
 * - `variantId` keeps exactly the row for one variant (`variant.id`).
 * - `colorId` keeps rows whose `variant.color.id` equals it.
 * - `size` keeps rows whose `variant.size` equals it.
 *
 * All four are ANDed, so `?productId=…&colorId=…` narrows to one product's rows
 * in that color. The backend must implement the same reading.
 */
export interface InventoryFilters {
  /** Deep-link / exploration: every inventory row of one product. */
  productId?: string;
  /** Deep-link: exactly one inventory row, for one variant. */
  variantId?: string;
  /** Keeps rows whose variant is this color. */
  colorId?: string;
  /** Keeps rows whose variant is this size. */
  size?: ClothingSize;
}

/**
 * Runtime metadata for `InventoryFilters`. Keep this at module level — a stable
 * reference — so the derived URL schema doesn't rebuild on every render.
 */
export const inventoryFilterSpecs = {
  productId: {
    label: "Product",
    parse: guidParser,
    format: (productId: string) => productId,
  },
  variantId: {
    label: "Variant",
    parse: guidParser,
    format: (variantId: string) => variantId,
  },
  colorId: {
    label: "Color",
    parse: guidParser,
    format: (colorId: string) => colorId,
    // Intentionally no `options`. The color list is runtime data from
    // `/colors/all-active`, and a spec is a plain data object that cannot call
    // a hook. The route supplies these options — see
    // components/admin/inventory/filters/inventory-filter-controls.tsx.
  },
  size: {
    label: "Size",
    parse: enumParser(ClothingSizeSchema),
    format: (size: ClothingSize) => clothingSizeLabels[size],
    options: toOptions(clothingSizeLabels),
  },
} as const satisfies FilterSpecs<InventoryFilters>;
