"use client"

import { KeyRound, Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import UpdatePasswordModal from "./modals/update-password-modal";

interface PasswordStatusProps {
  enabled: boolean;
}

export default function PasswordStatus({ enabled }: PasswordStatusProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm leading-none font-medium">Password</span>
      <div
        className={
          "flex h-8 items-center gap-2 rounded-lg border px-2.5 text-sm pr-1 " +
          (enabled
            ? "border-border bg-background text-foreground"
            : "border-dashed border-border bg-muted/30 text-muted-foreground")
        }
        aria-label={enabled ? "Password enabled" : "Password not enabled"}
      >
        <span
          className={"size-2 rounded-full " + (enabled ? "bg-emerald-500" : "bg-muted-foreground/40")}
          aria-hidden
        />
        <KeyRound className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="flex-1">{enabled ? "Password enabled" : "Password not set"}</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsOpen(true)}
          aria-label="Change password"
          className="text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-3.5" />
        </Button>
      </div>

      <UpdatePasswordModal open={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
}