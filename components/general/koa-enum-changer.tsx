"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { ChevronDownIcon } from "lucide-react";
import KoaEnumBadge from "@/components/general/koa-enum-badge";
import {
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface KoaEnumChangerProps<T extends string | number> {
  labels: Record<T, string>;
  value: T;
  styles?: Record<T, string>;
  onValueChange: (value: T) => void;
  className?: string;
}

export default function KoaEnumChanger<T extends string | number>({
  labels,
  value,
  styles,
  onValueChange,
  className,
}: KoaEnumChangerProps<T>) {
  const options = Object.keys(labels) as T[];

  const handleValueChange = (stringValue: string) => {
    const next = options.find((key) => String(key) === stringValue);
    if (next !== undefined && next !== value) onValueChange(next);
  };

  return (
    <div className={cn("inline-flex", className)}>
      <Select value={String(value)} onValueChange={(v) => v && handleValueChange(v)}>
        <SelectPrimitive.Trigger
          aria-label="Change value"
          className="group inline-flex cursor-default items-center gap-0.5 rounded-full p-0.5 pr-0 text-left outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:opacity-90"
        >
          <KoaEnumBadge labels={labels} value={value} styles={styles} />
          <ChevronDownIcon className="pointer-events-none size-3.5 shrink-0 text-muted-foreground transition-transform group-data-popup-open:rotate-180" />
        </SelectPrimitive.Trigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          {options.map((key) => (
            <SelectItem key={String(key)} value={String(key)}>
              {labels[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}