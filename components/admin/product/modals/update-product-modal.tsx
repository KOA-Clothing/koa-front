"use client";

import { useState } from "react";
import {
  ProductDto,
  ProductFormInput,
  ProductFormInputSchema,
  emptyProductForm,
  toProductForm,
} from "@/types/product";
import {
  AgeGroupEnum,
  GenderEnum,
  ProductStatusEnum,
  ageGroupLabels,
  genderLabels,
  productStatusLabels,
} from "@/types/enums";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import KoaFormField from "@/components/general/koa-form-field";
import KoaTextArea from "@/components/general/koa-text-area";
import { KoaSwitch } from "@/components/general/koa-switch";
import { useCategories } from "@/features/category/hooks/use-categories";
import { useProductMutations } from "@/features/product/hooks/use-product-mutations";
import KoaModalCancelButton from "@/components/general/koa-modal-cancel-button";
import KoaModalSaveButton from "@/components/general/koa-modal-save-button";

type FormErrors = Record<string, string>;

const CATEGORIES_FOR_SELECT = { pageIndex: 0, pageSize: 100 };

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  error?: string;
}

function SelectField({
  label,
  id,
  value,
  placeholder,
  options,
  onValueChange,
  error,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={(v) => v && onValueChange(v)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

interface UpdateProductModalProps {
  product: ProductDto | null;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateProductModal({
  product,
  onOpenChange,
}: UpdateProductModalProps) {
  const { update } = useProductMutations();
  const { data: categoriesData } = useCategories(CATEGORIES_FOR_SELECT, "");
  const categories = categoriesData?.items ?? [];

  const [form, setForm] = useState<ProductFormInput>(emptyProductForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [prevProduct, setPrevProduct] = useState<ProductDto | null>(product);

  if (product && prevProduct !== product) {
    setPrevProduct(product);
    setForm(toProductForm(product));
    setErrors({});
  }

  const handleFieldChange = <K extends keyof ProductFormInput>(
    field: K,
    value: ProductFormInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!product) return;

    const result = ProductFormInputSchema.safeParse(form);
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
      { id: product.id, payload: result.data },
      {
        onSuccess: () => onOpenChange(false),
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
            Edit the details of this product.
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

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Category"
              id="product-category"
              value={form.categoryId}
              placeholder="Select a category"
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              onValueChange={(value) => handleFieldChange("categoryId", value)}
              error={errors.categoryId}
            />

            <KoaFormField
              label="Size guide"
              id="product-size-guide"
              placeholder="URL or reference to the size guide"
              value={form.sizeGuide ?? ""}
              onChange={(e) => handleFieldChange("sizeGuide", e.target.value)}
              error={errors.sizeGuide}
            />

            <KoaFormField
              label="Cost price ($)"
              id="product-cost-price"
              type="number"
              min={0}
              step="0.01"
              value={form.costPrice}
              onChange={(e) =>
                handleFieldChange("costPrice", Number(e.target.value))
              }
              error={errors.costPrice}
            />

            <KoaFormField
              label="Selling price ($)"
              id="product-selling-price"
              type="number"
              min={0}
              step="0.01"
              value={form.sellingPrice}
              onChange={(e) =>
                handleFieldChange("sellingPrice", Number(e.target.value))
              }
              error={errors.sellingPrice}
            />

            <KoaFormField
              label="Discount percentage"
              id="product-discount-percentage"
              type="number"
              min={0}
              max={100}
              step="1"
              value={form.discountPercentage}
              onChange={(e) =>
                handleFieldChange("discountPercentage", Number(e.target.value))
              }
              error={errors.discountPercentage}
            />

            <KoaFormField
              label="Material"
              id="product-material"
              placeholder="e.g. 100% Cotton"
              value={form.material ?? ""}
              onChange={(e) => handleFieldChange("material", e.target.value)}
              error={errors.material}
            />

            <SelectField
              label="Gender"
              id="product-gender"
              value={String(form.gender)}
              placeholder="Select gender"
              options={Object.entries(genderLabels).map(([value, label]) => ({
                value,
                label,
              }))}
              onValueChange={(value) =>
                handleFieldChange("gender", Number(value) as GenderEnum)
              }
              error={errors.gender}
            />

            <SelectField
              label="Age group"
              id="product-age-group"
              value={String(form.ageGroup)}
              placeholder="Select age group"
              options={Object.entries(ageGroupLabels).map(([value, label]) => ({
                value,
                label,
              }))}
              onValueChange={(value) =>
                handleFieldChange("ageGroup", Number(value) as AgeGroupEnum)
              }
              error={errors.ageGroup}
            />

            <SelectField
              label="Status"
              id="product-status"
              value={String(form.status)}
              placeholder="Select status"
              options={Object.entries(productStatusLabels).map(
                ([value, label]) => ({
                  value,
                  label,
                })
              )}
              onValueChange={(value) =>
                handleFieldChange("status", Number(value) as ProductStatusEnum)
              }
              error={errors.status}
            />
          </div>

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

          <div className="flex items-center gap-2">
            <KoaSwitch
              id="product-is-featured"
              checked={form.isFeatured}
              onCheckedChange={(checked) =>
                handleFieldChange("isFeatured", checked)
              }
            />
            <Label htmlFor="product-is-featured" className="cursor-pointer">
              Featured product
            </Label>
          </div>

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

        <DialogFooter className="border-t">
          <KoaModalCancelButton
            onClick={() => onOpenChange(false)}
            disabled={update.isPending}
          />
          <KoaModalSaveButton
            onClick={handleSubmit}
            isPending={update.isPending}
            label="Update product"
            loadingLabel="Updating..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}