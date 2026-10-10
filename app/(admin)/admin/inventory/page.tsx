"use client";

import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import { PageHeader } from "@/components/admin/page-header";
import { KoaTable } from "@/components/general/table/koa-table";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { useSearchField } from "@/hooks/use-search-field";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { ShelvingUnit } from "lucide-react";
import { getInventoryColumns } from "./columns";

export default function InventoryPage() {
  // No filter specs yet - the endpoint takes only search and pagination, so
  // `filters` is empty and contributes no query params. It's still passed
  // through so adding a filter bag later is a one-line change in the hook.
  const { pagination, setPagination, search, setSearch, filters } =
    useServerTableParams();
  const searchField = useSearchField({ value: search, onCommit: setSearch });
  const { data, isLoading } = useInventory({ pagination, search, filters });

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
      </div>

      <KoaTable
        columns={getInventoryColumns()}
        data={data?.items ?? []}
        rowCount={data?.totalRecords ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        emptyMessage={
          search ? "No inventory items match the current search." : undefined
        }
      />
    </div>
  );
}
