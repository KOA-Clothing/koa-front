"use client"

import { usePhoneNumberMutations } from "@/features/account/hooks/use-phone-number-mutations";
import { PhoneNumberDto, toPhoneNumberForm } from "@/types/phone-number";
import PhoneNumberFormModal from "./generic/phone-number-form-modal";

interface UpdatePhoneNumberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phone: PhoneNumberDto | null;
}

export default function UpdatePhoneNumberModal({
  open,
  onOpenChange,
  phone,
}: UpdatePhoneNumberModalProps) {
  const { update } = usePhoneNumberMutations();

  return (
    <PhoneNumberFormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Update phone number"
      description="Update your phone number details."
      initialValue={phone ? toPhoneNumberForm(phone) : undefined}
      isPending={update.isPending}
      onSubmit={(data) => {
        if (phone) {
          update.mutate(
            { id: phone.id, payload: data },
            { onSuccess: () => onOpenChange(false) }
          );
        }
      }}
    />
  );
}