"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Sentinel for the "no filter" option. A select item can't carry an empty
 * string, so the unset state gets its own value that we translate back to
 * `null` on the way out.
 */
const ALL_VALUE = "__all__";

export interface KoaFilterSelectOption {
  value: string;
  label: string;
}

/**
 * Adapts a `FilterSpec`'s `options` (whose values are typed enums/booleans) to
 * this component's string-based select, so a route never restates the option
 * list that already lives in its filter spec.
 */
export function toSelectOptions(
  options: readonly { value: string | number | boolean; label: string }[]
): KoaFilterSelectOption[] {
  return options.map((option) => ({
    value: String(option.value),
    label: option.label,
  }));
}

interface KoaFilterSelectProps {
  /** Visible field label, e.g. "Gender". */
  label: string;
  /** Current value, or null/undefined for "no filter". */
  value: string | null | undefined;
  options: readonly KoaFilterSelectOption[];
  /** Receives `null` when the admin picks the "no filter" option. */
  onValueChange: (value: string | null) => void;
  /** Text for the no-filter option. */
  allLabel?: string;
  className?: string;
}

/**
 * One tri-state filter control: a labelled select whose first option means
 * "don't filter on this". Tri-state (rather than a switch) is what allows a
 * boolean filter to have an unset state — without it, `isActive` could only
 * ever be true or false, never "show both".
 */
export default function KoaFilterSelect({
  label,
  value,
  options,
  onValueChange,
  allLabel = "All",
  className,
}: KoaFilterSelectProps) {
  /**
   * Resolved display text for the trigger.
   *
   * This must be passed to <SelectValue /> explicitly: Base UI otherwise
   * surfaces the selected *item's value* ("1", "true") rather than its label
   * ("Male", "True"). Falls back to the raw value before the "no filter"
   * label, so a value with no matching option shows itself instead of
   * silently reading as unfiltered.
   */
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value ?? allLabel;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <Select
        value={value ?? null}
        onValueChange={(next) => onValueChange(next === ALL_VALUE ? null : next)}
      >
        <SelectTrigger size="sm" aria-label={`Filter by ${label}`}>
          <SelectValue placeholder={allLabel}>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value={ALL_VALUE}>{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
