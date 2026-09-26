import {
  BOOLEAN_OPTIONS,
  booleanParser,
  formatBoolean,
  guidParser,
  type FilterSpecs,
} from "./table-filters";

/**
 * Filters the colors table supports.
 *
 * Keys are the `ColorDto` field names and double as the API query param
 * names, which keeps them easy to follow against the backend contract. The
 * display text lives in each spec's `label` instead.
 */
export interface ColorFilters {
  /**
   * Deep-link only. Arrives from another route's `?colorId=` link and is
   * cleared from the UI, never picked from a control.
   */
  colorId?: string;
  /** Tri-state: unset shows both active and inactive colors. */
  isActive?: boolean;
}

/**
 * Runtime metadata for `ColorFilters`. Keep this at module level — a stable
 * reference — so the derived URL schema doesn't rebuild on every render.
 */
export const colorFilterSpecs = {
  colorId: {
    label: "Color",
    parse: guidParser,
    format: (colorId: string) => colorId,
  },
  isActive: {
    label: "Is Active",
    parse: booleanParser,
    format: formatBoolean,
    options: BOOLEAN_OPTIONS,
  },
} as const satisfies FilterSpecs<ColorFilters>;
