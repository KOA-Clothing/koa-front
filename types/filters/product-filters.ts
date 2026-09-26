import { ageGroupLabels, genderLabels, productStatusLabels } from "../enum-labels";
import {
  AgeGroupSchema,
  GenderSchema,
  ProductStatusSchema,
  type AgeGroup,
  type Gender,
  type ProductStatus,
} from "../enums";
import {
  booleanParser,
  enumParser,
  guidParser,
  toOptions,
  type FilterSpecs,
} from "./table-filters";

/**
 * Filters the base-products table supports.
 *
 * Keys are the `ProductDto` field names and double as the API query param
 * names, which keeps them easy to follow against the backend contract. The
 * display text lives in each spec's `label` instead — e.g. `status` is
 * displayed as "Product Status", the same wording as the table column.
 */
export interface ProductFilters {
  /**
   * Deep-link only. Arrives from another route's `?productId=` link and is
   * cleared from the UI, never picked from a control.
   */
  productId?: string;
  gender?: Gender;
  ageGroup?: AgeGroup;
  status?: ProductStatus;
  /** Tri-state: unset shows both active and inactive products. */
  isActive?: boolean;
  /** Tri-state: unset shows both featured and non-featured products. */
  isFeatured?: boolean;
}

const BOOLEAN_OPTIONS = [
  { value: true, label: "True" },
  { value: false, label: "False" },
] as const;

const formatBoolean = (value: boolean) => (value ? "True" : "False");

/**
 * Runtime metadata for `ProductFilters`. Keep this at module level — a stable
 * reference — so the derived URL schema doesn't rebuild on every render.
 */
export const productFilterSpecs = {
  productId: {
    label: "Product",
    parse: guidParser,
    format: (productId: string) => productId,
  },
  gender: {
    label: "Gender",
    parse: enumParser(GenderSchema),
    format: (gender: Gender) => genderLabels[gender],
    options: toOptions(genderLabels),
  },
  ageGroup: {
    label: "Age Group",
    parse: enumParser(AgeGroupSchema),
    format: (ageGroup: AgeGroup) => ageGroupLabels[ageGroup],
    options: toOptions(ageGroupLabels),
  },
  status: {
    label: "Product Status",
    parse: enumParser(ProductStatusSchema),
    format: (status: ProductStatus) => productStatusLabels[status],
    options: toOptions(productStatusLabels),
  },
  isActive: {
    label: "Is Active",
    parse: booleanParser,
    format: formatBoolean,
    options: BOOLEAN_OPTIONS,
  },
  isFeatured: {
    label: "Is Featured",
    parse: booleanParser,
    format: formatBoolean,
    options: BOOLEAN_OPTIONS,
  },
} as const satisfies FilterSpecs<ProductFilters>;
