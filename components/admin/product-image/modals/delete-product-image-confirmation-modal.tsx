"use client";

import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";
import { useProductImageMutations } from "@/features/product-image/hooks/use-product-image-mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProductImageDto } from "@/types/product-image";

interface DeleteProductImageConfirmationModalProps {
  /** The image to delete, or `null` when closed. Drives `open` — as elsewhere. */
  image: ProductImageDto | null;
  onOpenChange: (open: boolean) => void;
  /** Called right after the deletion succeeds (e.g. to clear the card's state). */
  onDeleted?: (image: ProductImageDto) => void;
}

/**
 * Confirms deletion of a single product image.
 *
 * A confirmation is not optional here the way it is for a colour or a category:
 * deleting an image drops the database row, and nothing on the admin side can put
 * it back — re-uploading produces a *new* image with a new id, a new URL, and a
 * new position in the gallery. There is no undo, so the dialog says so.
 *
 * The primary case gets its own sentence, because the backend promotes another
 * image in the same call: the admin is told that a replacement takes over, rather
 * than left to assume the product has lost its cart image and go hunting for
 * another. Never describes *which* image gets promoted — the server picks, and
 * naming a specific shot here would be a promise the dialog can't keep.
 *
 * A product's only image is undeletable (the server refuses it, and the card's
 * delete button is disabled), so the "no images would remain" case can't be
 * reached through this dialog.
 */
export default function DeleteProductImageConfirmationModal({
  image,
  onOpenChange,
  onDeleted,
}: DeleteProductImageConfirmationModalProps) {
  const { remove } = useProductImageMutations();

  const handleConfirm = () => {
    if (!image) return;
    remove.mutate(
      { productId: image.productId, productImageId: image.id },
      {
        onSuccess: () => {
          onOpenChange(false);
          onDeleted?.(image);
        },
      }
    );
  };

  return (
    <Dialog open={!!image} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete image</DialogTitle>
          <DialogDescription>
            {image?.isPrimary
              ? "This is the product's primary image — the one the shop-front shows in the cart. Deleting it cannot be undone, and another of this product's images will be promoted to primary."
              : "Are you sure you want to delete this image? This action cannot be undone."}
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
