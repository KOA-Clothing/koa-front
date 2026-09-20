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

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <Combobox value={value} onValueChange={(next) => onValueChange(next ?? "")}>
        <ComboboxTrigger
          render={<Button variant="outline" />}
          className="w-full justify-between"
        >
          {selected?.label ?? placeholder}
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder={placeholder} />
          <ComboboxList>
            <ComboboxEmpty>{emptyText}</ComboboxEmpty>
            {options.map((option) => (
              <ComboboxItem key={option.value} value={option.value}>
                {option.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}