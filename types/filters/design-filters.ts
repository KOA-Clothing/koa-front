import {
  BOOLEAN_OPTIONS,
  booleanParser,
  formatBoolean,
  guidParser,
  type FilterSpecs,
} from "./table-filters";

/**
 * Filters the designs table supports.
 *
 * Keys are the `DesignDto` field names and double as the API query param
 * names, which keeps them easy to follow against the backend contract. The
 * display text lives in each spec's `label` instead.
 */
export interface DesignFilters {
  /**
   * Deep-link only. Arrives from another route's `?designId=` link and is
   * cleared from the UI, never picked from a control.
   */
  designId?: string;
  /** Tri-state: unset shows both active and inactive designs. */
  isActive?: boolean;
}

/**
 * Runtime metadata for `DesignFilters`. Keep this at module level — a stable
 * reference — so the derived URL schema doesn't rebuild on every render.
 */
export const designFilterSpecs = {
  designId: {
    label: "Design",
    parse: guidParser,
    format: (designId: string) => designId,
  },
  isActive: {
    label: "Is Active",
    parse: booleanParser,
    format: formatBoolean,
    options: BOOLEAN_OPTIONS,
  },
} as const satisfies FilterSpecs<DesignFilters>;
