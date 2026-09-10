"use client";

import { useRef, useState } from "react";
import {
  ColorFormInput,
  ColorFormInputSchema,
  emptyColorForm,
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

type FormErrors = Record<string, string>;

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface CreateColorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateColorModal({
  open,
  onOpenChange,
}: CreateColorModalProps) {
  const { create, requestSwatchImageUpload } = useColorMutations();

  const [form, setForm] = useState<ColorFormInput>(emptyColorForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [prevOpen, setPrevOpen] = useState(open);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (open && prevOpen !== open) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPrevOpen(open);
    setForm(emptyColorForm);
    setErrors({});
    setFile(null);
    setPreviewUrl(null);
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

    let swatchImageUrl: string | null = null;
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

    create.mutate(
      {
        ...result.data,
        swatchImageUrl,
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
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Add color</DialogTitle>
          <DialogDescription>
            Add a new color defined by its hex code or swatch image.
          </DialogDescription>
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
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          />
          <KoaModalSaveButton
            onClick={handleSubmit}
            isPending={isPending}
            isUploading={isUploading}
            label="Create color"
            loadingLabel="Creating..."
            uploadingLabel="Uploading..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}