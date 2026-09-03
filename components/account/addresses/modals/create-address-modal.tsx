"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import { AddressFormInput } from "@/types/address";
import AddressFormModal from "./generic/address-form-modal";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface CreateAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAddressModal({
  open,
  onOpenChange,
}: CreateAddressModalProps) {
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: AddressFormInput) => {
      const response = await axiosClient.post(API_ROUTES.ADDRESSES.BASE, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(data?.message || "Address added successfully!");
      onOpenChange(false);
    },
    onError: (error: AxiosError) => {
      toast.error(error.message);
    },
  });

  return (
    <AddressFormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add address"
      description="Add a new shipping or billing address to your account."
      isPending={mutation.isPending}
      onSubmit={(data) => mutation.mutate(data)}
    />
  );
}
