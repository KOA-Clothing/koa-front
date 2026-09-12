"use client";

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
import {
  ProductFormInput
} from "@/types/product";
import { AgeGroupEnum, ageGroupLabels, GenderEnum, genderLabels, ProductStatusEnum, productStatusLabels } from "@/types/enums";

type FormErrors = Record<string, string>;

interface ProductFormFieldsProps {
  form: ProductFormInput;
  onFieldChange: <K extends keyof ProductFormInput>(
    field: K,
    value: ProductFormInput[K]
  ) => void;
  errors: FormErrors;
}

const CATEGORIES_FOR_SELECT = { pageIndex: 0, pageSize: 100 };

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string | null) => void;
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
      <Select value={value} onValueChange={onValueChange}>
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

/** Shared create/update product form body. Holds the full field set so the two modals don't duplicate it. */
export default function ProductFormFields({
  form,
  onFieldChange,
  errors,
}: ProductFormFieldsProps) {
  const { data } = useCategories(CATEGORIES_FOR_SELECT, "");
  const categories = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <KoaFormField
        label="Name"
        id="product-name"
        placeholder="e.g. Classic Oxford Shirt"
        value={form.name}
        onChange={(e) => onFieldChange("name", e.target.value)}
        error={errors.name}
      />

      <KoaTextArea
        label="Description"
        id="product-description"
        rows={3}
        placeholder="Brief description of the product..."
        value={form.description ?? ""}
        onChange={(e) => onFieldChange("description", e.target.value)}
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
          onValueChange={(value) => {
            if (value) onFieldChange("categoryId", value);
          }}
          error={errors.categoryId}
        />

        <KoaFormField
          label="Size guide"
          id="product-size-guide"
          placeholder="URL or reference to the size guide"
          value={form.sizeGuide ?? ""}
          onChange={(e) => onFieldChange("sizeGuide", e.target.value)}
          error={errors.sizeGuide}
        />

        <KoaFormField
          label="Cost price ($)"
          id="product-cost-price"
          type="number"
          min={0}
          step="0.01"
          value={form.costPrice}
          onChange={(e) => onFieldChange("costPrice", Number(e.target.value))}
          error={errors.costPrice}
        />

        <KoaFormField
          label="Selling price ($)"
          id="product-selling-price"
          type="number"
          min={0}
          step="0.01"
          value={form.sellingPrice}
          onChange={(e) => onFieldChange("sellingPrice", Number(e.target.value))}
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
            onFieldChange("discountPercentage", Number(e.target.value))
          }
          error={errors.discountPercentage}
        />

        <KoaFormField
          label="Material"
          id="product-material"
          placeholder="e.g. 100% Cotton"
          value={form.material ?? ""}
          onChange={(e) => onFieldChange("material", e.target.value)}
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
            onFieldChange("gender", Number(value) as GenderEnum)
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
            onFieldChange("ageGroup", Number(value) as AgeGroupEnum)
          }
          error={errors.ageGroup}
        />

        <SelectField
          label="Status"
          id="product-status"
          value={String(form.status)}
          placeholder="Select status"
          options={Object.entries(productStatusLabels).map(([value, label]) => ({
            value,
            label,
          }))}
          onValueChange={(value) =>
            onFieldChange("status", Number(value) as ProductStatusEnum)
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
        onChange={(e) => onFieldChange("careInstructions", e.target.value)}
        error={errors.careInstructions}
      />

      <div className="flex items-center gap-2">
        <KoaSwitch
          id="product-is-featured"
          checked={form.isFeatured}
          onCheckedChange={(checked) => onFieldChange("isFeatured", checked)}
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
        onChange={(e) => onFieldChange("metaTitle", e.target.value)}
        error={errors.metaTitle}
      />

      <KoaTextArea
        label="Meta description"
        id="product-meta-description"
        rows={2}
        placeholder="SEO description..."
        value={form.metaDescription ?? ""}
        onChange={(e) => onFieldChange("metaDescription", e.target.value)}
        error={errors.metaDescription}
      />
    </div>
  );
}