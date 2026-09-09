"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface UrlNumberParam {
  kind: "number";
  /** Values below this fall back to `default`. */
  min?: number;
  /** Values above this fall back to `default`. */
  max?: number;
  /** When provided, values not in this list fall back to `default`. */
  in?: readonly number[];
  default?: number;
}

export interface UrlStringParam {
  kind: "string";
  default?: string;
  /** Trimmed before being read from / written to the URL. */
  trim?: boolean;
  maxLength?: number;
}

export type UrlParam = UrlNumberParam | UrlStringParam;

export type UrlParamSchema = Record<string, UrlParam>;

export type UrlState<T extends UrlParamSchema> = {
  [K in keyof T]: T[K] extends UrlNumberParam ? number : string;
};

function parseNumber(value: string | null, spec: UrlNumberParam): number {
  if (value === null || value.trim() === "") return spec.default ?? 0;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return spec.default ?? 0;
  if (spec.in && !spec.in.includes(parsed)) return spec.default ?? 0;
  if (spec.min !== undefined && parsed < spec.min) return spec.default ?? 0;
  if (spec.max !== undefined && parsed > spec.max) return spec.default ?? 0;
  return parsed;
}

function parseString(value: string | null, spec: UrlStringParam): string {
  if (value === null) return spec.default ?? "";
  const trimmed = spec.trim ? value.trim() : value;
  return spec.maxLength !== undefined ? trimmed.slice(0, spec.maxLength) : trimmed;
}

function isDefault(value: unknown, spec: UrlParam): boolean {
  if (spec.kind === "number") return value === (spec.default ?? 0);
  const text = spec.trim ? String(value).trim() : String(value);
  return text === (spec.default ?? "");
}

/**
 * Generic, schema-driven hook that makes URL query params the source of
 * truth for ephemeral UI state (pagination, filters, tab selection...).
 *
 * Declare the params you care about up front:
 *
 *   const { state, setParams, setParam } = useUrlState({
 *     pageIndex: { kind: "number", min: 1, default: 1 },
 *     view: { kind: "string", default: "list" },
 *   });
 *
 * - `state` is derived from `useSearchParams()` on every navigation, so a
 *   changed URL re-renders the component with new values (bookmarkable /
 *   back-forward friendly).
 * - `setParams(partial)` / `setParam(name, value)` apply a `router.replace`
 *   (no history spam, no scroll jump) that **preserves** every other query
 *   param — belonging to this schema or not.
 * - Writing a param back to its default removes it from the URL, keeping
 *   clean, minimal querystrings.
 * - Values that fail parsing fall back to the param's `default`, which keeps
 *   the URL and the derived state in sync.
 *
 * The schema must be a stable object reference (define it at module level or
 * behind a `useMemo`), so the derived `state` doesn't rebuild every render.
 */
export function useUrlState<T extends UrlParamSchema>(schema: T) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo(() => {
    const entries = Object.entries(schema) as [string, UrlParam][];
    const result = {} as UrlState<T>;
    for (const [name, spec] of entries) {
      const raw = searchParams.get(name);
      (result as Record<string, unknown>)[name] =
        spec.kind === "number" ? parseNumber(raw, spec) : parseString(raw, spec);
    }
    return result;
  }, [schema, searchParams]);

  const writeParams = useCallback(
    (patch: Partial<UrlState<T>>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [name, spec] of Object.entries(schema) as [string, UrlParam][]) {
        if (!(name in patch)) continue;
        const value = (patch as Record<string, unknown>)[name];
        if (isDefault(value, spec)) {
          params.delete(name);
        } else {
          params.set(name, String(spec.kind === "string" && spec.trim ? String(value).trim() : value));
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams, schema]
  );

  const setParam = useCallback(
    <K extends keyof T & string>(name: K, value: UrlState<T>[K]) => {
      writeParams({ [name]: value } as unknown as Partial<UrlState<T>>);
    },
    [writeParams]
  );

  const setParams = useCallback(
    (patch: Partial<UrlState<T>>) => {
      writeParams(patch);
    },
    [writeParams]
  );

  return { state, setParam, setParams };
}