"use client"

import { usePhoneNumberMutations } from "@/features/account/hooks/use-phone-number-mutations";
import ConfirmationModal from "./generic/confirmation-modal";

interface DeletePhoneNumberConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneId: string | null;
}

export default function DeletePhoneNumberConfirmationModal({
  open,
  onOpenChange,
  phoneId,
}: DeletePhoneNumberConfirmationModalProps) {
  const { remove } = usePhoneNumberMutations();

  const handleConfirm = () => {
    if (phoneId) {
      remove.mutate(phoneId, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <ConfirmationModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete phone number"
      description="Are you sure you want to delete this phone number? This action cannot be undone."
      confirmLabel="Confirm"
      pendingLabel="Deleting..."
      variant="destructive"
      isPending={remove.isPending}
      onCancel={() => onOpenChange(false)}
      onConfirm={handleConfirm}
    />
  );
}