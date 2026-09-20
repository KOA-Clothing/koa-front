"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { useActiveDesigns } from "@/features/design/hooks/use-designs";
import { useProductMutations } from "@/features/product/hooks/use-product-mutations";
import KoaLinkedDesignItem from "@/components/general/koa-linked-design-item";
import KoaSearchableSelect from "@/components/general/koa-searchable-select";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import type { DesignDto } from "@/types/design";
import type { ProductDto } from "@/types/product";

interface ManageLinkedDesignsModalProps {
  product: ProductDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function ManageLinkedDesignsModal({
  product,
  onOpenChange,
}: ManageLinkedDesignsModalProps) {
  const { data: activeDesigns } = useActiveDesigns();
  const { linkDesign, unlinkDesign } = useProductMutations();

  const [selectedDesignId, setSelectedDesignId] = useState("");
  const [prevProduct, setPrevProduct] = useState<ProductDto | null>(product);
  const [linkedDesigns, setLinkedDesigns] = useState<DesignDto[]>(
    product?.designs ?? []
  );

  if (product && prevProduct !== product) {
    setPrevProduct(product);
    setSelectedDesignId("");
    setLinkedDesigns(product.designs ?? []);
  }

  const linkedIds = useMemo(
    () => new Set(linkedDesigns.map((design) => design.id)),
    [linkedDesigns]
  );

  // Active designs that are not already linked to this product.
  const options = useMemo(
    () =>
      (activeDesigns ?? [])
        .filter((design) => !linkedIds.has(design.id))
        .map((design) => ({ value: design.id, label: design.name })),
    [activeDesigns, linkedIds]
  );

  const isPending = linkDesign.isPending || unlinkDesign.isPending;

  const handleRemove = (designId: string) => {
    if (!product) return;
    unlinkDesign.mutate(
      { productId: product.id, designId },
      {
        onSuccess: () => {
          setLinkedDesigns((prev) => prev.filter((design) => design.id !== designId));
        },
      }
    );
  };

  const handleLinkDesign = () => {
    if (!selectedDesignId || !product) return;
    const design = activeDesigns?.find((item) => item.id === selectedDesignId);
    if (!design) return;
    linkDesign.mutate(
      { productId: product.id, designId: selectedDesignId },
      {
        onSuccess: () => {
          setLinkedDesigns((prev) => [...prev, design]);
          setSelectedDesignId("");
        },
      }
    );
  };

  return (
    <Dialog
      open={!!product}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Manage linked designs</DialogTitle>
          <DialogDescription>
            {product
              ? `Link or unlink designs to "${product.name}".`
              : "Link or unlink designs to this product."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          <div className="flex items-center gap-2">
            <KoaSearchableSelect
              value={selectedDesignId}
              onValueChange={setSelectedDesignId}
              options={options}
              placeholder="Select a design..."
              emptyText="No designs found."
            />
            <Button
              onClick={handleLinkDesign}
              disabled={!selectedDesignId || isPending}
              className="h-8 shrink-0 gap-1.5"
            >
              <Link2 className="size-3.5" />
              Link Design
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {linkedDesigns.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No designs linked to this product yet.
              </p>
            ) : (
              linkedDesigns.map((design) => (
                <KoaLinkedDesignItem
                  key={design.id}
                  design={design}
                  disabled={isPending}
                  onRemove={(item) => handleRemove(item.id)}
                />
              ))
            )}
          </div>
        </div>

        <DialogFooter className="border-t">
          <KoaModalCancelButton onClick={() => onOpenChange(false)} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}