"use client"

import { KeyRound } from "lucide-react";

interface PasswordStatusProps {
  enabled: boolean;
}

export default function PasswordStatus({ enabled }: PasswordStatusProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm leading-none font-medium">Password</span>
      <div
        className={
          "flex h-8 items-center gap-2 rounded-lg border px-2.5 text-sm " +
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
        <span>{enabled ? "Password enabled" : "Password not set"}</span>
      </div>
    </div>
  );
}
