"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import KoaFormField from "@/components/general/koa-form-field";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";
import KoaSearchableSelect from "@/components/general/koa-searchable-select";
import ColorSwatch from "@/components/general/koa-color-badge";
import AvailableVariantSummary from "@/components/general/available-variant-summary";
import VariantAvailabilityIndicator from "@/components/general/variant-availability-indicator";
import { useActiveColors } from "@/features/color/hooks/use-colors";
import { useProductVariantMutations } from "@/features/product-variant/hooks/use-product-variant-mutations";
import { useVariantExists } from "@/features/product-variant/hooks/use-product-variants";
import type { ClothingSize } from "@/types/enums";
import { ClothingSizeEnum } from "@/types/enums";
import { clothingSizeLabels } from "@/types/enum-labels";
import {
  CreateProductVariantInputSchema,
  type ProductVariantsCollectionDto,
} from "@/types/product-variant";

/** Numeric enum values only (Object.values also returns the reverse-mapped names). */
const sizeOptions = Object.values(ClothingSizeEnum).filter(
  (value): value is ClothingSizeEnum => typeof value === "number"
);

type FormErrors = Record<string, string>;

interface CreateVariantModalProps {
  product: ProductVariantsCollectionDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function CreateVariantModal({
  product,
  onOpenChange,
}: CreateVariantModalProps) {
  const { data: activeColors } = useActiveColors();
  const { create } = useProductVariantMutations();

  const [selectedColorId, setSelectedColorId] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sku, setSku] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // Reset the form whenever a different product opens the modal.
  const [prevProduct, setPrevProduct] = useState<ProductVariantsCollectionDto | null>(product);
  if (product && prevProduct !== product) {
    setPrevProduct(product);
    setSelectedColorId("");
    setSelectedSize("");
    setSku("");
    setErrors({});
  }

  const colorOptions = (activeColors ?? []).map((color) => ({
    value: color.id,
    label: color.name,
  }));

  const selectedColor = activeColors?.find((color) => color.id === selectedColorId);
  const size = selectedSize ? (Number(selectedSize) as ClothingSize) : null;

  const hasBothSelected = !!selectedColorId && size != null;

  const { data: existsResponse, isFetching: isCheckingExists } = useVariantExists(
    product?.id ?? "",
    selectedColorId,
    size
  );

  const isAvailable =
    hasBothSelected && !isCheckingExists && existsResponse?.isExist === false;

  const canCreate =
    !!product && hasBothSelected && !isCheckingExists && existsResponse?.isExist === false && sku.trim().length > 0;

  const handleCreate = () => {
    if (!product) return;
    const result = CreateProductVariantInputSchema.safeParse({
      colorId: selectedColorId,
      size,
      sku,
    });
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    create.mutate(
      { productId: product.id, ...result.data },
      { onSuccess: () => onOpenChange(false) }
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
          <DialogTitle>Add variant</DialogTitle>
          <DialogDescription>
            {product
              ? `Create a new size/color variant for "${product.name}".`
              : "Create a new size/color variant."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          {product && <AvailableVariantSummary product={product} />}

          <div className="grid gap-4 sm:grid-cols-[3fr_1fr]">
            <div className="flex flex-col gap-2">
              <Label>Color</Label>
              <div className="flex items-center gap-2">
                <KoaSearchableSelect
                  className="flex-1"
                  value={selectedColorId}
                  onValueChange={setSelectedColorId}
                  options={colorOptions}
                  placeholder="Select a color..."
                  emptyText="No colors found."
                />
                {selectedColor && (
                  <div
                    className="flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-2"
                    title={selectedColor.name}
                  >
                    <ColorSwatch color={selectedColor} className="size-5" />
                    <span className="text-xs text-muted-foreground">
                      {selectedColor.hexCode
                        ? `#${selectedColor.hexCode}`
                        : selectedColor.swatchImageUrl
                          ? "Image swatch"
                          : "No swatch"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="variant-size">Size</Label>
              <Select
                value={selectedSize}
                onValueChange={(value) => setSelectedSize(value ?? "")}
              >
                <SelectTrigger id="variant-size" className="w-full">
                  <SelectValue placeholder="Select a size">
                    {(value) =>
                      value
                        ? clothingSizeLabels[Number(value) as ClothingSizeEnum]
                        : "Select a size"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {clothingSizeLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasBothSelected && (
            <VariantAvailabilityIndicator
              color={selectedColor ?? null}
              size={size}
              isChecking={isCheckingExists}
              isExist={existsResponse?.isExist ?? null}
              existingSku={existsResponse?.variant?.sku}
            />
          )}

          {isAvailable && (
            <KoaFormField
              label="SKU"
              id="variant-sku"
              placeholder="e.g. KOA-001-XS-BLK"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              error={errors.sku}
            />
          )}
        </div>

        <DialogFooter className="border-t">
          <KoaModalCancelButton
            onClick={() => onOpenChange(false)}
            disabled={create.isPending}
          />
          <KoaModalSaveButton
            onClick={handleCreate}
            isPending={create.isPending}
            disabled={!canCreate}
            label="Create variant"
            loadingLabel="Creating..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}