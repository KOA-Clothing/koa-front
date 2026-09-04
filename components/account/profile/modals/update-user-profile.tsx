"use client"

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/hooks/use-api-client";
import { API_ROUTES } from "@/configs/api-routes";
import { BasicProfileDto } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import KoaFormField from "@/components/general/koa-form-field";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface UpdateUserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: BasicProfileDto | null;
}

type FormErrors = Record<string, string>;

export default function UpdateUserProfileModal({
  open,
  onOpenChange,
  profile,
}: UpdateUserProfileModalProps) {
  const axiosClient = useAxiosClient();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open && profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setErrors({});
    }
  }, [open, profile]);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosClient.put(API_ROUTES.USERS.PROFILE, {
        firstName,
        lastName,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(data?.message || "Profile updated successfully!");
      onOpenChange(false);
    },
    onError: (error: AxiosError) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    const nextErrors: FormErrors = {};
    if (!firstName.trim()) nextErrors.firstName = "First name is required";
    if (!lastName.trim()) nextErrors.lastName = "Last name is required";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    mutation.mutate();
  };

  const closeAndReset = () => {
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          closeAndReset();
        } else {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your first and last name.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <KoaFormField
              label="First name"
              id="profile-first-name"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
            />
            <KoaFormField
              label="Last name"
              id="profile-last-name"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
            />
          </div>
        </div>

        <DialogFooter className="border-t">
          <Button
            variant="outline"
            type="button"
            onClick={closeAndReset}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
