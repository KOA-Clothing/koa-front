"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ColorSwatch from "@/components/general/koa-color-badge";
import KoaImageInput from "@/components/general/koa-image-input";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";
import KoaSearchableSelect from "@/components/general/koa-searchable-select";
import KoaTextArea from "@/components/general/koa-text-area";
import { useProductImageMutations } from "@/features/product-image/hooks/use-product-image-mutations";
import { getErrorMessage } from "@/lib/api/errors";
import { uploadFileToPresignedUrl } from "@/lib/storage/direct-upload";
import type { ColorDto } from "@/types/color";
import {
  CreateProductImageInputSchema,
  emptyProductImageForm,
  type ProductImageFormInput,
} from "@/types/product-image";
import toast from "react-hot-toast";

type FormErrors = Record<string, string>;

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface CreateProductImageModalProps {
  /**
   * The product to attach the image to, or `null` when closed.
   *
   * Structural, not one of the product-image DTOs: the table row
   * (`ProductImageTableDetailsDto`) and the gallery's collection
   * (`ProductImagesCollectionDto`) are different shapes, and this modal needs
   * the product's id (the command's `ProductId`) and its name (the description
   * line). Typing it this way lets both pages pass the object they already hold,
   * unreshaped.
   */
  product: { id: string; name: string } | null;
  /**
   * The colors this product is stocked in — the only colors an image here may be
   * tagged with. Never the global color list: that lets an admin tag a shot with
   * a colorway the product has no variant for.
   *
   * Required, and passed in rather than fetched, so the two callers can each use
   * the cheaper source. The table row already carries `availableColors`, so the
   * list page makes no request; the gallery page calls `useProductVariantColors`,
   * lazily, only when the modal is actually opened.
   *
   * An empty list is a real state (the product has no color variants), and the
   * form still works — `colorId` is nullable, so the image saves untagged.
   */
  availableColors: ColorDto[];
  onOpenChange: (open: boolean) => void;
}

/**
 * Adds one image to a product.
 *
 * The image is uploaded **before** the record is created: the file goes
 * straight to storage on a presigned URL (no auth header, the signed URL is
 * self-contained), and only the resulting public URL is posted to
 * `POST /api/v1/product-images`. `isPrimary` is absent from the command, so the
 * backend decides it — nothing here sends a field the endpoint doesn't accept.
 */
export default function CreateProductImageModal({
  product,
  availableColors,
  onOpenChange,
}: CreateProductImageModalProps) {
  const { create, requestProductImageUpload } = useProductImageMutations();

  const [form, setForm] = useState<ProductImageFormInput>(emptyProductImageForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset the form whenever a different product opens the modal.
  const [prevProduct, setPrevProduct] = useState<CreateProductImageModalProps["product"]>(
    product
  );
  if (product && prevProduct !== product) {
    setPrevProduct(product);
    setForm(emptyProductImageForm);
    setErrors({});
    setFile(null);
    setBlobUrl(null);
    setFileError(null);
  }

  // Only the colors this product is actually stocked in. Offering the global
  // `/colors/all-active` list let an admin tag a shot with a colorway the
  // product has no variant for, producing an image that can never be selected
  // on the storefront.
  const colorOptions = availableColors.map((color) => ({
    value: color.id,
    label: color.name,
  }));
  const selectedColor = availableColors.find((color) => color.id === form.colorId);

  const handleFieldChange = <K extends keyof ProductImageFormInput>(
    field: K,
    value: ProductImageFormInput[K]
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
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setFile(null);
    setBlobUrl(null);
    setFileError(null);
  };

  const isPending = isUploading || create.isPending;
  const canCreate = !!product && !!file && !isPending;

  const handleSubmit = async () => {
    if (!product || !file) return;

    setErrors({});
    setIsUploading(true);

    // The file is the only required input, and the URL it produces is the only
    // thing the command needs from it — so validate the metadata against the
    // schema *after* the upload, when the real imageUrl is known.
    let imageUrl: string;
    try {
      const { uploadUrl, publicUrl } = await requestProductImageUpload(file);
      await uploadFileToPresignedUrl(uploadUrl, file);
      imageUrl = publicUrl;
    } catch (error) {
      toast.error(getErrorMessage(error));
      setIsUploading(false);
      return;
    }

    const result = CreateProductImageInputSchema.safeParse({
      productId: product.id,
      // "" is not a Guid - an unselected color must reach the API as null.
      colorId: form.colorId || null,
      imageUrl,
      altText: form.altText.trim() || null,
    });

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      setIsUploading(false);
      return;
    }

    create.mutate(result.data, {
      onSuccess: () => {
        setIsUploading(false);
        onOpenChange(false);
      },
      onError: () => setIsUploading(false),
    });
  };

  return (
    <Dialog
      open={!!product}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Add image</DialogTitle>
          <DialogDescription>
            {product
              ? `Upload a new image for "${product.name}".`
              : "Upload a new product image."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          <KoaImageInput
            label="Image"
            file={file}
            previewUrl={blobUrl}
            error={fileError}
            maxSizeMB={MAX_SIZE_MB}
            fileInputRef={fileInputRef}
            onChange={handleFileSelect}
            onRemove={handleRemoveFile}
            accept="image/jpeg,image/png,image/webp,image/gif"
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="product-image-color">Color (optional)</Label>
            <div className="flex items-center gap-2">
              <KoaSearchableSelect
                className="flex-1"
                value={form.colorId}
                onValueChange={(value) => handleFieldChange("colorId", value)}
                options={colorOptions}
                placeholder="Select a color..."
                // Cause-neutral on purpose: an empty list, a request still in
                // flight and a failed request all look identical here, and only
                // the first is something the admin can act on inside this dialog.
                emptyText={
                  availableColors.length === 0
                    ? "No colors to choose from."
                    : "No colors found."
                }
              />
              {selectedColor && (
                <div
                  className="flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-2"
                  title={selectedColor.name}
                >
                  <ColorSwatch color={selectedColor} className="size-5" />
                  <span className="text-xs text-muted-foreground">
                    {selectedColor.hexCode
                      ? `#${selectedColor.hexCode}`
                      : selectedColor.swatchImageUrl
                        ? "Image swatch"
                        : "No swatch"}
                  </span>
                </div>
              )}
            </div>
            {/* Says *why* the list is what it is, rather than leaving an admin to
                wonder whether the dropdown is broken. */}
            <span className="text-xs text-muted-foreground">
              {availableColors.length === 0
                ? "This image will be saved without a color tag. Add color variants to the product to tag images by colorway."
                : "Only colors this product has a variant in. Tag the shot with a colorway when it is color-specific, or leave it empty for an image that applies to every color."}
            </span>
          </div>

          <KoaTextArea
            label="Alt text (optional)"
            id="product-image-alt-text"
            rows={2}
            placeholder="Describe the image for screen readers and SEO..."
            value={form.altText}
            onChange={(e) => handleFieldChange("altText", e.target.value)}
            error={errors.altText}
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
            disabled={!canCreate}
            label="Add image"
            loadingLabel="Creating..."
            uploadingLabel="Uploading..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
