"use client";

import { KeyRound, Pencil } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import UpdatePasswordModal from "./modals/update-password-modal";

interface PasswordStatusProps {
  enabled: boolean;
}

export default function PasswordStatus({ enabled }: PasswordStatusProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium leading-none">Password</span>
      <div className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-background px-2.5 pr-1 text-sm">
        <KeyRound className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Badge
          variant="outline"
          className={
            enabled
              ? "border-success/20 bg-success/10 text-success"
              : "text-muted-foreground"
          }
        >
          {enabled ? "Enabled" : "Not set"}
        </Badge>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsOpen(true)}
          aria-label={enabled ? "Change password" : "Set password"}
          className="ml-auto min-h-11 min-w-11 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
        </Button>
      </div>

      <UpdatePasswordModal open={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
}
