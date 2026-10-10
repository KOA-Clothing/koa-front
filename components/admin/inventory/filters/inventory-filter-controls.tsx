"use client";

import KoaFilterSelect, { toSelectOptions } from "@/components/admin/koa-filter-select";
import KoaIdFilterIndicator from "@/components/admin/koa-id-filter-indicator";
import { useActiveColors } from "@/features/color/hooks/use-colors";
import type { ClothingSize } from "@/types/enums";
import {
  inventoryFilterSpecs,
  type InventoryFilters,
} from "@/types/filters/inventory-filters";
import type { SpecsToBag } from "@/types/filters/table-filters";

/**
 * The bag exactly as `useServerTableParams` hands it over — derived from the
 * specs rather than restated, so this component's props and the hook's
 * `setFilter` can't drift apart.
 */
type InventoryFilterBag = SpecsToBag<typeof inventoryFilterSpecs>;

type SetInventoryFilter = <K extends keyof InventoryFilterBag>(
  key: K,
  value: InventoryFilterBag[K] | undefined
) => void;

interface InventoryFilterControlsProps {
  filters: InventoryFilters;
  setFilter: SetInventoryFilter;
  /**
   * Resolved label for the `productId` deep-link filter. When the id matches a
   * row already on screen we get the name for free from the list response,
   * rather than firing a second request for it.
   */
  productIdLabel?: string;
  /**
   * Resolved label for the `variantId` deep-link filter (product name + color /
   * size), derived the same way.
   */
  variantIdLabel?: string;
}

/** Select values are strings; the bag holds real enum values. */
const toSelectValue = (value: string | number | boolean | undefined) =>
  value === undefined ? null : String(value);

/**
 * The inventory route's filter controls — the `children` of
 * <KoaAdminFiltersBar />.
 *
 * `colorId` and `size` are *exploration* filters: they narrow which rows appear,
 * so both get an always-visible select. `colorId`'s options are runtime data
 * (`useActiveColors`) rather than a static enum, so the spec deliberately omits
 * them and they are built here instead.
 *
 * `productId` and `variantId` are *navigation* filters, set by a deep link from
 * another page (e.g. a product's row or a variant's row), so they get no control
 * — only a removable indicator while active.
 *
 * Everything here is driven by `inventoryFilterSpecs`, so the controls and the
 * `?`-params sent to the API can't drift apart.
 */
export default function InventoryFilterControls({
  filters,
  setFilter,
  productIdLabel,
  variantIdLabel,
}: InventoryFilterControlsProps) {
  const { data: activeColors } = useActiveColors();

  const colorOptions = (activeColors ?? []).map((color) => ({
    value: color.id,
    label: color.name,
  }));

  return (
    <>
      <KoaFilterSelect
        label={inventoryFilterSpecs.colorId.label}
        value={toSelectValue(filters.colorId)}
        options={colorOptions}
        onValueChange={(next) => setFilter("colorId", next ?? undefined)}
      />

      <KoaFilterSelect
        label={inventoryFilterSpecs.size.label}
        value={toSelectValue(filters.size)}
        options={toSelectOptions(inventoryFilterSpecs.size.options)}
        onValueChange={(next) =>
          setFilter("size", next === null ? undefined : (Number(next) as ClothingSize))
        }
      />

      <KoaIdFilterIndicator
        label={inventoryFilterSpecs.productId.label}
        id={filters.productId}
        displayValue={productIdLabel}
        onClear={() => setFilter("productId", undefined)}
      />

      <KoaIdFilterIndicator
        label={inventoryFilterSpecs.variantId.label}
        id={filters.variantId}
        displayValue={variantIdLabel}
        onClear={() => setFilter("variantId", undefined)}
      />
    </>
  );
}
