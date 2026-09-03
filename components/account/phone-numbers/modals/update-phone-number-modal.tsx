"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import {
  PhoneNumberDto,
  PhoneNumberFormInput,
  toPhoneNumberForm,
} from "@/types/phone-number";
import PhoneNumberFormModal from "./generic/phone-number-form-modal";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

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
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: PhoneNumberFormInput) => {
      const response = await axiosClient.put(
        API_ROUTES.PHONE_NUMBERS.BY_ID(phone!.id),
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(data?.message || "Phone number updated successfully!");
      onOpenChange(false);
    },
    onError: (error: AxiosError) => {
      toast.error(error.message);
    },
  });

  return (
    <PhoneNumberFormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Update phone number"
      description="Update your phone number details."
      initialValue={phone ? toPhoneNumberForm(phone) : undefined}
      isPending={mutation.isPending}
      onSubmit={(data) => mutation.mutate(data)}
    />
  );
}
