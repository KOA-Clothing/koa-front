"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { AddNewButton } from "@/components/general/add-new-button";
import CreateCollectionModal from "@/components/admin/collection/modals/create-collection-modal";
import DeleteCollectionConfirmationModal from "@/components/admin/collection/modals/delete-collection-confirmation-modal";
import EditCollectionModal from "@/components/admin/collection/modals/edit-collection-modal";
import CollectionCard from "@/components/admin/collection/collection-card";
import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import { DataTablePagination } from "@/components/general/table/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollections } from "@/features/collection/hooks/use-collections";
import { useSearchField } from "@/hooks/use-search-field";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { getErrorMessage } from "@/lib/api/errors";
import { CollectionDto } from "@/types/collection";
import { ImageOff, LayoutGrid } from "lucide-react";

/** Cards per row: one on mobile, widening to four on very wide screens. */
const COLLECTIONS_GRID = "grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

/** How many placeholder cards to draw while the first page is in flight. */
const SKELETON_COUNT = 8;

/**
 * Admin listing of product collections at `/admin/collections`.
 *
 * A card grid, not a <KoaTable>: the collection's cover image is part of what
 * the admin is here to judge, and a table cell thumbnail can't carry the
 * 4:3 crop the shop-front card uses. Pagination/search still live in the URL
 * via `useServerTableParams`, and the pagination bar is the same
 * `DataTablePagination` the tables use — it's presentational, table-agnostic.
 *
 * Each card is also the way into a collection's contents: the grid answers
 * "which collections exist", and clicking a tile opens that collection's
 * product list at `/admin/collections/{id}`.
 */
export default function CollectionsPage() {
  const { pagination, setPagination, search, setSearch } = useServerTableParams();
  const searchField = useSearchField({ value: search, onCommit: setSearch });

  // The modal is driven by a boolean; deletion and editing are driven by the
  // collection they act on, the same subject-plus-flag split the category page
  // uses.
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [collectionToEdit, setCollectionToEdit] = useState<CollectionDto | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<CollectionDto | null>(null);

  // No filter bag on this route yet — pagination and search only.
  const { data, isLoading, isError, error } = useCollections({
    pagination,
    search,
    filters: {},
  });

  const collections = data?.items ?? [];
  const rowCount = data?.totalRecords ?? 0;
  const pageCount = Math.ceil(rowCount / pagination.pageSize);

  const hasActiveSearch = search.trim() !== "";

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={"Product Collections"}
        description={
          "Group products into curated collections (e.g. Active Wear) that appear as cards on the shop front."
        }
        icon={<LayoutGrid />}
      />

      <div className="flex flex-col gap-3">
        <KoaAdminSearchBar
          searchField={searchField}
          placeholder="Search collections..."
        />

        <div className="flex items-center justify-end gap-2">
          <AddNewButton onClick={() => setIsCreateOpen(true)} />
        </div>
      </div>

      {isLoading ? (
        <div className={COLLECTIONS_GRID}>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="flex flex-col overflow-hidden rounded-xl border border-border"
            >
              <Skeleton className="aspect-4/3 w-full rounded-none" />
              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <Notice icon={<ImageOff className="size-6" />}>
          {getErrorMessage(error)}
        </Notice>
      ) : collections.length === 0 ? (
        <Notice icon={<LayoutGrid className="size-6" />}>
          {hasActiveSearch
            ? "No collections match the current search."
            : "No collections yet. Create your first collection to group products on the shop front."}
        </Notice>
      ) : (
        <div className={COLLECTIONS_GRID}>
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onEdit={setCollectionToEdit}
              onDelete={setCollectionToDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination bar sits outside the data branches: on the empty/error
          states it renders "No results" and disables itself, same as every
          KoaTable-backed page. */}
      <DataTablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        pageCount={pageCount}
        rowCount={rowCount}
        canPreviousPage={pagination.pageIndex > 0}
        canNextPage={pagination.pageIndex + 1 < pageCount}
        canLastPage={pageCount > 0 && pagination.pageIndex < pageCount - 1}
        onFirstPage={() => setPagination((prev) => ({ ...prev, pageIndex: 0 }))}
        onPreviousPage={() =>
          setPagination((prev) => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) }))
        }
        onNextPage={() =>
          setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))
        }
        onLastPage={() =>
          setPagination((prev) => ({ ...prev, pageIndex: Math.max(0, pageCount - 1) }))
        }
        onPageSizeChange={(size) =>
          setPagination(() => ({ pageIndex: 0, pageSize: size }))
        }
        isLoading={isLoading}
      />

      <CreateCollectionModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      {/* Rendered unconditionally, driven by `collectionToEdit` — mounting it
          only while open would remount the dialog and lose its focus handling
          on every open, the same reason the create modal sits outside any
          conditional branch. */}
      <EditCollectionModal
        collection={collectionToEdit}
        onOpenChange={(open) => {
          if (!open) setCollectionToEdit(null);
        }}
      />

      {/* Rendered unconditionally, driven by `collectionToDelete` — mounting it
          only while open would remount the dialog and lose its focus handling
          on every open, the same reason the create modal sits outside any
          conditional branch. */}
      <DeleteCollectionConfirmationModal
        collection={collectionToDelete}
        onOpenChange={(open) => {
          if (!open) setCollectionToDelete(null);
        }}
      />
    </div>
  );
}

/** Dashed placeholder for the states that aren't a grid of collections. */
function Notice({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-20 text-center">
      <span className="text-muted-foreground">{icon}</span>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
