"use client"

import { useState } from "react";
import { useProfileMutations } from "@/features/account/hooks/use-profile-mutations";
import { BasicProfileDto, UpdateProfileInputSchema } from "@/types/user";
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
  const { updateProfile } = useProfileMutations();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [prevOpen, setPrevOpen] = useState(open);

  if (open && prevOpen !== open) {
    setPrevOpen(open);
    setFirstName(profile?.firstName || "");
    setLastName(profile?.lastName || "");
    setErrors({});
  }

  const handleSubmit = () => {
    const result = UpdateProfileInputSchema.safeParse({ firstName, lastName });
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    updateProfile.mutate(result.data, { onSuccess: () => onOpenChange(false) });
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
            disabled={updateProfile.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}