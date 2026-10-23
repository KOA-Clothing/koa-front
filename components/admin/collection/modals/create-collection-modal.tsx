"use client";

import { useRef, useState } from "react";
import {
  CollectionFormInput,
  CollectionFormInputSchema,
  emptyCollectionForm,
} from "@/types/collection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import KoaFormField from "@/components/general/koa-form-field";
import { useCollectionMutations } from "@/features/collection/hooks/use-collection-mutations";
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

interface CreateCollectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCollectionModal({
  open,
  onOpenChange,
}: CreateCollectionModalProps) {
  const { create, requestCoverUpload } = useCollectionMutations();

  const [form, setForm] = useState<CollectionFormInput>(emptyCollectionForm);
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
    setForm(emptyCollectionForm);
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
   * own selection outside React state — that is what kept showing the previous
   * cover after the modal was reopened.
   */
  const resetForm = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    clearFields();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /** Closes through the parent, which owns `open`. */
  const handleClose = () => onOpenChange(false);

  // Reset on the open transition too, so the first frame an admin sees is
  // already empty even if a close was interrupted. `setPrevOpen` has to run on
  // *both* transitions: leaving it on `true` after a close made this guard
  // false on every later open, which is why the previously created collection
  // kept reappearing in a fresh dialog.
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) clearFields();
  }

  const handleFieldChange = <K extends keyof CollectionFormInput>(
    field: K,
    value: CollectionFormInput[K]
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
    const result = CollectionFormInputSchema.safeParse(form);
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

    let imageUrl: string | null = null;
    if (file) {
      try {
        setIsUploading(true);
        const { uploadUrl, publicUrl } = await requestCoverUpload(file);
        await uploadFileToPresignedUrl(uploadUrl, file);
        imageUrl = publicUrl;
      } catch (error) {
        toast.error(getErrorMessage(error));
        setIsUploading(false);
        return;
      }
    }

    create.mutate(
      {
        ...result.data,
        imageUrl,
      },
      {
        onSuccess: () => {
          setIsUploading(false);
          handleClose();
        },
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
          <DialogTitle>Add collection</DialogTitle>
          <DialogDescription>
            Group products into a curated collection shown on the shop front.
            Optionally attach a cover image for the collection card.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          <KoaFormField
            label="Name"
            id="collection-name"
            placeholder="e.g. Active Wear"
            value={form.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            error={errors.name}
          />

          <KoaTextArea
            label="Description"
            id="collection-description"
            rows={3}
            placeholder="Brief description of the collection..."
            value={form.description ?? ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            error={errors.description}
          />

          <KoaImageInput
            label="Cover image"
            file={file}
            previewUrl={previewUrl}
            error={fileError}
            maxSizeMB={MAX_SIZE_MB}
            fileInputRef={fileInputRef}
            onChange={handleFileSelect}
            onRemove={handleRemoveFile}
            accept="image/jpeg,image/png,image/webp,image/gif"
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
            label="Create collection"
            loadingLabel="Creating..."
            uploadingLabel="Uploading..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
