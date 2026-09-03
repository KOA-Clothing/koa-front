"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface ChangeDefaultConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressId: string | null;
}

export default function ChangeDefaultConfirmationModal({
  open,
  onOpenChange,
  addressId,
}: ChangeDefaultConfirmationModalProps) {
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.put(API_ROUTES.ADDRESSES.SET_DEFAULT(id));
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(data?.message || "Default address updated successfully!");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set as default</DialogTitle>
          <DialogDescription>
            Are you sure you want to set this address as your default address?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Setting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
