import { z } from "zod";

/** Every value type a filter can hold once parsed. */
export type FilterValue = string | number | boolean;

/**
 * Runtime metadata for ONE filter. A route declares one spec per key of its
 * filter-bag interface (see `FilterSpecs`).
 *
 * The spec key doubles as the API query param name, so there is deliberately no
 * `param` override — renaming a filter is renaming the wire contract, and that
 * should be a one-line change in both places (the bag interface and here).
 */
export interface FilterSpec<V extends FilterValue> {
  /** Human label used by the filter control and the removable indicator. */
  label: string;
  /**
   * Coerce + validate a raw URL string. Returning `null` means "not a valid
   * value for this filter", so a hand-edited or garbage URL falls back to unset
   * instead of reaching the API.
   *
   * NOTE: `parse`/`format` are declared as methods, not arrow-typed properties,
   * on purpose. `V` appears in both a return position and a parameter position,
   * which makes the property form invariant; method syntax is bivariant, which
   * is what lets a heterogeneous `Record<string, FilterSpec<FilterValue>>` be a
   * valid constraint. Converting these to properties breaks the hooks.
   */
  parse(raw: string): V | null;
  /** Display text for a parsed value. */
  format(value: V): string;
  /** Present on choice filters — lets the route render a select control. */
  options?: readonly { value: V; label: string }[];
}

/** `F[K]` is optional on a filter bag, so drop `undefined` before constraining. */
type FilterValueOf<F, K extends keyof F> = Extract<NonNullable<F[K]>, FilterValue>;

/**
 * One spec per key of a filter bag. Paired with the bag interface through
 * `satisfies`, so a missing or misspelled spec is a compile error rather than a
 * filter that silently never applies.
 */
export type FilterSpecs<F extends object> = {
  [K in keyof F]-?: FilterSpec<FilterValueOf<F, K>>;
};

/**
 * Recovers the bag type from a specs object. A plain per-property conditional
 * (rather than reverse mapped-type inference), so the hooks can stay generic
 * over `S` and still hand the page a fully typed `filters` bag.
 */
export type SpecsToBag<S> = {
  [K in keyof S]: S[K] extends FilterSpec<infer V> ? V : never;
};

/** Shape-agnostic constraint for a specs object accepted by the hooks. */
export type FilterSpecsRecord = Record<string, FilterSpec<FilterValue>>;

export const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * A filter is "unset" only when absent or empty.
 *
 * `false` is a REAL value — `isActive=false` means "inactive only" — so this
 * must never be a falsiness test. Getting that wrong drops the filter and
 * silently returns unfiltered rows, which is a wrong-results bug, not a crash.
 */
export function isFilterUnset(value: unknown): boolean {
  return value === undefined || value === null || value === "";
}

/** Drops unset filters so they never reach the API as empty query params. */
export function serializeFilters(
  filters: object
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => !isFilterUnset(value))
  ) as Record<string, string | number | boolean>;
}

/** Accepts a guid string, or nothing. */
export function guidParser(raw: string): string | null {
  const trimmed = raw.trim();
  return GUID_RE.test(trimmed) ? trimmed : null;
}

/**
 * Accepts a numeric .NET enum value. `Number("")` is `0` and `Number("abc")` is
 * `NaN`, both of which fail the enum schema, so they resolve to unset.
 */
export function enumParser<V extends number>(schema: z.ZodType<V>) {
  return (raw: string): V | null => {
    const parsed = schema.safeParse(Number(raw.trim()));
    return parsed.success ? parsed.data : null;
  };
}

/**
 * Accepts `"true"` / `"false"` only. The third state is *absent*, which means
 * "don't filter on this" — so boolean filters need a tri-state control, not a
 * switch.
 */
export function booleanParser(raw: string): boolean | null {
  const normalized = raw.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return null;
}

/** Turns an existing `Record<Enum, string>` label map into select options. */
export function toOptions<V extends number>(labels: Record<V, string>) {
  return (Object.entries(labels) as [string, string][]).map(([value, label]) => ({
    value: Number(value) as V,
    label,
  }));
}
