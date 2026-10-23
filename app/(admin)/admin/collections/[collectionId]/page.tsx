"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { KoaTable } from "@/components/general/table/koa-table";
import { Button } from "@/components/ui/button";
import { useCollectionItems } from "@/features/collection/hooks/use-collection-items";
import { getErrorMessage, isNotFoundError } from "@/lib/api/errors";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";
import { DEFAULT_PAGE_SIZE } from "@/types/pagination";
import type { PaginationState } from "@tanstack/react-table";
import { ChevronLeft, Package, PackageX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCollectionItemColumns } from "./columns";

const INITIAL_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: DEFAULT_PAGE_SIZE,
};

/**
 * One collection's products, at `/admin/collections/{collectionId}`, reached by
 * clicking a tile in the collections grid.
 *
 * The only list page in the admin whose paging is client-side: the endpoint
 * behind it (`GET /api/v1/collections/{id}`) is not paged — it returns the
 * collection's whole product list as one array — so the slice happens here and
 * `KoaTable` still gets the manual-pagination props it expects (this page's
 * `data`, every row's count). If collections ever grow past a page or two of
 * products, paging this belongs on the server next.
 *
 * NOTE: that endpoint returns a collection's *items*, not the collection — so
 * this page can't name the collection it is showing. The header deliberately
 * stays generic ("Collection products") rather than inventing a label from the
 * id; showing the real name/description/cover needs a read-by-id endpoint
 * (e.g. `GET /api/v1/collections/{id}/details`), which `/api/v1/collections/
 * {id}` can't also be while it serves the items.
 */
export default function CollectionItemsPage() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const { data, isLoading, isError, error } = useCollectionItems(collectionId);

  const [pagination, setPagination] = useState<PaginationState>(INITIAL_PAGINATION);

  const items = data ?? [];
  const start = pagination.pageIndex * pagination.pageSize;
  const pageItems = items.slice(start, start + pagination.pageSize);

  // A collection that exists with no products comes back 200 + `[]`, so an
  // error here means the id genuinely didn't resolve. Worth separating from a
  // transport failure, which is what the other branch reports — the failure
  // envelope gives every status the same shape.
  const isNotFound = isError && isNotFoundError(error);

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link
          href={PAGE_ROUTES.ADMIN.COLLECTIONS}
          className="flex flex-row items-center justify-center gap-2"
        >
          <ChevronLeft className="size-3.5" /> All collections
        </Link>
      </Button>

      <PageHeader
        title="Collection products"
        description={describe(items.length, isLoading)}
        icon={<Package />}
      />

      {isError ? (
        <Notice icon={<PackageX className="size-6" />}>
          {isNotFound
            ? "This collection was not found. It may have been deleted, or the link may be wrong."
            : getErrorMessage(error)}
        </Notice>
      ) : (
        <KoaTable
          columns={getCollectionItemColumns()}
          data={pageItems}
          rowCount={items.length}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoading}
          emptyMessage="No products have been added to this collection yet."
        />
      )}
    </div>
  );
}

/**
 * The line under the page title. Says how many products the collection holds,
 * and deliberately says nothing about failure: the error message belongs in
 * the notice below, and repeating it here would print it twice.
 */
function describe(count: number, isLoading: boolean): string {
  if (isLoading) return "Loading products...";

  if (count === 0) return "No products grouped into this collection yet.";

  return `${count} product${count === 1 ? "" : "s"} grouped into this collection.`;
}

/** Dashed placeholder for the states that aren't a table of products. */
function Notice({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-20 text-center">
      <span className="text-muted-foreground">{icon}</span>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
