"use client";

import { useMemo } from "react";
import InventoryFilterControls from "@/components/admin/inventory/filters/inventory-filter-controls";
import KoaAdminFiltersBar from "@/components/admin/koa-admin-filters-bar";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import { PageHeader } from "@/components/admin/page-header";
import { KoaTable } from "@/components/general/table/koa-table";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { useSearchField } from "@/hooks/use-search-field";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { adminListHrefs } from "@/lib/configs/page-routes";
import { clothingSizeLabels } from "@/types/enum-labels";
import { inventoryFilterSpecs } from "@/types/filters/inventory-filters";
import { sortInventoryRows, type InventoryDto } from "@/types/inventory";
import { ShelvingUnit } from "lucide-react";
import { useRouter } from "next/navigation";
import { getInventoryColumns } from "./columns";

export default function InventoryPage() {
  const router = useRouter();
  const {
    pagination,
    setPagination,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  } = useServerTableParams({ filters: inventoryFilterSpecs });
  const searchField = useSearchField({ value: search, onCommit: setSearch });
  const { data, isLoading } = useInventory({ pagination, search, filters });

  // The backend now orders by product name -> variant color name -> variant
  // size, so this is usually a no-op; it stays as a cheap guarantee that the
  // on-screen order matches the intended key even if the server order drifts.
  const rows = useMemo(() => sortInventoryRows(data?.items ?? []), [data]);

  /** Deep-links to the inventory row's base product, scoped by its id filter. */
  const handleBaseProductView = (item: InventoryDto) => {
    router.push(adminListHrefs.baseProducts({ productId: item.productId }));
  };

  /**
   * Resolved labels for the id-shaped filters. When one is active the list is
   * already scoped to that record, so its name is in the response — no second
   * request. Matching on the id (rather than the row position) keeps a stale
   * `placeholderData` page from naming the wrong record for a frame.
   */
  const productIdLabel = useMemo(() => {
    if (!filters.productId) return undefined;
    return data?.items.find((item) => item.productId === filters.productId)
      ?.productName;
  }, [filters.productId, data]);

  const variantIdLabel = useMemo(() => {
    if (!filters.variantId) return undefined;
    const item = data?.items.find((row) => row.variant.id === filters.variantId);
    if (!item) return undefined;
    return `${item.productName} — ${item.variant.color.name} / ${
      clothingSizeLabels[item.variant.size]
    }`;
  }, [filters.variantId, data]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={"Inventory"}
        description={
          "Stock levels per product variant, including reserved quantities and low-stock thresholds."
        }
        icon={<ShelvingUnit />}
      />

      <div className="flex flex-col gap-3">
        <KoaAdminSearchBar
          searchField={searchField}
          placeholder="Search Products..."
        />

        <KoaAdminFiltersBar
          hasActiveFilters={hasActiveFilters}
          onClearAll={clearFilters}
        >
          <InventoryFilterControls
            filters={filters}
            setFilter={setFilter}
            productIdLabel={productIdLabel}
            variantIdLabel={variantIdLabel}
          />
        </KoaAdminFiltersBar>
      </div>

      <KoaTable
        columns={getInventoryColumns({
          onBaseProductView: handleBaseProductView,
        })}
        data={rows}
        rowCount={data?.totalRecords ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        emptyMessage={
          hasActiveFilters || search
            ? "No inventory items match the current search and filters."
            : undefined
        }
      />
    </div>
  );
}
