"use client"

import { useAddressMutations } from "@/features/account/hooks/use-address-mutations";
import AddressFormModal from "./generic/address-form-modal";

interface CreateAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAddressModal({
  open,
  onOpenChange,
}: CreateAddressModalProps) {
  const { create } = useAddressMutations();

  return (
    <AddressFormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add address"
      description="Add a new shipping or billing address to your account."
      isPending={create.isPending}
      onSubmit={(data) =>
        create.mutate(data, { onSuccess: () => onOpenChange(false) })
      }
    />
  );
}