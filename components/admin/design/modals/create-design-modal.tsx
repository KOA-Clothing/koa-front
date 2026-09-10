"use client";

import { useState } from "react";
import {
  DesignFormInput,
  DesignFormInputSchema,
  emptyDesignForm,
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

type FormErrors = Record<string, string>;

interface CreateDesignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateDesignModal({
  open,
  onOpenChange,
}: CreateDesignModalProps) {
  const { create } = useDesignMutations();

  const [form, setForm] = useState<DesignFormInput>(emptyDesignForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [prevOpen, setPrevOpen] = useState(open);

  if (open && prevOpen !== open) {
    setPrevOpen(open);
    setForm(emptyDesignForm);
    setErrors({});
  }

  const handleFieldChange = <K extends keyof DesignFormInput>(
    field: K,
    value: DesignFormInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
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

    create.mutate(result.data, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Add design</DialogTitle>
          <DialogDescription>
            Add a new design for apparel items.
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
            onClick={() => onOpenChange(false)}
            disabled={create.isPending}
          />
          <KoaModalSaveButton
            onClick={handleSubmit}
            isPending={create.isPending}
            label="Create design"
            loadingLabel="Creating..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}