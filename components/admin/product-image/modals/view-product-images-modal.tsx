"use client";

import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaProductImageItem from "@/components/general/koa-product-image-item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductImageCollectionDto } from "@/types/product-image";

interface ViewProductImagesModalProps {
  product: ProductImageCollectionDto | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Read-only gallery of one product's images.
 *
 * Renders straight from the row the table already holds — no extra request —
 * which is why it takes the collection rather than a product id.
 */
export default function ViewProductImagesModal({
  product,
  onOpenChange,
}: ViewProductImagesModalProps) {
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
                Every image attached to this product.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 p-5">
              {product.images.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  This product has no images yet.
                </p>
              ) : (
                product.images.map((image) => (
                  <KoaProductImageItem key={image.id} image={image} />
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
