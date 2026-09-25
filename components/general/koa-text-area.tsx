import type { ComponentPropsWithoutRef } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface KoaTextAreaProps extends ComponentPropsWithoutRef<typeof Textarea> {
  label: string;
  id: string;
  containerClassName?: string;
  error?: string;
}

export default function KoaTextArea({
  label,
  id,
  containerClassName = "flex flex-col gap-2",
  error,
  ...textareaProps
}: KoaTextAreaProps) {
  const errorId = `${id}-error`;
  const describedBy =
    [textareaProps["aria-describedby"], error ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={containerClassName}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        {...textareaProps}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
