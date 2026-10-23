"use client";

import { useRef, useState } from "react";
import {
  CollectionFormInput,
  CollectionFormInputSchema,
  emptyCollectionForm,
  toCollectionForm,
  type CollectionDto,
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

interface EditCollectionModalProps {
  /**
   * The collection being edited, or `null` while the dialog is closed — the
   * subject doubles as the open flag (the delete confirmation next to it works
   * the same way), so the page holds one piece of state instead of two.
   */
  collection: CollectionDto | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Edits a collection's own record: name, description and cover image. Posts
 * `UpdateCollectionCommand` through `PATCH /api/v1/collections/{id}` — the
 * description is sent even when emptied, because clearing it is a real edit
 * (the validator allows blank; only `Name` is required).
 *
 * Mirrors `create-collection-modal`'s fields and cover-upload flow, and
 * `update-category-modal`'s subject-driven reset: the form is (re)seeded from
 * the collection during render whenever the subject changes, so reopening the
 * same collection after a cancel or a failed save shows the stored values
 * rather than the abandoned edits.
 */
export default function EditCollectionModal({
  collection,
  onOpenChange,
}: EditCollectionModalProps) {
  const { update, requestCoverUpload } = useCollectionMutations();

  const [form, setForm] = useState<CollectionFormInput>(emptyCollectionForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [prevCollectionId, setPrevCollectionId] = useState<string | null>(
    collection?.id ?? null
  );
  const [file, setFile] = useState<File | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compare the *id* rather than the object: closing sets the subject to null,
  // and TanStack hands the same cached object back on reopen, so an object
  // comparison would skip the reseed for exactly the reopen that needs one.
  const currentId = collection?.id ?? null;

  if (currentId !== prevCollectionId) {
    setPrevCollectionId(currentId);

    if (collection) {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setForm(toCollectionForm(collection));
      setErrors({});
      setFile(null);
      setBlobUrl(null);
      setFileError(null);
    }
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

    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setFileError(null);
    setFile(selected);
    setBlobUrl(URL.createObjectURL(selected));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = () => {
    if (file) {
      // A pending upload was dropped — the stored cover (if any) is still on
      // the form and comes back.
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setFile(null);
      setBlobUrl(null);
    } else {
      // No pending upload: removing is how an admin clears the existing cover,
      // which the save sends as `coverImageUrl: null`.
      setForm((prev) => ({ ...prev, imageUrl: null }));
    }
    setFileError(null);
  };

  const isPending = isUploading || update.isPending;

  const handleSubmit = async () => {
    if (!collection) return;

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

    let coverImageUrl: string | null = result.data.imageUrl ?? null;
    if (file) {
      try {
        setIsUploading(true);
        const { uploadUrl, publicUrl } = await requestCoverUpload(file);
        await uploadFileToPresignedUrl(uploadUrl, file);
        coverImageUrl = publicUrl;
      } catch (error) {
        toast.error(getErrorMessage(error));
        setIsUploading(false);
        return;
      }
    }

    update.mutate(
      {
        id: collection.id,
        payload: {
          name: result.data.name,
          description: result.data.description ?? null,
          coverImageUrl,
        },
      },
      {
        onSuccess: () => {
          setIsUploading(false);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog
      open={!!collection}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Edit collection</DialogTitle>
          <DialogDescription>
            Update this collection&apos;s details. Changing the cover image
            replaces the image the shop front shows for it.
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
            previewUrl={file ? blobUrl : form.imageUrl ?? null}
            existingUrl={form.imageUrl ?? null}
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
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          />
          <KoaModalSaveButton
            onClick={handleSubmit}
            isPending={isPending}
            isUploading={isUploading}
            label="Save changes"
            loadingLabel="Saving..."
            uploadingLabel="Uploading..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
