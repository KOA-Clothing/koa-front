"use client"

import { useEffect, useState } from "react";
import {
  PhoneNumberFormInput,
  PhoneNumberFormInputSchema,
  emptyPhoneNumberForm,
} from "@/types/phone-number";
import { PhoneNumberTypeEnum } from "@/types/enums";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import KoaFormField from "@/components/general/koa-form-field";
import { cn } from "@/lib/utils";

interface PhoneNumberFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  initialValue?: PhoneNumberFormInput;
  isPending?: boolean;
  onSubmit: (data: PhoneNumberFormInput) => void;
}

type FormErrors = Record<string, string>;

const phoneNumberTypes = Object.keys(PhoneNumberTypeEnum)
  .filter((key) => isNaN(Number(key)))
  .map((key) => ({
    label: key,
    value: PhoneNumberTypeEnum[key as keyof typeof PhoneNumberTypeEnum],
  }));

export default function PhoneNumberFormModal({
  open,
  onOpenChange,
  title,
  description,
  initialValue,
  isPending = false,
  onSubmit,
}: PhoneNumberFormModalProps) {
  const [form, setForm] = useState<PhoneNumberFormInput>(emptyPhoneNumberForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      setForm(initialValue ?? emptyPhoneNumberForm);
      setErrors({});
    }
  }, [open, initialValue]);

  const handleFieldChange = <K extends keyof PhoneNumberFormInput>(
    field: K,
    value: PhoneNumberFormInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const result = PhoneNumberFormInputSchema.safeParse(form);
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
    onSubmit(result.data);
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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <KoaFormField
              label="Label"
              id="phone-label"
              placeholder="e.g. Mobile, Home"
              value={form.label}
              onChange={(e) => handleFieldChange("label", e.target.value)}
              error={errors.label}
            />
            <KoaFormField
              disabled
              label="Country code"
              id="phone-country-code"
              placeholder="+94"
              value="+94"
              error={errors.countryCode}
            />
          </div>

          <KoaFormField
            label="Phone number"
            id="phone-number"
            placeholder="Enter phone number"
            value={form.phoneNumber}
            onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
            error={errors.phoneNo}
          />

          <div className="flex flex-col gap-2">
            <span className="text-sm leading-none font-medium">
              Phone number type
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {phoneNumberTypes.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleFieldChange("type", value)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                    form.type === value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.type && (
              <span className="text-xs text-destructive">{errors.type}</span>
            )}
          </div>
        </div>

        <DialogFooter className="border-t">
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
