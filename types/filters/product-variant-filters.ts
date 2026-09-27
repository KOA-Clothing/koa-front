import { clothingSizeLabels } from "../enum-labels";
import { ClothingSizeSchema, type ClothingSize } from "../enums";
import { enumParser, guidParser, toOptions, type FilterSpecs } from "./table-filters";

/**
 * Filters the product-variants table supports.
 *
 * Keys are the API query param names, which keeps them easy to follow against
 * the backend contract. The display text lives in each spec's `label` instead.
 *
 * ## Semantics — read before implementing the backend
 *
 * A row here is a **product** with its variants nested (`variants[]`), not a
 * variant. So `colorId` and `size` are semi-joins and the front end treats
 * them as **independent existence checks**, ANDed together:
 *
 *   keep a product when it has >= 1 variant in `colorId`
 *                  AND it has >= 1 variant in `size`
 *
 * Deliberately *not* "some single variant matches both". Under the stricter
 * reading, a product stocked as Navy/M and Black/L would disappear when
 * filtering Navy + L — surprising on a product-grouped table, where the admin is
 * narrowing which products appear, not which SKUs.
 *
 * The backend must implement the same reading, or the UI and the API disagree
 * about what a combined filter means.
 */
export interface ProductVariantFilters {
  /**
   * Deep-link only. Arrives from another route's `?productId=` link and is
   * cleared from the UI, never picked from a control. Scoping to one product
   * means the table shows exactly that one row.
   */
  productId?: string;
  /** Keeps products having at least one variant in this color. */
  colorId?: string;
  /** Keeps products having at least one variant in this size. */
  size?: ClothingSize;
}

/**
 * Runtime metadata for `ProductVariantFilters`. Keep this at module level — a
 * stable reference — so the derived URL schema doesn't rebuild on every render.
 */
export const productVariantFilterSpecs = {
  productId: {
    label: "Product",
    parse: guidParser,
    format: (productId: string) => productId,
  },
  colorId: {
    label: "Color",
    parse: guidParser,
    format: (colorId: string) => colorId,
    // Intentionally no `options`. Unlike `size` (a static enum) the color list
    // is runtime data from `/colors/all-active`, and a spec is a plain data
    // object that cannot call a hook. The route supplies these options — see
    // components/admin/product-variant/filters/product-variant-filter-controls.tsx.
  },
  size: {
    label: "Size",
    parse: enumParser(ClothingSizeSchema),
    format: (size: ClothingSize) => clothingSizeLabels[size],
    options: toOptions(clothingSizeLabels),
  },
} as const satisfies FilterSpecs<ProductVariantFilters>;
