"use client";

import { useId } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item, ItemContent } from "@/components/ui/item";
import { Label } from "@/components/ui/label";

interface SearchFieldState {
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
}

interface KoaSearchBarProps {
  searchField: SearchFieldState;
  placeholder?: string;
  label?: string;
  containerClassName?: string;
}

export default function KoaAdminSearchBar({
  searchField,
  placeholder = "Search...",
  label = "Search",
  containerClassName = "flex flex-col gap-2",
}: KoaSearchBarProps) {
  const inputId = useId();

  return (
    <div className={containerClassName}>
      <Item
        variant="outline"
        className="rounded-lg bg-background text-foreground"
      >
        <ItemContent className="flex flex-row items-center gap-2">
          <Label
            htmlFor={inputId}
            className="shrink-0 text-xs text-muted-foreground"
          >
            {label}
          </Label>
          <Input
            id={inputId}
            type="search"
            placeholder={placeholder}
            value={searchField.value}
            onChange={(event) => searchField.onChange(event.target.value)}
          />
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={searchField.clear}
            disabled={!searchField.value}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Clear
          </Button>
        </ItemContent>
      </Item>
    </div>
  );
}
