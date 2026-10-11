"use client";

import KoaFilterSelect, { toSelectOptions } from "@/components/admin/koa-filter-select";
import KoaIdFilterIndicator from "@/components/admin/koa-id-filter-indicator";
import { designFilterSpecs, type DesignFilters } from "@/types/filters/design-filters";
import type { SpecsToBag } from "@/types/filters/table-filters";

/**
 * The bag exactly as `useServerTableParams` hands it over — derived from the
 * specs rather than restated, so this component's props and the hook's
 * `setFilter` can't drift apart.
 */
type DesignFilterBag = SpecsToBag<typeof designFilterSpecs>;

type SetDesignFilter = <K extends keyof DesignFilterBag>(
  key: K,
  value: DesignFilterBag[K] | undefined
) => void;

interface DesignFilterControlsProps {
  filters: DesignFilters;
  setFilter: SetDesignFilter;
  /**
   * Resolved name for the `designId` deep-link filter. When the id matches a
   * row already on screen we get the name for free from the list response,
   * rather than firing a second request for it.
   */
  designIdLabel?: string;
}

/** Select values are strings; the bag holds real enum/boolean values. */
const toSelectValue = (value: string | number | boolean | undefined) =>
  value === undefined ? null : String(value);

/**
 * The designs route's filter controls — the `children` of
 * <KoaAdminFiltersBar />.
 *
 * Split by intent, same as the base-products and categories routes:
 * - `isActive` is an *exploration* filter: a fixed option list, so it gets an
 *   always-visible select.
 * - `designId` is a *navigation* filter, set by a deep link from another page,
 *   so it gets no control — only a removable indicator while it's active.
 *
 * Everything here is driven by `designFilterSpecs`, so the controls and the
 * `?`-params sent to the API can't drift apart.
 */
export default function DesignFilterControls({
  filters,
  setFilter,
  designIdLabel,
}: DesignFilterControlsProps) {
  return (
    <>
      <KoaFilterSelect
        label={designFilterSpecs.isActive.label}
        value={toSelectValue(filters.isActive)}
        options={toSelectOptions(designFilterSpecs.isActive.options)}
        onValueChange={(next) =>
          setFilter("isActive", next === null ? undefined : next === "true")
        }
      />

      <KoaIdFilterIndicator
        label={designFilterSpecs.designId.label}
        id={filters.designId}
        displayValue={designIdLabel}
        onClear={() => setFilter("designId", undefined)}
      />
    </>
  );
}
