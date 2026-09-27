"use client";

import KoaFilterSelect, { toSelectOptions } from "@/components/admin/koa-filter-select";
import KoaIdFilterIndicator from "@/components/admin/koa-id-filter-indicator";
import { useActiveColors } from "@/features/color/hooks/use-colors";
import type { ClothingSize } from "@/types/enums";
import {
  productVariantFilterSpecs,
  type ProductVariantFilters,
} from "@/types/filters/product-variant-filters";
import type { SpecsToBag } from "@/types/filters/table-filters";

/**
 * The bag exactly as `useServerTableParams` hands it over — derived from the
 * specs rather than restated, so this component's props and the hook's
 * `setFilter` can't drift apart.
 */
type ProductVariantFilterBag = SpecsToBag<typeof productVariantFilterSpecs>;

type SetProductVariantFilter = <K extends keyof ProductVariantFilterBag>(
  key: K,
  value: ProductVariantFilterBag[K] | undefined
) => void;

interface ProductVariantFilterControlsProps {
  filters: ProductVariantFilters;
  setFilter: SetProductVariantFilter;
  /**
   * Resolved name for the `productId` deep-link filter. When the id matches a
   * row already on screen we get the name for free from the list response,
   * rather than firing a second request for it.
   */
  productIdLabel?: string;
}

/** Select values are strings; the bag holds real enum values. */
const toSelectValue = (value: string | number | boolean | undefined) =>
  value === undefined ? null : String(value);

/**
 * The product-variants route's filter controls — the `children` of
 * <KoaAdminFiltersBar />.
 *
 * This route mixes both filter intents, and unlike the other three it can't
 * take its whole option list from the spec:
 * - `colorId` and `size` are *exploration* filters: they narrow which products
 *   appear, so both get an always-visible select. `colorId`'s options are
 *   runtime data (`useActiveColors`) rather than a static enum, so the spec
 *   deliberately omits them and they are built here instead.
 * - `productId` is a *navigation* filter, set by a deep link from another page,
 *   so it gets no control — only a removable indicator while it's active.
 *
 * Everything here is driven by `productVariantFilterSpecs`, so the controls and
 * the `?`-params sent to the API can't drift apart.
 */
export default function ProductVariantFilterControls({
  filters,
  setFilter,
  productIdLabel,
}: ProductVariantFilterControlsProps) {
  const { data: activeColors } = useActiveColors();

  // Same `{ value, label }` shape the variant create modal uses, so colors read
  // identically wherever they're picked.
  const colorOptions = (activeColors ?? []).map((color) => ({
    value: color.id,
    label: color.name,
  }));

  return (
    <>
      <KoaFilterSelect
        label={productVariantFilterSpecs.colorId.label}
        value={toSelectValue(filters.colorId)}
        options={colorOptions}
        onValueChange={(next) => setFilter("colorId", next ?? undefined)}
      />

      <KoaFilterSelect
        label={productVariantFilterSpecs.size.label}
        value={toSelectValue(filters.size)}
        options={toSelectOptions(productVariantFilterSpecs.size.options)}
        onValueChange={(next) =>
          setFilter("size", next === null ? undefined : (Number(next) as ClothingSize))
        }
      />

      <KoaIdFilterIndicator
        label={productVariantFilterSpecs.productId.label}
        id={filters.productId}
        displayValue={productIdLabel}
        onClear={() => setFilter("productId", undefined)}
      />
    </>
  );
}
