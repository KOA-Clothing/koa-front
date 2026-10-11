"use client";

import KoaFilterSelect, { toSelectOptions } from "@/components/admin/koa-filter-select";
import KoaIdFilterIndicator from "@/components/admin/koa-id-filter-indicator";
import { categoryFilterSpecs, type CategoryFilters } from "@/types/filters/category-filters";
import type { SpecsToBag } from "@/types/filters/table-filters";

/**
 * The bag exactly as `useServerTableParams` hands it over — derived from the
 * specs rather than restated, so this component's props and the hook's
 * `setFilter` can't drift apart.
 */
type CategoryFilterBag = SpecsToBag<typeof categoryFilterSpecs>;

type SetCategoryFilter = <K extends keyof CategoryFilterBag>(
  key: K,
  value: CategoryFilterBag[K] | undefined
) => void;

interface CategoryFilterControlsProps {
  filters: CategoryFilters;
  setFilter: SetCategoryFilter;
  /**
   * Resolved name for the `categoryId` deep-link filter. When the id matches a
   * row already on screen we get the name for free from the list response,
   * rather than firing a second request for it.
   */
  categoryIdLabel?: string;
}

/** Select values are strings; the bag holds real enum/boolean values. */
const toSelectValue = (value: string | number | boolean | undefined) =>
  value === undefined ? null : String(value);

/**
 * The categories route's filter controls — the `children` of
 * <KoaAdminFiltersBar />.
 *
 * Split by intent, same as the base-products route:
 * - `isActive` is an *exploration* filter: a fixed option list, so it gets an
 *   always-visible select.
 * - `categoryId` is a *navigation* filter, set by a deep link from another page,
 *   so it gets no control — only a removable indicator while it's active.
 *
 * Everything here is driven by `categoryFilterSpecs`, so the controls and the
 * `?`-params sent to the API can't drift apart.
 */
export default function CategoryFilterControls({
  filters,
  setFilter,
  categoryIdLabel,
}: CategoryFilterControlsProps) {
  return (
    <>
      <KoaFilterSelect
        label={categoryFilterSpecs.isActive.label}
        value={toSelectValue(filters.isActive)}
        options={toSelectOptions(categoryFilterSpecs.isActive.options)}
        onValueChange={(next) =>
          setFilter("isActive", next === null ? undefined : next === "true")
        }
      />

      <KoaIdFilterIndicator
        label={categoryFilterSpecs.categoryId.label}
        id={filters.categoryId}
        displayValue={categoryIdLabel}
        onClear={() => setFilter("categoryId", undefined)}
      />
    </>
  );
}
