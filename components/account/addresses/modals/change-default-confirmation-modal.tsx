"use client"

import { useAddressMutations } from "@/features/account/hooks/use-address-mutations";
import ConfirmationModal from "./generic/confirmation-modal";

interface ChangeDefaultConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressId: string | null;
}

export default function ChangeDefaultConfirmationModal({
  open,
  onOpenChange,
  addressId,
}: ChangeDefaultConfirmationModalProps) {
  const { setDefault } = useAddressMutations();

  const handleConfirm = () => {
    if (addressId) {
      setDefault.mutate(addressId, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <ConfirmationModal
      open={open}
      onOpenChange={onOpenChange}
      title="Set as default"
      description="Are you sure you want to set this address as your default address?"
      confirmLabel="Confirm"
      pendingLabel="Setting..."
      isPending={setDefault.isPending}
      onCancel={() => onOpenChange(false)}
      onConfirm={handleConfirm}
    />
  );
}