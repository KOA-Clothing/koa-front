"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import ConfirmationModal from "./confirmation-modal";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

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
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(API_ROUTES.ADDRESSES.BY_ID(id));
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(data?.message || "Address deleted successfully!");
      onOpenChange(false);
    },
    onError: (error: AxiosError) => {
      toast.error(error.message);
    },
  });

  const handleConfirm = () => {
    if (addressId) {
      mutation.mutate(addressId);
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
      isPending={mutation.isPending}
      onCancel={() => onOpenChange(false)}
      onConfirm={handleConfirm}
    />
  );
}
