"use client"

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import {
  AddressDto,
  UpdateAddressInput,
  UpdateAddressInputSchema,
  toUpdateInput,
} from "@/types/address";
import { AddressTypeEnum } from "@/types/enums";
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
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface UpdateAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: AddressDto | null;
}

const emptyForm: UpdateAddressInput = {
  label: "",
  houseNo: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  province: "",
  zipcode: "",
  type: 1,
};

type FormErrors = Record<string, string>;

export default function UpdateAddressModal({
  open,
  onOpenChange,
  address,
}: UpdateAddressModalProps) {
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<UpdateAddressInput>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const addressTypes = useMemo(() => {
    return Object.keys(AddressTypeEnum)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: AddressTypeEnum[key as keyof typeof AddressTypeEnum],
      }));
  }, []);

  useEffect(() => {
    if (open && address) {
      setForm(toUpdateInput(address));
      setErrors({});
    }
  }, [open, address]);

  const mutation = useMutation({
    mutationFn: async (payload: UpdateAddressInput) => {
      const response = await axiosClient.put(
        API_ROUTES.ADDRESSES.BY_ID(address!.id),
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(data?.message || "Address updated successfully!");
      onOpenChange(false);
    },
    onError: (error: AxiosError) => {
      toast.error(error.message);
    },
  });

  const closeAndReset = () => {
    setForm(emptyForm);
    setErrors({});
    onOpenChange(false);
  };

  const handleFieldChange = <K extends keyof UpdateAddressInput>(
    field: K,
    value: UpdateAddressInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const result = UpdateAddressInputSchema.safeParse(form);
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
    mutation.mutate(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Update address</DialogTitle>
          <DialogDescription>
            Update your shipping or billing address details.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <KoaFormField
              label="Label"
              id="address-label"
              placeholder="e.g. Home, Office"
              value={form.label}
              onChange={(e) => handleFieldChange("label", e.target.value)}
              error={errors.label}
            />
            <KoaFormField
              label="House number"
              id="address-house-no"
              placeholder="e.g. 714/3"
              value={form.houseNo}
              onChange={(e) => handleFieldChange("houseNo", e.target.value)}
              error={errors.houseNo}
            />
          </div>

          <KoaFormField
            label="Address line 1"
            id="address-line-1"
            placeholder="Street address"
            value={form.addressLine1}
            onChange={(e) => handleFieldChange("addressLine1", e.target.value)}
            error={errors.addressLine1}
          />
          <KoaFormField
            label="Address line 2 (optional)"
            id="address-line-2"
            placeholder="Apartment, suite, unit, etc."
            value={form.addressLine2 ?? ""}
            onChange={(e) => handleFieldChange("addressLine2", e.target.value)}
            error={errors.addressLine2}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <KoaFormField
              label="City"
              id="address-city"
              placeholder="City"
              value={form.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              error={errors.city}
            />
            <KoaFormField
              label="State / Province"
              id="address-province"
              placeholder="State or province"
              value={form.province}
              onChange={(e) => handleFieldChange("province", e.target.value)}
              error={errors.province}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <KoaFormField
              label="Zip / Postal code"
              id="address-zipcode"
              placeholder="Postal code"
              value={form.zipcode}
              onChange={(e) => handleFieldChange("zipcode", e.target.value)}
              error={errors.zipcode}
            />

            <KoaFormField
              label="Country"
              id="country"
              placeholder="Sri Lanka"
              value="Sri Lanka"
              disabled
              error={errors.zipcode}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm leading-none font-medium">
              Address type
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {addressTypes.map(({ label, value }) => (
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
            onClick={closeAndReset}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
