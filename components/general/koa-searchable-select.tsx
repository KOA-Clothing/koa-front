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

  const handleClear = () => {
    onValueChange("");
  };

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <Combobox value={value} onValueChange={handleSelect}>
        <div className="relative w-full">
          <ComboboxTrigger
            render={<Button variant="outline" />}
            className="flex w-full items-center justify-between pr-10"
          >
            <span
              className={cn(
                "truncate text-left",
                !selected && "text-muted-foreground",
              )}
            >
              {selected?.label ?? placeholder}
            </span>
          </ComboboxTrigger>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <ComboboxContent>
          <ComboboxInput
            aria-label={placeholder}
            placeholder={placeholder}
            showTrigger={false}
          />
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