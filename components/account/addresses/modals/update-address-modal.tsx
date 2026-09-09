"use client"

import { useAddressMutations } from "@/features/account/hooks/use-address-mutations";
import { AddressDto, toAddressForm } from "@/types/address";
import AddressFormModal from "./generic/address-form-modal";

interface UpdateAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: AddressDto | null;
}

export default function UpdateAddressModal({
  open,
  onOpenChange,
  address,
}: UpdateAddressModalProps) {
  const { update } = useAddressMutations();

  return (
    <AddressFormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Update address"
      description="Update your shipping or billing address details."
      initialValue={address ? toAddressForm(address) : undefined}
      isPending={update.isPending}
      onSubmit={(data) => {
        if (address) {
          update.mutate(
            { id: address.id, payload: data },
            { onSuccess: () => onOpenChange(false) }
          );
        }
      }}
    />
  );
}