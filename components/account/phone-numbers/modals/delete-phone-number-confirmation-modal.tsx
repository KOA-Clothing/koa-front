"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import ConfirmationModal from "./generic/confirmation-modal";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

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
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(API_ROUTES.PHONE_NUMBERS.BY_ID(id));
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(data?.message || "Phone number deleted successfully!");
      onOpenChange(false);
    },
    onError: (error: AxiosError) => {
      toast.error(error.message);
    },
  });

  const handleConfirm = () => {
    if (phoneId) {
      mutation.mutate(phoneId);
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
      isPending={mutation.isPending}
      onCancel={() => onOpenChange(false)}
      onConfirm={handleConfirm}
    />
  );
}
