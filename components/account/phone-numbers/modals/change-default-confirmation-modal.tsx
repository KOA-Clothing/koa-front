"use client"

import { usePhoneNumberMutations } from "@/features/account/hooks/use-phone-number-mutations";
import ConfirmationModal from "./generic/confirmation-modal";

interface ChangeDefaultConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneId: string | null;
}

export default function ChangeDefaultConfirmationModal({
  open,
  onOpenChange,
  phoneId,
}: ChangeDefaultConfirmationModalProps) {
  const { setDefault } = usePhoneNumberMutations();

  const handleConfirm = () => {
    if (phoneId) {
      setDefault.mutate(phoneId, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <ConfirmationModal
      open={open}
      onOpenChange={onOpenChange}
      title="Set as default"
      description="Are you sure you want to set this phone number as your default phone number?"
      confirmLabel="Confirm"
      pendingLabel="Setting..."
      isPending={setDefault.isPending}
      onCancel={() => onOpenChange(false)}
      onConfirm={handleConfirm}
    />
  );
}