import { cn } from "@/lib/utils";

interface RadioIndicatorProps {
  checked: boolean;
}

/**
 * Decorative radio dot for the card-style choices. The real `<input
 * type="radio">` is visually hidden inside each card, so this only mirrors its
 * state for sighted users.
 */
export default function RadioIndicator({ checked }: RadioIndicatorProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
        checked ? "border-foreground" : "border-muted-foreground/40"
      )}
    >
      {checked && <span className="size-2 rounded-full bg-foreground" />}
    </span>
  );
}
