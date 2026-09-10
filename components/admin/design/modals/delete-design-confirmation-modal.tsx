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
import { useDesignMutations } from "@/features/design/hooks/use-design-mutations";
import type { DesignDto } from "@/types/design";

interface DeleteDesignConfirmationModalProps {
  design: DesignDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteDesignConfirmationModal({
  design,
  onOpenChange,
}: DeleteDesignConfirmationModalProps) {
  const { remove } = useDesignMutations();

  const handleConfirm = () => {
    if (design) {
      remove.mutate(design.id, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={!!design} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete design</DialogTitle>
          <DialogDescription>
            {design
              ? `Are you sure you want to delete "${design.name}"? This action cannot be undone.`
              : "Are you sure you want to delete this design? This action cannot be undone."}
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