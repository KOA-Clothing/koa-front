"use client";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface KoaSearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

export default function KoaSearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Search...",
  emptyText = "No results found.",
  className,
}: KoaSearchableSelectProps) {
  const selected = options.find((option) => option.value === value);

  const handleSelect = (nextValue: string | null) => {
    if (nextValue === value) {
      onValueChange("");
    } else {
      onValueChange(nextValue ?? "");
    }
  };

  const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onValueChange("");
  };

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <Combobox value={value} onValueChange={handleSelect}>
        <div className="relative w-full">
          <ComboboxTrigger
            render={<Button variant="outline" />}
            className="w-full flex items-center justify-between"
          >
            {/* Conditional text-muted-foreground when displaying placeholder */}
            <span
              className={cn(
                "truncate text-left",
                !selected && "text-muted-foreground"
              )}
            >
              {selected?.label ?? placeholder}
            </span>

            {/* Clear element */}
            {value && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClear(e);
                  }
                }}
                className="ml-auto mr-1 flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                aria-label="Clear selection"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
          </ComboboxTrigger>
        </div>

        <ComboboxContent>
          <ComboboxInput placeholder={placeholder} showTrigger={false} />
          <ComboboxList className="flex flex-col gap-1 m-1">
            {options.length === 0 ? (
              <ComboboxEmpty>{emptyText}</ComboboxEmpty>
            ) : (
              options.map((option) => (
                <ComboboxItem key={option.value} value={option.value}>
                  {option.label}
                </ComboboxItem>
              ))
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}