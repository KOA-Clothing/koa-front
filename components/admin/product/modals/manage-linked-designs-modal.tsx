"use client";

import { useState } from "react";
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
import KoaLinkedDesignItem from "@/components/general/koa-linked-design-item";
import KoaSearchableSelect from "@/components/general/koa-searchable-select";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
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
  const [selectedDesignId, setSelectedDesignId] = useState("");
  const [prevProduct, setPrevProduct] = useState<ProductDto | null>(product);

  if (product && prevProduct !== product) {
    setPrevProduct(product);
    setSelectedDesignId("");
  }

  const linkedDesigns = product?.designs ?? [];
  const options = (activeDesigns ?? []).map((design) => ({
    value: design.id,
    label: design.name,
  }));

  const handleRemove = (designId: string) => {
    console.log("Unlink design", designId);
  };

  const handleLinkDesign = () => {
    if (!selectedDesignId) return;
    console.log("Link design", selectedDesignId);
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
              disabled={!selectedDesignId}
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