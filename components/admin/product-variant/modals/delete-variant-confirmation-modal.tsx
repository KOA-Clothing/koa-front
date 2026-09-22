"use client";

import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";
import { useProductVariantMutations } from "@/features/product-variant/hooks/use-product-variant-mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProductVariantDto } from "@/types/product-variant";

interface DeleteVariantConfirmationModalProps {
  variant: ProductVariantDto | null;
  onOpenChange: (open: boolean) => void;
  /** Called right after the deletion succeeds (e.g. to sync local state). */
  onDeleted?: (variant: ProductVariantDto) => void;
}

export default function DeleteVariantConfirmationModal({
  variant,
  onOpenChange,
  onDeleted,
}: DeleteVariantConfirmationModalProps) {
  const { remove } = useProductVariantMutations();

  const handleConfirm = () => {
    if (variant) {
      remove.mutate(variant.id, {
        onSuccess: () => {
          onOpenChange(false);
          onDeleted?.(variant);
        },
      });
    }
  };

  return (
    <Dialog open={!!variant} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete variant</DialogTitle>
          <DialogDescription>
            {variant
              ? `Are you sure you want to delete the "${variant.color.name}" (${variant.sku}) variant? This action cannot be undone.`
              : "Are you sure you want to delete this variant? This action cannot be undone."}
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