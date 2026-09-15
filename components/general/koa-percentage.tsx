"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

interface KoaPercentageProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number) => void;
  className?: string;
}

export default function KoaPercentage({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  className,
}: KoaPercentageProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium leading-none">{label}</span>
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {value}%
        </span>
      </div>
      <SliderPrimitive.Root
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(nextValue) => onValueChange(nextValue)}
        className="relative"
      >
        <SliderPrimitive.Control className="relative flex h-5 w-full touch-none items-center select-none">
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
            <SliderPrimitive.Indicator className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            aria-label={label}
            className="block size-4 rounded-full border border-primary/50 bg-background shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50"
          />
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    </div>
  );
}