"use client";

import KoaFilterSelect, { toSelectOptions } from "@/components/admin/koa-filter-select";
import KoaIdFilterIndicator from "@/components/admin/koa-id-filter-indicator";
import { colorFilterSpecs, type ColorFilters } from "@/types/filters/color-filters";
import type { SpecsToBag } from "@/types/filters/table-filters";

/**
 * The bag exactly as `useServerTableParams` hands it over — derived from the
 * specs rather than restated, so this component's props and the hook's
 * `setFilter` can't drift apart.
 */
type ColorFilterBag = SpecsToBag<typeof colorFilterSpecs>;

type SetColorFilter = <K extends keyof ColorFilterBag>(
  key: K,
  value: ColorFilterBag[K] | undefined
) => void;

interface ColorFilterControlsProps {
  filters: ColorFilters;
  setFilter: SetColorFilter;
  /**
   * Resolved name for the `colorId` deep-link filter. When the id matches a
   * row already on screen we get the name for free from the list response,
   * rather than firing a second request for it.
   */
  colorIdLabel?: string;
}

/** Select values are strings; the bag holds real enum/boolean values. */
const toSelectValue = (value: string | number | boolean | undefined) =>
  value === undefined ? null : String(value);

/**
 * The colors route's filter controls — the `children` of
 * <KoaAdminFiltersBar />.
 *
 * Split by intent, same as the base-products, categories and designs routes:
 * - `isActive` is an *exploration* filter: a fixed option list, so it gets an
 *   always-visible select.
 * - `colorId` is a *navigation* filter, set by a deep link from another page,
 *   so it gets no control — only a removable indicator while it's active.
 *
 * Everything here is driven by `colorFilterSpecs`, so the controls and the
 * `?`-params sent to the API can't drift apart.
 */
export default function ColorFilterControls({
  filters,
  setFilter,
  colorIdLabel,
}: ColorFilterControlsProps) {
  return (
    <>
      <KoaFilterSelect
        label={colorFilterSpecs.isActive.label}
        value={toSelectValue(filters.isActive)}
        options={toSelectOptions(colorFilterSpecs.isActive.options)}
        onValueChange={(next) =>
          setFilter("isActive", next === null ? undefined : next === "true")
        }
      />

      <KoaIdFilterIndicator
        label={colorFilterSpecs.colorId.label}
        id={filters.colorId}
        displayValue={colorIdLabel}
        onClear={() => setFilter("colorId", undefined)}
      />
    </>
  );
}
