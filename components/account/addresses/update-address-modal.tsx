"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import { AddressDto, AddressFormInput, toAddressForm } from "@/types/address";
import AddressFormModal from "./address-form-modal";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

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
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: AddressFormInput) => {
      const response = await axiosClient.put(
        API_ROUTES.ADDRESSES.BY_ID(address!.id),
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(data?.message || "Address updated successfully!");
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
      title="Update address"
      description="Update your shipping or billing address details."
      initialValue={address ? toAddressForm(address) : undefined}
      isPending={mutation.isPending}
      onSubmit={(data) => mutation.mutate(data)}
    />
  );
}
