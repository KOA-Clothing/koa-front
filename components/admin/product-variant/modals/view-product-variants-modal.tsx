"use client";

import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaProductVariantItem from "@/components/general/koa-product-variant-item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ProductVariantDto,
  ProductVariantsCollectionDto,
} from "@/types/product-variant";

interface ViewProductVariantsModalProps {
  product: ProductVariantsCollectionDto | null;
  onOpenChange: (open: boolean) => void;
  toggleActiveStatus: (variant: ProductVariantDto) => void;
  onRemove: (variant: ProductVariantDto) => void;
}

export default function ViewProductVariantsModal({
  product,
  onOpenChange,
  toggleActiveStatus,
  onRemove,
}: ViewProductVariantsModalProps) {
  return (
    <Dialog
      open={!!product}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl gap-0 overflow-y-auto p-0">
        {product && (
          <>
            <DialogHeader className="border-b p-5">
              <DialogTitle>{product.name}</DialogTitle>
              <DialogDescription>
                All size/color variants of this product.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 p-5">
              {product.variants.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  This product has no variants yet.
                </p>
              ) : (
                product.variants.map((variant) => (
                  <KoaProductVariantItem
                    key={variant.id}
                    variant={variant}
                    onToggleActive={toggleActiveStatus}
                    onRemove={onRemove}
                  />
                ))
              )}
            </div>

            <DialogFooter className="border-t p-5">
              <KoaModalCancelButton onClick={() => onOpenChange(false)}>
                Close
              </KoaModalCancelButton>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}