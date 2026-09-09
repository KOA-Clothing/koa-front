"use client"

import { useAddressMutations } from "@/features/account/hooks/use-address-mutations";
import ConfirmationModal from "./generic/confirmation-modal";

interface DeleteAddressConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressId: string | null;
}

export default function DeleteAddressConfirmationModal({
  open,
  onOpenChange,
  addressId,
}: DeleteAddressConfirmationModalProps) {
  const { remove } = useAddressMutations();

  const handleConfirm = () => {
    if (addressId) {
      remove.mutate(addressId, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <ConfirmationModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete address"
      description="Are you sure you want to delete this address? This action cannot be undone."
      confirmLabel="Confirm"
      pendingLabel="Deleting..."
      variant="destructive"
      isPending={remove.isPending}
      onCancel={() => onOpenChange(false)}
      onConfirm={handleConfirm}
    />
  );
}