"use client";

import { useRef, useState } from "react";
import {
  ColorFormInput,
  ColorFormInputSchema,
  emptyColorForm,
  toColorForm,
} from "@/types/color";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import KoaFormField from "@/components/general/koa-form-field";
import KoaHexCodeInput from "@/components/general/koa-hex-code-input";
import { useColorMutations } from "@/features/color/hooks/use-color-mutations";
import { uploadFileToPresignedUrl } from "@/lib/storage/direct-upload";
import { getErrorMessage } from "@/lib/api/errors";
import toast from "react-hot-toast";
import KoaImageInput from "@/components/general/koa-image-input";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";
import type { ColorDto } from "@/types/color";

type FormErrors = Record<string, string>;

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface UpdateColorModalProps {
  color: ColorDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateColorModal({
  color,
  onOpenChange,
}: UpdateColorModalProps) {
  const { update, requestSwatchImageUpload } = useColorMutations();

  const [form, setForm] = useState<ColorFormInput>(emptyColorForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [prevColor, setPrevColor] = useState<ColorDto | null>(color);
  const [file, setFile] = useState<File | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [existingSwatchUrl, setExistingSwatchUrl] = useState<string | null>(
    color?.swatchImageUrl ?? null
  );
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (color && prevColor !== color) {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setPrevColor(color);
    setForm(toColorForm(color));
    setErrors({});
    setFile(null);
    setBlobUrl(null);
    setExistingSwatchUrl(color.swatchImageUrl ?? null);
    setFileError(null);
  }

  const handleFieldChange = <K extends keyof ColorFormInput>(
    field: K,
    value: ColorFormInput[K]
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
      setExistingSwatchUrl(null);
    }
    setFileError(null);
  };

  const isPending = isUploading || update.isPending;

  const handleSubmit = async () => {
    if (!color) return;

    const result = ColorFormInputSchema.safeParse(form);
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

    let swatchImageUrl: string | null = existingSwatchUrl;
    if (file) {
      try {
        setIsUploading(true);
        const { uploadUrl, publicUrl } = await requestSwatchImageUpload(file);
        await uploadFileToPresignedUrl(uploadUrl, file);
        swatchImageUrl = publicUrl;
      } catch (error) {
        toast.error(getErrorMessage(error));
        setIsUploading(false);
        return;
      }
    }

    update.mutate(
      {
        id: color.id,
        payload: {
          ...result.data,
          swatchImageUrl,
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
      open={!!color}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Update color</DialogTitle>
          <DialogDescription>Edit the details of this color.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          <KoaFormField
            label="Name"
            id="color-name"
            placeholder="e.g. Crimson Red"
            value={form.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            error={errors.name}
          />

          <KoaHexCodeInput
            id="color-hex-code"
            value={form.hexCode ?? ""}
            onChange={(value) => handleFieldChange("hexCode", value)}
            error={errors.hexCode}
          />

          <KoaImageInput
            label="Swatch image"
            file={file}
            previewUrl={file ? blobUrl : existingSwatchUrl}
            existingUrl={existingSwatchUrl}
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
            label="Update color"
            loadingLabel="Updating..."
            uploadingLabel="Uploading..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}