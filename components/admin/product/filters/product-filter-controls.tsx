"use client";

import KoaFilterSelect, { toSelectOptions } from "@/components/admin/koa-filter-select";
import KoaIdFilterIndicator from "@/components/admin/koa-id-filter-indicator";
import type { AgeGroup, Gender, ProductStatus } from "@/types/enums";
import { productFilterSpecs, type ProductFilters } from "@/types/filters/product-filters";
import type { SpecsToBag } from "@/types/filters/table-filters";

/**
 * The bag exactly as `useServerTableParams` hands it over — derived from the
 * specs rather than restated, so this component's props and the hook's
 * `setFilter` can't drift apart.
 */
type ProductFilterBag = SpecsToBag<typeof productFilterSpecs>;

type SetProductFilter = <K extends keyof ProductFilterBag>(
  key: K,
  value: ProductFilterBag[K] | undefined
) => void;

interface ProductFilterControlsProps {
  filters: ProductFilters;
  setFilter: SetProductFilter;  /**
   * Resolved name for the `productId` deep-link filter. When the id matches a
   * row already on screen we get the name for free from the list response,
   * rather than firing a second request for it.
   */
  productIdLabel?: string;
}

/** Select values are strings; the bag holds real enum/boolean values. */
const toSelectValue = (value: string | number | boolean | undefined) =>
  value === undefined ? null : String(value);

/** `"All" -> undefined`, otherwise parse the selected value back to its type. */
const fromSelectValue = (next: string | null) => (next === null ? undefined : next);

/**
 * The base-products route's filter controls — the `children` of
 * <KoaAdminFiltersBar />.
 *
 * Split by intent:
 * - `gender` / `ageGroup` / `status` / `isActive` / `isFeatured` are
 *   *exploration* filters: fixed option lists, so they get an always-visible
 *   select each.
 * - `productId` is a *navigation* filter, set by a deep link from another page,
 *   so it gets no control — only a removable indicator while it's active.
 *
 * Everything here is driven by `productFilterSpecs`, so the controls and the
 * `?`-params sent to the API can't drift apart.
 */
export default function ProductFilterControls({
  filters,
  setFilter,
  productIdLabel,
}: ProductFilterControlsProps) {
  return (
    <>
      <KoaFilterSelect
        label={productFilterSpecs.gender.label}
        value={toSelectValue(filters.gender)}
        options={toSelectOptions(productFilterSpecs.gender.options)}
        onValueChange={(next) =>
          setFilter("gender", fromSelectValue(next) as Gender | undefined)
        }
      />

      <KoaFilterSelect
        label={productFilterSpecs.ageGroup.label}
        value={toSelectValue(filters.ageGroup)}
        options={toSelectOptions(productFilterSpecs.ageGroup.options)}
        onValueChange={(next) =>
          setFilter("ageGroup", fromSelectValue(next) as AgeGroup | undefined)
        }
      />

      <KoaFilterSelect
        label={productFilterSpecs.status.label}
        value={toSelectValue(filters.status)}
        options={toSelectOptions(productFilterSpecs.status.options)}
        onValueChange={(next) =>
          setFilter("status", fromSelectValue(next) as ProductStatus | undefined)
        }
      />

      <KoaFilterSelect
        label={productFilterSpecs.isActive.label}
        value={toSelectValue(filters.isActive)}
        options={toSelectOptions(productFilterSpecs.isActive.options)}
        onValueChange={(next) =>
          setFilter("isActive", next === null ? undefined : next === "true")
        }
      />

      <KoaFilterSelect
        label={productFilterSpecs.isFeatured.label}
        value={toSelectValue(filters.isFeatured)}
        options={toSelectOptions(productFilterSpecs.isFeatured.options)}
        onValueChange={(next) =>
          setFilter("isFeatured", next === null ? undefined : next === "true")
        }
      />

      <KoaIdFilterIndicator
        label={productFilterSpecs.productId.label}
        id={filters.productId}
        displayValue={productIdLabel}
        onClear={() => setFilter("productId", undefined)}
      />
    </>
  );
}
