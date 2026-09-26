// config/page-routes.ts

import type { FilterValue } from "@/types/filters/table-filters";

/** Internal app routes that other routes link into, mirroring `api-routes.ts`. */
export const PAGE_ROUTES = {
  ADMIN: {
    BASE_PRODUCTS: "/admin/product-configs/base-products",
    PRODUCT_VARIANTS: "/admin/product-configs/variants",
  },
} as const;

/**
 * Builds `?a=1&b=2`, skipping unset values so a deep link never carries
 * `?productId=`. Defaults are omitted for the same reason the table's URL
 * schema omits them: a minimal querystring is the canonical form.
 */
function withQuery(path: string, params: Record<string, FilterValue | undefined>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

/**
 * Deep-link builders for the admin list pages.
 *
 * This is the counterpart to a route's `useServerTableParams({ filters })`
 * schema: the keys used here are the same keys declared there, which is what
 * makes "link to one row of a filtered table" a reusable, typo-proof operation
 * instead of a hand-built querystring at every call site.
 */
export const adminListHrefs = {
  baseProducts: (params: { productId?: string } = {}) =>
    withQuery(PAGE_ROUTES.ADMIN.BASE_PRODUCTS, params),
  productVariants: (params: { productId?: string } = {}) =>
    withQuery(PAGE_ROUTES.ADMIN.PRODUCT_VARIANTS, params),
};
