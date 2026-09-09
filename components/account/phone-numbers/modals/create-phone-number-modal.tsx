"use client"

import { usePhoneNumberMutations } from "@/features/account/hooks/use-phone-number-mutations";
import PhoneNumberFormModal from "./generic/phone-number-form-modal";

interface CreatePhoneNumberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePhoneNumberModal({
  open,
  onOpenChange,
}: CreatePhoneNumberModalProps) {
  const { create } = usePhoneNumberMutations();

  return (
    <PhoneNumberFormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add phone number"
      description="Add a new phone number to your account."
      isPending={create.isPending}
      onSubmit={(data) =>
        create.mutate(data, { onSuccess: () => onOpenChange(false) })
      }
    />
  );
}