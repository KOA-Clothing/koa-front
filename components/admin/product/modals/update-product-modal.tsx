"use client";

import { useRef, useState } from "react";
import {
  emptyProductUpdateForm,
  ProductUpdateInput,
  ProductUpdateInputSchema,
  toProductUpdateForm,
  type ProductDto,
} from "@/types/product";
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
import KoaImageInput from "@/components/general/koa-image-input";
import KoaPercentage from "@/components/general/koa-percentage";
import KoaPricingSummary from "@/components/general/koa-pricing-summary";
import { useProductMutations } from "@/features/product/hooks/use-product-mutations";
import { uploadFileToPresignedUrl } from "@/lib/storage/direct-upload";
import { getErrorMessage } from "@/lib/api/errors";
import toast from "react-hot-toast";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";
import { Label } from "@/components/ui/label";

type FormErrors = Record<string, string>;

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface UpdateProductModalProps {
  product: ProductDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateProductModal({
  product,
  onOpenChange,
}: UpdateProductModalProps) {
  const { update, requestSizeGuideUpload } = useProductMutations();

  const [form, setForm] = useState<ProductUpdateInput>(emptyProductUpdateForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [prevProduct, setPrevProduct] = useState<ProductDto | null>(product);
  const [file, setFile] = useState<File | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [existingGuideUrl, setExistingGuideUrl] = useState<string | null>(
    product?.sizeGuide ?? null
  );
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (product && prevProduct !== product) {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setPrevProduct(product);
    setForm(toProductUpdateForm(product));
    setErrors({});
    setFile(null);
    setBlobUrl(null);
    setExistingGuideUrl(product.sizeGuide ?? null);
    setFileError(null);
  }

  const handleFieldChange = <K extends keyof ProductUpdateInput>(
    field: K,
    value: ProductUpdateInput[K]
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
    if (!product) return;

    const result = ProductUpdateInputSchema.safeParse(form);
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

    let sizeGuide: string | null = existingGuideUrl;
    if (file) {
      try {
        setIsUploading(true);
        const { uploadUrl, publicUrl } = await requestSizeGuideUpload(file);
        await uploadFileToPresignedUrl(uploadUrl, file);
        sizeGuide = publicUrl;
      } catch (error) {
        toast.error(getErrorMessage(error));
        setIsUploading(false);
        return;
      }
    }

    update.mutate(
      {
        id: product.id,
        payload: {
          ...result.data,
          sizeGuide,
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
      open={!!product}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Update product</DialogTitle>
          <DialogDescription>
            Edit the details of this product. Gender, age group, status and
            display flags are changed directly from the table.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          <KoaFormField
            label="Name"
            id="product-name"
            placeholder="e.g. Classic Oxford Shirt"
            value={form.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            error={errors.name}
          />

          <KoaTextArea
            label="Description"
            id="product-description"
            rows={3}
            placeholder="Brief description of the product..."
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
            label="Material"
            id="product-material"
            placeholder="e.g. 100% Cotton"
            value={form.material ?? ""}
            onChange={(e) => handleFieldChange("material", e.target.value)}
            error={errors.material}
          />

          <KoaTextArea
            label="Care instructions"
            id="product-care-instructions"
            rows={2}
            placeholder="How to wash and care for this item..."
            value={form.careInstructions ?? ""}
            onChange={(e) =>
              handleFieldChange("careInstructions", e.target.value)
            }
            error={errors.careInstructions}
          />

          <div className="flex flex-col gap-4 rounded-xl border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <KoaFormField
                label="Cost price (Rs)"
                id="product-cost-price"
                type="number"
                min={0}
                step="1"
                value={form.costPrice}
                onChange={(e) =>
                  handleFieldChange("costPrice", Number(e.target.value))
                }
                error={errors.costPrice}
              />

              <KoaFormField
                label="Selling price (Rs)"
                id="product-selling-price"
                type="number"
                min={0}
                step="1"
                value={form.sellingPrice}
                onChange={(e) =>
                  handleFieldChange("sellingPrice", Number(e.target.value))
                }
                error={errors.sellingPrice}
              />
            </div>

            <KoaPercentage
              label="Discount percentage"
              value={form.discountPercentage}
              onValueChange={(value) =>
                handleFieldChange("discountPercentage", value)
              }
            />

            <KoaPricingSummary
              costPrice={form.costPrice}
              sellingPrice={form.sellingPrice}
              discountPercentage={form.discountPercentage}
            />
          </div>

          <div className="flex flex-col gap-4 rounded-xl border p-4">
            <Label className="felx items-center justify-center">Metadata</Label>
            <KoaFormField
              label="Meta title"
              id="product-meta-title"
              placeholder="SEO title"
              value={form.metaTitle ?? ""}
              onChange={(e) => handleFieldChange("metaTitle", e.target.value)}
              error={errors.metaTitle}
            />

            <KoaTextArea
              label="Meta description"
              id="product-meta-description"
              rows={2}
              placeholder="SEO description..."
              value={form.metaDescription ?? ""}
              onChange={(e) =>
                handleFieldChange("metaDescription", e.target.value)
              }
              error={errors.metaDescription}
            />
          </div>
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
            label="Update product"
            loadingLabel="Updating..."
            uploadingLabel="Uploading..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}