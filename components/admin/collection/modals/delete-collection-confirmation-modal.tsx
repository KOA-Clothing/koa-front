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
import { useCollectionMutations } from "@/features/collection/hooks/use-collection-mutations";
import type { CollectionDto } from "@/types/collection";

interface DeleteCollectionConfirmationModalProps {
  collection: CollectionDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteCollectionConfirmationModal({
  collection,
  onOpenChange,
}: DeleteCollectionConfirmationModalProps) {
  const { remove } = useCollectionMutations();

  const handleConfirm = () => {
    if (collection) {
      remove.mutate(collection.id, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={!!collection} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete collection</DialogTitle>
          <DialogDescription>
            {collection
              ? `Are you sure you want to delete "${collection.name}"? The collection and its product links will be removed. This action cannot be undone.`
              : "Are you sure you want to delete this collection? This action cannot be undone."}
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
