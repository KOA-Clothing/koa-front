"use client"

import { useState } from "react";
import { useProfileMutations } from "@/features/account/hooks/use-profile-mutations";
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

interface UpdatePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormErrors = Record<string, string>;

export default function UpdatePasswordModal({
  open,
  onOpenChange,
}: UpdatePasswordModalProps) {
  const { updatePassword } = useProfileMutations();

  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [prevOpen, setPrevOpen] = useState(open);

  if (open && prevOpen !== open) {
    setPrevOpen(open);
    setPassword("");
    setErrors({});
  }

  const handleSubmit = () => {
    const nextErrors: FormErrors = {};
    if (!password.trim()) nextErrors.password = "Password is required";
    else if (password.length < 8) nextErrors.password = "Password must be at least 8 characters";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    updatePassword.mutate({ password }, { onSuccess: () => onOpenChange(false) });
  };

  const closeAndReset = () => {
    setPassword("");
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
          <DialogTitle>Update password</DialogTitle>
          <DialogDescription>
            Enter a new password for your account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5">
          <KoaFormField
            label="New password"
            id="update-password"
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
        </div>

        <DialogFooter className="border-t">
          <Button
            variant="outline"
            type="button"
            onClick={closeAndReset}
            disabled={updatePassword.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={updatePassword.isPending}
          >
            {updatePassword.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}