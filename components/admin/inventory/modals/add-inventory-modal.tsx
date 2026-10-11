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
import ColorSwatch from "@/components/general/koa-color-badge";
import KoaEnumBadge from "@/components/general/koa-enum-badge";
import KoaFormField from "@/components/general/koa-form-field";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";
import { useInventoryMutations } from "@/features/inventory/hooks/use-inventory-mutations";
import { clothingSizeBadgeStyles } from "@/lib/configs/enum-badge-styles";
import { clothingSizeLabels } from "@/types/enum-labels";
import {
  AddInventoryInputSchema,
  type InventoryDto,
} from "@/types/inventory";
import { X } from "lucide-react";

type FormErrors = Record<string, string>;

interface AddInventoryModalProps {
  item: InventoryDto | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Restock modal for one inventory row. The backend endpoint is additive
 * (`PATCH /inventory/{id}/add`), so this collects the amount to *add* rather
 * than the new absolute level, and previews the resulting on-hand count.
 */
export default function AddInventoryModal({
  item,
  onOpenChange,
}: AddInventoryModalProps) {
  const { addInventory } = useInventoryMutations();

  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // Reset the form whenever a different row opens the modal (and on close).
  // Compared by id rather than object reference so a background refetch — which
  // produces a new object for the same row — can't wipe input mid-edit.
  //
  // Normalize to `null` on BOTH sides of the comparison: `item?.id` is
  // `undefined` when closed, and `undefined !== null` would re-trigger the
  // render-phase `setState` on every pass (infinite re-render).
  const [prevItemId, setPrevItemId] = useState<string | null>(item?.id ?? null);
  const currentItemId = item?.id ?? null;
  if (currentItemId !== prevItemId) {
    setPrevItemId(currentItemId);
    setQuantity("");
    setErrors({});
  }

  const handleSubmit = () => {
    if (!item) return;

    const result = AddInventoryInputSchema.safeParse({ quantity });
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
    addInventory.mutate(
      { inventoryId: item.id, quantity: result.data.quantity },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  // Live preview of the new on-hand level so the admin sees the outcome before
  // committing. Only meaningful once the entry is a valid positive integer.
  const added = Number(quantity);
  const nextQuantity =
    item && Number.isInteger(added) && added > 0 ? item.quantity + added : null;

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Add inventory</DialogTitle>
          <DialogDescription>
            {item
              ? `Increase the stock level for this variant of "${item.productName}".`
              : "Increase the stock level for this variant."}
          </DialogDescription>
        </DialogHeader>

        {item && (
          <div className="flex flex-col gap-4 px-5">
            {/* Which variant is being restocked — the color/size pairing is the
                identity the admin recognises from the table. */}
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <ColorSwatch color={item.variant.color} className="size-8" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {item.productName}
                </p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {item.variant.sku}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="text-sm">{item.variant.color.name}</span>
                <X className="size-3 text-muted-foreground" aria-hidden="true" />
                <KoaEnumBadge
                  labels={clothingSizeLabels}
                  value={item.variant.size}
                  styles={clothingSizeBadgeStyles}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Current stock</p>
                <p className="text-lg font-medium">{item.quantity}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Reserved</p>
                <p className="text-lg font-medium">{item.reservedQuantity}</p>
              </div>
            </div>

            <KoaFormField
              label="Quantity to add"
              id="add-inventory-quantity"
              type="number"
              min={1}
              step="1"
              inputMode="numeric"
              placeholder="e.g. 25"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              error={errors.quantity}
            />

            {nextQuantity !== null && (
              <p className="-mt-2 text-xs text-muted-foreground">
                New stock level will be{" "}
                <span className="font-medium text-foreground">
                  {nextQuantity}
                </span>
                .
              </p>
            )}
          </div>
        )}

        <DialogFooter className="border-t">
          <KoaModalCancelButton
            onClick={() => onOpenChange(false)}
            disabled={addInventory.isPending}
          />
          <KoaModalSaveButton
            onClick={handleSubmit}
            isPending={addInventory.isPending}
            disabled={!item || quantity.trim() === ""}
            label="Add"
            loadingLabel="Adding..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
