"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";
import KoaSearchableSelect from "@/components/general/koa-searchable-select";
import { useActiveCategories } from "@/features/category/hooks/use-categories";
import { useCollectionMutations } from "@/features/collection/hooks/use-collection-mutations";
import { useProductsByCategory } from "@/features/product/hooks/use-products";

interface AddProductModalProps {
  /**
   * The collection to add a product to, or `null` while the dialog is closed —
   * the subject doubles as the open flag, like the edit and delete dialogs next
   * to it. Structural (`id` + `name`) rather than `CollectionDto` so the page
   * passes the object it already holds unreshaped; nothing else is read here.
   */
  collection: { id: string; name: string } | null;
  /**
   * Products already linked to the collection. Hidden from the picker because
   * the endpoint is idempotent: linking one twice returns the existing row and
   * reports success, which would toast "added" for a no-op.
   */
  excludeProductIds?: readonly string[];
  onOpenChange: (open: boolean) => void;
}

/**
 * Adds one existing product to a collection, in two dependent steps:
 * category → product.
 *
 * The category list is `/categories/all-active` and drives the product list
 * (`PATCH /products/all/category/{id}`); both are selects rather than tables
 * because the admin is choosing exactly one product. The two are searchable —
 * a category can hold more products than fit in a plain dropdown.
 *
 * Neither list is fetched until it can actually be shown: categories only while
 * the dialog is open, products only once a category is chosen.
 */
export default function AddProductModal({
  collection,
  excludeProductIds = [],
  onOpenChange,
}: AddProductModalProps) {
  const { addItem } = useCollectionMutations();

  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");

  // Gated on the dialog being open — the page renders this component
  // unconditionally, and a page visit shouldn't pay for a list nobody opened.
  const categories = useActiveCategories({ enabled: !!collection });
  const products = useProductsByCategory(categoryId);

  const clearSelection = () => {
    setCategoryId("");
    setProductId("");
  };

  // Reset whenever a collection opens the dialog, tracking both transitions:
  // leaving `prevCollectionId` on the old id after a close made this guard false
  // on every later open in a sibling modal, which is what kept stale picks.
  const currentId = collection?.id ?? null;
  const [prevCollectionId, setPrevCollectionId] = useState<string | null>(currentId);

  if (currentId !== prevCollectionId) {
    setPrevCollectionId(currentId);
    if (currentId) clearSelection();
  }

  const categoryOptions = (categories.data ?? []).map((category) => ({
    value: category.id,
    label: category.name,
  }));

  // One Set per render is cheaper than one `includes` per product, and a
  // category's product list can be long.
  const alreadyInCollection = new Set(excludeProductIds);
  const productOptions = (products.data ?? [])
    .filter((product) => !alreadyInCollection.has(product.id))
    .map((product) => ({
      value: product.id,
      // The endpoint returns inactive products too — still addable, but worth
      // flagging: a deactivated product won't show on the storefront even
      // though it is linked to an active collection.
      label: product.isActive ? product.name : `${product.name} (inactive)`,
    }));

  const categoryEmptyText = categories.isLoading
    ? "Loading categories..."
    : categories.isError
      ? "Could not load categories."
      : "No active categories yet.";

  // Says *why* the list is what it is, so an empty dropdown never reads as a
  // broken one. "All already added" and "nothing to add" are different facts.
  const productEmptyText = !categoryId
    ? "Select a category first."
    : products.isLoading
      ? "Loading products..."
      : products.isError
        ? "Could not load products for this category."
        : (products.data?.length ?? 0) === 0
          ? "No products in this category yet."
          : "Every product in this category is already in this collection.";

  const handleClose = () => onOpenChange(false);

  const handleSubmit = () => {
    if (!collection || !productId) return;

    addItem.mutate(
      { collectionId: collection.id, productId },
      { onSuccess: handleClose }
    );
  };

  return (
    <Dialog
      open={!!collection}
      onOpenChange={onOpenChange}
      // Runs after the close animation, so Escape and the backdrop button clear
      // the picks the same way Cancel does.
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) clearSelection();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Add product</DialogTitle>
          <DialogDescription>
            {collection
              ? `Add a product to "${collection.name}". Pick its category first, then the product itself.`
              : "Add a product to this collection."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <KoaSearchableSelect
              value={categoryId}
              onValueChange={(value) => {
                setCategoryId(value);
                // A product from the previous category isn't a valid choice for
                // the new one, so the second select starts over.
                setProductId("");
              }}
              options={categoryOptions}
              placeholder="Select a category..."
              emptyText={categoryEmptyText}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Product</Label>
            <KoaSearchableSelect
              value={productId}
              onValueChange={setProductId}
              options={productOptions}
              placeholder={
                categoryId ? "Select a product..." : "Select a category first"
              }
              emptyText={productEmptyText}
            />
            <span className="text-xs text-muted-foreground">
              Products already in this collection are not listed.
            </span>
          </div>
        </div>

        <DialogFooter className="border-t">
          <KoaModalCancelButton
            onClick={handleClose}
            disabled={addItem.isPending}
          />
          <KoaModalSaveButton
            onClick={handleSubmit}
            isPending={addItem.isPending}
            disabled={!productId}
            label="Add product"
            loadingLabel="Adding..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
