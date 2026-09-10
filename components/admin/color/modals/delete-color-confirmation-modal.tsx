"use client";

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
import { useColorMutations } from "@/features/color/hooks/use-color-mutations";
import type { ColorDto } from "@/types/color";

interface DeleteColorConfirmationModalProps {
  color: ColorDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteColorConfirmationModal({
  color,
  onOpenChange,
}: DeleteColorConfirmationModalProps) {
  const { remove } = useColorMutations();

  const handleConfirm = () => {
    if (color) {
      remove.mutate(color.id, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={!!color} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete color</DialogTitle>
          <DialogDescription>
            {color
              ? `Are you sure you want to delete "${color.name}"? This action cannot be undone.`
              : "Are you sure you want to delete this color? This action cannot be undone."}
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