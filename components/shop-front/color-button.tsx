"use client";

import { cn } from "@/lib/utils";
import type { ColorDto } from "@/types/color";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ColorButtonProps {
  color: ColorDto;
  isSelected: boolean;
  isAvailable: boolean;
  onClick: () => void;
}

export default function ColorButton({
  color,
  isSelected,
  isAvailable,
  onClick,
}: ColorButtonProps) {
  const hasSwatch = !!color.swatchImageUrl;
  const hasHex = !!color.hexCode;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            onClick={onClick}
            disabled={!isAvailable && !isSelected}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all",
              isSelected
                ? "border-foreground bg-foreground text-background"
                : isAvailable
                ? "border-border hover:border-foreground"
                : "border-border opacity-40 cursor-not-allowed"
            )}
          >
            {hasSwatch ? (
              <span className="size-5 rounded-full border border-border overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={color.swatchImageUrl as string}
                  alt={color.name}
                  className="size-full object-cover"
                />
              </span>
            ) : hasHex ? (
              <span
                className="size-5 rounded-full border border-border shrink-0"
                style={{ backgroundColor: "#" + color.hexCode }}
              />
            ) : null}
            <span>{color.name}</span>
          </button>
        }
      />
      <TooltipContent>
        <p>{color.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}
