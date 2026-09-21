"use client";

import ColorSwatch from "@/components/general/koa-color-badge";
import KoaBoolBadge from "@/components/general/koa-bool-badge";
import KoaEnumBadge from "@/components/general/koa-enum-badge";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { clothingSizeBadgeStyles } from "@/lib/configs/enum-badge-styles";
import { clothingSizeLabels } from "@/types/enum-labels";
import { ProductVariantsCollectionDto } from "@/types/product-variant";

interface ViewProductVariantsModalProps {
  product: ProductVariantsCollectionDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function ViewProductVariantsModal({
  product,
  onOpenChange,
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
                  <div
                    key={variant.id}
                    className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4"
                  >
                    <div className="flex items-center gap-3">
                      <ColorSwatch color={variant.color} className="size-8" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-foreground">
                          {variant.color.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <KoaEnumBadge
                            labels={clothingSizeLabels}
                            value={variant.size}
                            styles={clothingSizeBadgeStyles}
                          />
                          <code className="font-mono text-xs text-muted-foreground">
                            {variant.sku}
                          </code>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <KoaBoolBadge active={variant.isActive} label="Active" />
                      <span className="text-xs text-muted-foreground">
                        Created{" "}
                        {new Date(variant.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
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