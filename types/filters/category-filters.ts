import {
  BOOLEAN_OPTIONS,
  booleanParser,
  formatBoolean,
  guidParser,
  type FilterSpecs,
} from "./table-filters";

/**
 * Filters the categories table supports.
 *
 * Keys are the `CategoryDto` field names and double as the API query param
 * names, which keeps them easy to follow against the backend contract. The
 * display text lives in each spec's `label` instead.
 */
export interface CategoryFilters {
  /**
   * Deep-link only. Arrives from another route's `?categoryId=` link and is
   * cleared from the UI, never picked from a control.
   */
  categoryId?: string;
  /** Tri-state: unset shows both active and inactive categories. */
  isActive?: boolean;
}

/**
 * Runtime metadata for `CategoryFilters`. Keep this at module level — a stable
 * reference — so the derived URL schema doesn't rebuild on every render.
 */
export const categoryFilterSpecs = {
  categoryId: {
    label: "Category",
    parse: guidParser,
    format: (categoryId: string) => categoryId,
  },
  isActive: {
    label: "Is Active",
    parse: booleanParser,
    format: formatBoolean,
    options: BOOLEAN_OPTIONS,
  },
} as const satisfies FilterSpecs<CategoryFilters>;
