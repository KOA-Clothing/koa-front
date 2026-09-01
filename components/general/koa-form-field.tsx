import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ComponentPropsWithoutRef } from "react";

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
  return (
    <div className={containerClassName}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...inputProps} />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}