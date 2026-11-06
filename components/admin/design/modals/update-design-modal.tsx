"use client";

import { useState } from "react";
import {
  DesignFormInput,
  DesignFormInputSchema,
  emptyDesignForm,
  toDesignForm,
} from "@/types/design";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import KoaFormField from "@/components/general/koa-form-field";
import KoaTextArea from "@/components/general/koa-text-area";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";
import { useDesignMutations } from "@/features/design/hooks/use-design-mutations";
import type { DesignDto } from "@/types/design";

type FormErrors = Record<string, string>;

interface UpdateDesignModalProps {
  design: DesignDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateDesignModal({
  design,
  onOpenChange,
}: UpdateDesignModalProps) {
  const { update } = useDesignMutations();

  const [form, setForm] = useState<DesignFormInput>(() =>
    design ? toDesignForm(design) : emptyDesignForm
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [prevDesignId, setPrevDesignId] = useState<string | null>(
    design?.id ?? null
  );

  const clearFields = (source: DesignDto | null) => {
    setForm(source ? toDesignForm(source) : emptyDesignForm);
    setErrors({});
  };

  /** Closes through the parent, which owns `design`. */
  const handleClose = () => onOpenChange(false);

  // Compare by id rather than object. Closing sets `design` to null and
  // TanStack hands the same cached object back on reopen, so an object
  // comparison skipped the reseed for exactly the reopen that needs one.
  // Id comparison also keeps a background refetch of the row being edited
  // from wiping the admin's input mid-edit.
  const currentDesignId = design?.id ?? null;
  if (currentDesignId !== prevDesignId) {
    setPrevDesignId(currentDesignId);
    if (design) clearFields(design);
  }

  const handleFieldChange = <K extends keyof DesignFormInput>(
    field: K,
    value: DesignFormInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!design) return;

    const result = DesignFormInputSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    update.mutate(
      {
        id: design.id,
        payload: result.data,
      },
      {
        onSuccess: handleClose,
      }
    );
  };

  return (
    <Dialog
      open={!!design}
      onOpenChange={onOpenChange}
      // Reset after the close animation, so the form never blanks mid-fade.
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) clearFields(null);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Update design</DialogTitle>
          <DialogDescription>
            Edit the details of this design.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          <KoaFormField
            label="Name"
            id="design-name"
            placeholder="e.g. Floral Print"
            value={form.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            error={errors.name}
          />

          <KoaTextArea
            label="Description"
            id="design-description"
            rows={3}
            placeholder="Brief description of the design..."
            value={form.description ?? ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            error={errors.description}
          />
        </div>

        <DialogFooter className="border-t">
          <KoaModalCancelButton
            onClick={handleClose}
            disabled={update.isPending}
          />
          <KoaModalSaveButton
            onClick={handleSubmit}
            isPending={update.isPending}
            label="Update design"
            loadingLabel="Updating..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}