"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import AddProductModal from "@/components/admin/collection/modals/add-product-modal";
import RemoveProductFromCollectionModal from "@/components/admin/collection/modals/remove-product-from-collection-modal";
import { KoaTable } from "@/components/general/table/koa-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddNewButton } from "@/components/general/add-new-button";
import { useCollectionInfo } from "@/features/collection/hooks/use-collection-info";
import { useCollectionItems } from "@/features/collection/hooks/use-collection-items";
import { getErrorMessage, isNotFoundError } from "@/lib/api/errors";
import { adminListHrefs, PAGE_ROUTES } from "@/lib/configs/page-routes";
import type { CollectionDto } from "@/types/collection";
import type { ProductDto } from "@/types/product";
import { DEFAULT_PAGE_SIZE } from "@/types/pagination";
import type { PaginationState } from "@tanstack/react-table";
import { Boxes, ChevronLeft, Package, PackageX } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCollectionItemColumns } from "./columns";

const INITIAL_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: DEFAULT_PAGE_SIZE,
};

/**
 * One collection's products, at `/admin/collections/{collectionId}`, reached by
 * clicking a tile in the collections grid.
 *
 * Two requests, because neither endpoint answers both halves: `/info` returns
 * the collection itself (so the header can carry its real name, description and
 * item count), and `/collections/{id}` returns the products inside it. The
 * `/info` call also supplies the page's existence check — the items endpoint
 * replies `200 + []` for an id that doesn't resolve, which is indistinguishable
 * from a collection that simply has no products yet.
 *
 * The only list page in the admin whose paging is client-side: the items
 * endpoint is not paged — it returns the collection's whole product list as one
 * array — so the slice happens here and `KoaTable` still gets the
 * manual-pagination props it expects (this page's `data`, every row's count).
 * If collections ever grow past a page or two of products, paging this belongs
 * on the server next.
 */
export default function CollectionItemsPage() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const router = useRouter();
  const { data, isLoading, isError, error } = useCollectionItems(collectionId);
  const info = useCollectionInfo(collectionId);

  const [pagination, setPagination] = useState<PaginationState>(INITIAL_PAGINATION);

  // The add-product dialog is driven by the collection it targets (subject
  // doubles as the open flag), the same shape as the edit/delete dialogs on the
  // collections grid. Held in state rather than derived so the modal isn't
  // handed a new object — and reseeded — on every render of this page.
  const [collectionForAdd, setCollectionForAdd] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [productToRemove, setProductToRemove] = useState<ProductDto | null>(null);

  const collection = info.data;
  const items = data ?? [];
  const start = pagination.pageIndex * pagination.pageSize;
  const pageItems = items.slice(start, start + pagination.pageSize);

  // A 404 is the collection genuinely not existing, as opposed to the request
  // failing: the failure envelope gives every status the same shape, so the
  // status is the only way to tell "deleted" from "tunnel is down". Checked on
  // both queries even though only `/info` reports it today.
  const isNotFound =
    (info.isError && isNotFoundError(info.error)) ||
    (isError && isNotFoundError(error));

  // The first non-404 failure to report. A missing collection outranks a
  // transport error on the other request — "not found" is the actionable fact.
  const failure =
    info.isError && !isNotFoundError(info.error)
      ? info.error
      : isError && !isNotFoundError(error)
        ? error
        : null;

  const handleBaseProductView = (product: ProductDto) => {
    router.push(adminListHrefs.baseProducts({ productId: product.id }));
  };

  const handleRemoveItem = (product: ProductDto) => {
    setProductToRemove(product);
  };
 
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
        title={collection?.name ?? "Collection"}
        description={describeCollection(collection, info.isLoading)}
        icon={<Package />}
      >
        {/* The count comes from the collection record, not from `items.length`:
            it is the number the backend reports for this collection, and it
            stays correct while the product list is still in flight. */}
        {collection && (
          <Badge variant="secondary" className="h-6 gap-1.5 px-2.5">
            <Boxes className="size-3.5" />
            {collection.itemCount}{" "}
            {collection.itemCount === 1 ? "product" : "products"}
          </Badge>
        )}
      </PageHeader>
      
      <div className="flex flex-row items-center justify-end">
        <AddNewButton
          label="Add product"
          // Disabled until `/info` answers: the dialog names the collection it
          // is adding to, and adding to a collection that doesn't exist can
          // only fail.
          disabled={!collection}
          onClick={() =>
            collection &&
            setCollectionForAdd({ id: collection.id, name: collection.name })
          }
        />
      </div>
      
      {isNotFound ? (
        <Notice icon={<PackageX className="size-6" />}>
          This collection was not found. It may have been deleted, or the link
          may be wrong.
        </Notice>
      ) : failure ? (
        <Notice icon={<PackageX className="size-6" />}>
          {getErrorMessage(failure)}
        </Notice>
      ) : (
        <KoaTable
          columns={getCollectionItemColumns({
            onViewBaseProduct: handleBaseProductView,
            //(product) => { router.push(adminListHrefs.baseProducts({ productId: product.id }));},
            onDelete: handleRemoveItem
            //(product) => { setProductToRemove(product); },
          })}
          data={pageItems}
          rowCount={items.length}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoading}
          emptyMessage="No products have been added to this collection yet."
        />
      )}

      <AddProductModal
        collection={collectionForAdd}
        // Products already in the collection are the ones the endpoint would
        // treat as a no-op, so the picker leaves them out.
        excludeProductIds={items.map((item) => item.productId)}
        onOpenChange={(open) => {
          if (!open) setCollectionForAdd(null);
        }}
      />

      <RemoveProductFromCollectionModal
        collectionId={collectionId}
        product={productToRemove}
        onOpenChange={(open) => {
          if (!open) setProductToRemove(null);
        }}
      />
    </div>
  );
}

/**
 * The line under the collection name: the collection's own description, with
 * the loading and no-description cases spelled out so a request in flight never
 * reads as a collection that has no description.
 *
 * Deliberately says nothing about failure — the notice below already prints the
 * error, and repeating it here would show it twice.
 */
function describeCollection(
  collection: CollectionDto | undefined,
  isLoading: boolean
): string {
  if (isLoading) return "Loading collection details...";
  if (!collection) return "Collection details unavailable.";
  return collection.description?.trim() || "No description for this collection.";
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
