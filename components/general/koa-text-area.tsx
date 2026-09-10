import { Label } from "../ui/label";
import { ComponentPropsWithoutRef } from "react";

interface KoaTextAreaProps extends ComponentPropsWithoutRef<"textarea"> {
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
  className,
  ...textareaProps
}: KoaTextAreaProps) {
  const baseClassName =
    "w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <div className={containerClassName}>
      <Label htmlFor={id}>{label}</Label>
      <textarea id={id} className={finalClassName} {...textareaProps} />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}