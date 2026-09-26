"use client";

import { useMemo, useState } from "react";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { useSearchField } from "@/hooks/use-search-field";
import { useDesigns } from "@/features/design/hooks/use-designs";
import { useDesignMutations } from "@/features/design/hooks/use-design-mutations";
import { getDesignColumns } from "./columns";
import { DesignDto } from "@/types/design";
import { designFilterSpecs } from "@/types/filters/design-filters";
import { KoaTable } from "@/components/general/table/koa-table";
import { RotateCcw, Palette } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { AddNewButton } from "@/components/general/add-new-button";
import { Item, ItemContent } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import CreateDesignModal from "@/components/admin/design/modals/create-design-modal";
import DeleteDesignConfirmationModal from "@/components/admin/design/modals/delete-design-confirmation-modal";
import UpdateDesignModal from "@/components/admin/design/modals/update-design-modal";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import KoaAdminFiltersBar from "@/components/admin/koa-admin-filters-bar";
import DesignFilterControls from "@/components/admin/design/filters/design-filter-controls";

export default function DesignsPage() {
  const {
    pagination,
    setPagination,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  } = useServerTableParams({ filters: designFilterSpecs });
  const searchField = useSearchField({ value: search, onCommit: setSearch });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [designToEdit, setDesignToEdit] = useState<DesignDto | null>(null);
  const [designToDelete, setDesignToDelete] = useState<DesignDto | null>(null);

  const { data, isLoading } = useDesigns({ pagination, search, filters });
  const { toggleActiveStatus } = useDesignMutations();

  const handleToggleActiveStatus = (design: DesignDto) => {
    toggleActiveStatus.mutate(design.id);
  };

  /**
   * Label for the `designId` deep-link indicator. When that filter is set the
   * list is scoped to exactly that design, so the name is already in the
   * response — no second request. Matching on the id (rather than trusting the
   * row position) keeps a stale `placeholderData` page from naming the wrong
   * design for a frame while the filtered request is in flight.
   */
  const designIdLabel = useMemo(() => {
    if (!filters.designId) return undefined;
    return data?.items.find((item) => item.id === filters.designId)?.name;
  }, [filters.designId, data]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={"Design"}
        description={"The visual pattern, artwork, or print applied to a garment."}
        icon={<Palette />}
      />

      <div className="flex flex-col gap-3">
        <KoaAdminSearchBar
          searchField={searchField}
          placeholder="Search Design..."
        />

        <KoaAdminFiltersBar
          hasActiveFilters={hasActiveFilters}
          onClearAll={clearFilters}
        >
          <DesignFilterControls
            filters={filters}
            setFilter={setFilter}
            designIdLabel={designIdLabel}
          />
        </KoaAdminFiltersBar>

        <div className="flex items-center justify-end gap-2">
          <AddNewButton onClick={() => setIsCreateOpen(true)} />
        </div>
      </div>

      <KoaTable
        columns={getDesignColumns({
          onEdit: setDesignToEdit,
          onDelete: setDesignToDelete,
          toggleActiveStatus: handleToggleActiveStatus,
        })}
        data={data?.items ?? []}
        rowCount={data?.totalRecords ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        emptyMessage={
          hasActiveFilters || search
            ? "No designs match the current search and filters."
            : undefined
        }
      />

      <CreateDesignModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <DeleteDesignConfirmationModal
        design={designToDelete}
        onOpenChange={(open) => {
          if (!open) setDesignToDelete(null);
        }}
      />

      <UpdateDesignModal
        design={designToEdit}
        onOpenChange={(open) => {
          if (!open) setDesignToEdit(null);
        }}
      />
    </div>
  );
}