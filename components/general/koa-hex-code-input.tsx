"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface HexCodeInputProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const VALID_HEX = /^[0-9a-fA-F]{6}$/;

export default function KoaHexCodeInput({
  id,
  label = "Hex Code",
  value,
  onChange,
  error,
}: HexCodeInputProps) {
  const isHex = VALID_HEX.test(value);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div
        className={cn(
          "flex h-8 w-full min-w-0 items-center overflow-hidden rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
          error && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
        )}
      >
        <span className="flex h-full items-center border-r border-input bg-input/50 px-2.5 text-sm font-medium text-muted-foreground">
          #
        </span>
        <input
          id={id}
          type="text"
          value={value}
          maxLength={6}
          placeholder="FF0000"
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full min-w-0 flex-1 bg-transparent px-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <span
          aria-hidden
          className="mx-2 size-5 shrink-0 rounded-full border border-input"
          style={{ backgroundColor: isHex ? `#${value}` : "transparent" }}
        />
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}