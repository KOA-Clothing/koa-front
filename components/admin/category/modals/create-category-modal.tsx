"use client";

import { useRef, useState } from "react";
import {
  CategoryFormInput,
  CategoryFormInputSchema,
  emptyCategoryForm,
} from "@/types/category";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import KoaFormField from "@/components/general/koa-form-field";
import { useCategoryMutations } from "@/features/category/hooks/use-category-mutations";
import { uploadFileToPresignedUrl } from "@/lib/storage/direct-upload";
import { getErrorMessage } from "@/lib/api/errors";
import toast from "react-hot-toast";
import KoaTextArea from "@/components/general/koa-text-area";
import KoaImageInput from "@/components/general/koa-image-input";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";

type FormErrors = Record<string, string>;

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCategoryModal({
  open,
  onOpenChange,
}: CreateCategoryModalProps) {
  const { create, requestSizeGuideUpload } = useCategoryMutations();

  const [form, setForm] = useState<CategoryFormInput>(emptyCategoryForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [prevOpen, setPrevOpen] = useState(open);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * State-only factory reset: fields, validation errors, the picked file and
   * its preview. Safe to run while rendering, which is why the blob URL and the
   * native file input (both side effects) are handled in `resetForm` below.
   */
  const clearFields = () => {
    setForm(emptyCategoryForm);
    setErrors({});
    setFile(null);
    setPreviewUrl(null);
    setFileError(null);
    setIsUploading(false);
  };

  /**
   * Full reset, run once the dialog has finished closing. Revokes the preview
   * blob rather than just forgetting it (a leaked URL pins the file in memory
   * for the page's lifetime) and clears the native file input, which keeps its
   * own selection outside React state.
   */
  const resetForm = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    clearFields();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /** Closes through the parent, which owns `open`. */
  const handleClose = () => onOpenChange(false);

  // Reset on the open transition too, so the first frame an admin sees is
  // already empty. `setPrevOpen` has to run on *both* transitions: leaving it
  // on `true` after a close made this guard false on every later open, which
  // is why the previously entered category kept reappearing in a fresh dialog.
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) clearFields();
  }

  const handleFieldChange = <K extends keyof CategoryFormInput>(
    field: K,
    value: CategoryFormInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_SIZE_BYTES) {
      setFileError(`File must be ${MAX_SIZE_MB}MB or smaller.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFileError(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setFileError(null);
  };

  const isPending = isUploading || create.isPending;

  const handleSubmit = async () => {
    const result = CategoryFormInputSchema.safeParse(form);
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

    let sizeGuideUrl: string | null = null;
    if (file) {
      try {
        setIsUploading(true);
        const { uploadUrl, publicUrl } = await requestSizeGuideUpload(file);
        await uploadFileToPresignedUrl(uploadUrl, file);
        sizeGuideUrl = publicUrl;
      } catch (error) {
        toast.error(getErrorMessage(error));
        setIsUploading(false);
        return;
      }
    }

    create.mutate(
      {
        ...result.data,
        sizeGuideUrl,
      },
      {
        onSuccess: () => {
          setIsUploading(false);
          handleClose();
        },
        // Upload already finished by the time the request runs, so a failed
        // create must drop the uploading flag or `isPending` stays true and
        // the dialog can no longer be cancelled.
        onError: () => setIsUploading(false),
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      // Fires after the close animation, so the form never visibly blanks out
      // mid-fade. Covers every close path: Escape, backdrop, the close button,
      // Cancel and the post-create close.
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) resetForm();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Add category</DialogTitle>
          <DialogDescription>
            Add a new base category for apparel items. Optionally attach a size
            guide image.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          <KoaFormField
            label="Name"
            id="category-name"
            placeholder="e.g. T-Shirt"
            value={form.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            error={errors.name}
          />

          <KoaTextArea
            label="Description"
            id="category-description"
            rows={3}
            placeholder="Brief description of the category..."
            value={form.description ?? ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            error={errors.description}
          />

          <KoaImageInput
            label="Size guide image"
            file={file}
            previewUrl={previewUrl}
            error={fileError}
            maxSizeMB={MAX_SIZE_MB}
            fileInputRef={fileInputRef}
            onChange={handleFileSelect}
            onRemove={handleRemoveFile}
            accept="image/jpeg,image/png,image/webp,image/gif"
          />

          <KoaFormField
            label="Sort order"
            id="category-sort-order"
            type="number"
            placeholder="0"
            value={form.sortOrder}
            onChange={(e) => handleFieldChange("sortOrder", Number(e.target.value))}
            error={errors.sortOrder}
          />
        </div>

        <DialogFooter className="border-t">
          <KoaModalCancelButton 
            onClick={handleClose} 
            disabled={isPending} 
          />
          <KoaModalSaveButton
            onClick={handleSubmit}
            isPending={isPending}
            isUploading={isUploading}
            label="Create category"
            loadingLabel="Creating..."
            uploadingLabel="Uploading..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}