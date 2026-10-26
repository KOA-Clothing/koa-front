"use client";

import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";
import { useCollectionMutations } from "@/features/collection/hooks/use-collection-mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProductDto } from "@/types/product";

interface RemoveProductFromCollectionModalProps {
  collectionId: string | null;
  product: ProductDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function RemoveProductFromCollectionModal({
  collectionId,
  product,
  onOpenChange,
}: RemoveProductFromCollectionModalProps) {
  const { removeItem } = useCollectionMutations();

  const handleConfirm = () => {
    if (collectionId && product) {
      removeItem.mutate(
        { collectionId, productId: product.id },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    }
  };

  return (
    <Dialog open={!!collectionId && !!product} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove product</DialogTitle>
          <DialogDescription>
            {product
              ? `Are you sure you want to remove "${product.name}" from this collection? This action cannot be undone.`
              : "Are you sure you want to remove this product from this collection? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <KoaModalCancelButton
            onClick={() => onOpenChange(false)}
            disabled={removeItem.isPending}
          />
          <KoaModalSaveButton
            variant="destructive"
            onClick={handleConfirm}
            isPending={removeItem.isPending}
            label="Remove"
            loadingLabel="Removing..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
