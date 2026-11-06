"use client";

import { useRef, useState } from "react";
import {
  CategoryFormInput,
  CategoryFormInputSchema,
  emptyCategoryForm,
  toCategoryForm,
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
import type { CategoryDto } from "@/types/category";

type FormErrors = Record<string, string>;

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface UpdateCategoryModalProps {
  category: CategoryDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateCategoryModal({
  category,
  onOpenChange,
}: UpdateCategoryModalProps) {
  const { update, requestSizeGuideUpload } = useCategoryMutations();

  const [form, setForm] = useState<CategoryFormInput>(() =>
    category ? toCategoryForm(category) : emptyCategoryForm
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [prevCategoryId, setPrevCategoryId] = useState<string | null>(
    category?.id ?? null
  );
  const [file, setFile] = useState<File | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [existingGuideUrl, setExistingGuideUrl] = useState<string | null>(
    category?.sizeGuideUrl ?? null
  );
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * State-only reset, seeded from the category being edited. Safe to run while
   * rendering, which is why the blob URL and the native file input (both side
   * effects) are handled in `resetForm` below.
   */
  const clearFields = (source: CategoryDto | null) => {
    setForm(source ? toCategoryForm(source) : emptyCategoryForm);
    setErrors({});
    setFile(null);
    setBlobUrl(null);
    setExistingGuideUrl(source?.sizeGuideUrl ?? null);
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
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    clearFields(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /** Closes through the parent, which owns `category`. */
  const handleClose = () => onOpenChange(false);

  // Compare by id rather than object. Closing sets `category` to null and
  // TanStack hands the same cached object back on reopen, so an object
  // comparison skipped the reseed for exactly the reopen that needs one.
  // Id comparison also keeps a background refetch of the row being edited
  // from wiping the admin's input mid-edit.
  const currentCategoryId = category?.id ?? null;
  if (currentCategoryId !== prevCategoryId) {
    setPrevCategoryId(currentCategoryId);
    if (category) clearFields(category);
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

    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setFileError(null);
    setFile(selected);
    setBlobUrl(URL.createObjectURL(selected));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = () => {
    if (file) {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setFile(null);
      setBlobUrl(null);
    } else {
      setExistingGuideUrl(null);
    }
    setFileError(null);
  };

  const isPending = isUploading || update.isPending;

  const handleSubmit = async () => {
    if (!category) return;

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

    let sizeGuideUrl: string | null = existingGuideUrl;
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

    update.mutate(
      {
        id: category.id,
        payload: {
          ...result.data,
          sizeGuideUrl,
        },
      },
      {
        onSuccess: () => {
          setIsUploading(false);
          handleClose();
        },
        // Upload already finished by the time the request runs, so a failed
        // update must drop the uploading flag or `isPending` stays true and
        // the dialog can no longer be cancelled.
        onError: () => setIsUploading(false),
      }
    );
  };

  return (
    <Dialog
      open={!!category}
      onOpenChange={onOpenChange}
      // Fires after the close animation, so the form never visibly blanks out
      // mid-fade. Covers every close path: Escape, backdrop, the close button,
      // Cancel and the post-update close.
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) resetForm();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Update category</DialogTitle>
          <DialogDescription>
            Edit the details of this category.
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
            previewUrl={file ? blobUrl : existingGuideUrl}
            existingUrl={existingGuideUrl}
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
            label="Update category"
            loadingLabel="Updating..."
            uploadingLabel="Uploading..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}