"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import ConfirmationModal from "./generic/confirmation-modal";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

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
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.put(API_ROUTES.PHONE_NUMBERS.SET_DEFAULT(id));
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(data?.message || "Default phone number updated successfully!");
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
      title="Set as default"
      description="Are you sure you want to set this phone number as your default phone number?"
      confirmLabel="Confirm"
      pendingLabel="Setting..."
      isPending={mutation.isPending}
      onCancel={() => onOpenChange(false)}
      onConfirm={handleConfirm}
    />
  );
}
