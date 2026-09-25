import type { ComponentPropsWithoutRef } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  label: string;
  id: string;
  containerClassName?: string;
  error?: string;
}

export default function KoaFormField({
  label,
  id,
  containerClassName = "flex flex-col gap-2",
  error,
  ...inputProps
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const describedBy =
    [inputProps["aria-describedby"], error ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={containerClassName}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        {...inputProps}
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
