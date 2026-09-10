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
import { useCategoryMutations } from "@/features/category/hooks/use-category-mutations";
import type { CategoryDto } from "@/types/category";

interface DeleteCategoryConfirmationModalProps {
  category: CategoryDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteCategoryConfirmationModal({
  category,
  onOpenChange,
}: DeleteCategoryConfirmationModalProps) {
  const { remove } = useCategoryMutations();

  const handleConfirm = () => {
    if (category) {
      remove.mutate(category.id, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={!!category} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete category</DialogTitle>
          <DialogDescription>
            {category
              ? `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
              : "Are you sure you want to delete this category? This action cannot be undone."}
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