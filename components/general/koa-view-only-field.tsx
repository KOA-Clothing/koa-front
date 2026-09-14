import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KoaViewOnlyFieldProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export default function KoaViewOnlyField({
  label,
  value,
  className,
}: KoaViewOnlyFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm text-foreground">
        {value === null || value === undefined || value === "" ? (
          <span className="text-muted-foreground/60">—</span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}