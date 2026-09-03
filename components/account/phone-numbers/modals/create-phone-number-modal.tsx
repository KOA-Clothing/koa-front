"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import { PhoneNumberFormInput } from "@/types/phone-number";
import PhoneNumberFormModal from "./generic/phone-number-form-modal";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface CreatePhoneNumberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePhoneNumberModal({
  open,
  onOpenChange,
}: CreatePhoneNumberModalProps) {
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: PhoneNumberFormInput) => {
      console.log(payload)
      const response = await axiosClient.post(API_ROUTES.PHONE_NUMBERS.BASE, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(data?.message || "Phone number added successfully!");
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
      title="Add phone number"
      description="Add a new phone number to your account."
      isPending={mutation.isPending}
      onSubmit={(data) => mutation.mutate(data)}
    />
  );
}
