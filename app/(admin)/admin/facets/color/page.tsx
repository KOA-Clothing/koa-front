"use client";

import { useMemo, useState } from "react";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { useSearchField } from "@/hooks/use-search-field";
import { useColors } from "@/features/color/hooks/use-colors";
import { useColorMutations } from "@/features/color/hooks/use-color-mutations";
import { getColorColumns } from "./columns";
import { ColorDto } from "@/types/color";
import { colorFilterSpecs } from "@/types/filters/color-filters";
import { KoaTable } from "@/components/general/table/koa-table";
import { Palette } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import KoaAdminFiltersBar from "@/components/admin/koa-admin-filters-bar";
import ColorFilterControls from "@/components/admin/color/filters/color-filter-controls";
import { AddNewButton } from "@/components/general/add-new-button";
import CreateColorModal from "@/components/admin/color/modals/create-color-modal";
import DeleteColorConfirmationModal from "@/components/admin/color/modals/delete-color-confirmation-modal";
import UpdateColorModal from "@/components/admin/color/modals/update-color-modal";

export default function ColorPage() {
  const {
    pagination,
    setPagination,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  } = useServerTableParams({ filters: colorFilterSpecs });
  const searchField = useSearchField({ value: search, onCommit: setSearch });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [colorToEdit, setColorToEdit] = useState<ColorDto | null>(null);
  const [colorToDelete, setColorToDelete] = useState<ColorDto | null>(null);

  const { data, isLoading } = useColors({ pagination, search, filters });
  const { toggleActiveStatus } = useColorMutations();

  const handleToggleActiveStatus = (color: ColorDto) => {
    toggleActiveStatus.mutate(color.id);
  };

  /**
   * Label for the `colorId` deep-link indicator. When that filter is set the
   * list is scoped to exactly that color, so the name is already in the
   * response — no second request. Matching on the id (rather than trusting the
   * row position) keeps a stale `placeholderData` page from naming the wrong
   * color for a frame while the filtered request is in flight.
   */
  const colorIdLabel = useMemo(() => {
    if (!filters.colorId) return undefined;
    return data?.items.find((item) => item.id === filters.colorId)?.name;
  }, [filters.colorId, data]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={"Color"}
        description={"The visual colorway of an apparel item, defined by its hex code or swatch image."}
        icon={<Palette />}
      />

      <div className="flex flex-col gap-3">
        <KoaAdminSearchBar
          searchField={searchField}
          placeholder="Search Color..."
        />

        <KoaAdminFiltersBar
          hasActiveFilters={hasActiveFilters}
          onClearAll={clearFilters}
        >
          <ColorFilterControls
            filters={filters}
            setFilter={setFilter}
            colorIdLabel={colorIdLabel}
          />
        </KoaAdminFiltersBar>

        <div className="flex items-center justify-end gap-2">
          <AddNewButton onClick={() => setIsCreateOpen(true)} />
        </div>
      </div>

      <KoaTable
        columns={getColorColumns({
          onEdit: setColorToEdit,
          onDelete: setColorToDelete,
          toggleActiveStatus: handleToggleActiveStatus,
        })}
        data={data?.items ?? []}
        rowCount={data?.totalRecords ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        emptyMessage={
          hasActiveFilters || search
            ? "No colors match the current search and filters."
            : undefined
        }
      />

      <CreateColorModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <DeleteColorConfirmationModal
        color={colorToDelete}
        onOpenChange={(open) => {
          if (!open) setColorToDelete(null);
        }}
      />

      <UpdateColorModal
        color={colorToEdit}
        onOpenChange={(open) => {
          if (!open) setColorToEdit(null);
        }}
      />
    </div>
  );
}