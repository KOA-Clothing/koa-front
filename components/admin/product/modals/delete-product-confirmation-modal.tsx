"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";
import { useProductMutations } from "@/features/product/hooks/use-product-mutations";
import type { ProductDto } from "@/types/product";

interface DeleteProductConfirmationModalProps {
  product: ProductDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteProductConfirmationModal({
  product,
  onOpenChange,
}: DeleteProductConfirmationModalProps) {
  const { remove } = useProductMutations();

  const handleConfirm = () => {
    if (product) {
      remove.mutate(product.id, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete product</DialogTitle>
          <DialogDescription>
            {product
              ? `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
              : "Are you sure you want to delete this product? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <KoaModalCancelButton
            onClick={() => onOpenChange(false)}
            disabled={remove.isPending}
          />
          <KoaModalSaveButton
            variant="destructive"
            onClick={handleConfirm}
            isPending={remove.isPending}
            label="Confirm"
            loadingLabel="Deleting..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}