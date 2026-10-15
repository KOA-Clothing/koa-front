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
  SetLowStockThresholdInputSchema,
  type InventoryDto,
} from "@/types/inventory";
import { X } from "lucide-react";

type FormErrors = Record<string, string>;

interface SetLowStockThresholdModalProps {
  item: InventoryDto | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Threshold editor for one inventory row. Unlike the add-stock modal this is a
 * *set* (`PATCH /inventory/{id}`), so the field is prefilled with the stored
 * threshold and can be lowered as well as raised. `null` on the DTO means the
 * threshold has never been set, which starts the field empty.
 */
export default function SetLowStockThresholdModal({
  item,
  onOpenChange,
}: SetLowStockThresholdModalProps) {
  const { setLowStockThreshold } = useInventoryMutations();

  const [threshold, setThreshold] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // Reset and prefill whenever a different row opens the modal (and on close).
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
    setThreshold(
      item?.lowStockThreshold != null ? String(item.lowStockThreshold) : ""
    );
    setErrors({});
  }

  const handleSubmit = () => {
    if (!item) return;

    const result = SetLowStockThresholdInputSchema.safeParse({
      lowStockThreshold: threshold,
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
    setLowStockThreshold.mutate(
      {
        inventoryId: item.id,
        lowStockThreshold: result.data.lowStockThreshold,
      },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  const currentThreshold = item?.lowStockThreshold ?? null;

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Set low stock threshold</DialogTitle>
          <DialogDescription>
            {item
              ? `Choose the stock level that flags this variant of "${item.productName}" as running low.`
              : "Choose the stock level that flags a variant as running low."}
          </DialogDescription>
        </DialogHeader>

        {item && (
          <div className="flex flex-col gap-4 px-5">
            {/* Which variant is being edited — the color/size pairing is the
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
                <p className="text-xs text-muted-foreground">
                  Current threshold
                </p>
                {/* `null` is "not configured" — print it as such rather than as
                    0, which would read as "alert me at zero". */}
                <p className="text-lg font-medium">
                  {currentThreshold === null ? "Not set" : currentThreshold}
                </p>
              </div>
            </div>

            <KoaFormField
              label="Low stock threshold"
              id="low-stock-threshold"
              type="number"
              min={0}
              step="1"
              inputMode="numeric"
              placeholder="e.g. 5"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              error={errors.lowStockThreshold}
            />

            <p className="-mt-2 text-xs text-muted-foreground">
              The variant is flagged as low stock when its quantity falls to this
              level or below.
            </p>
          </div>
        )}

        <DialogFooter className="border-t">
          <KoaModalCancelButton
            onClick={() => onOpenChange(false)}
            disabled={setLowStockThreshold.isPending}
          />
          <KoaModalSaveButton
            onClick={handleSubmit}
            isPending={setLowStockThreshold.isPending}
            disabled={!item || threshold.trim() === ""}
            label="Save"
            loadingLabel="Saving..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
