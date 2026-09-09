"use client";

import { useEffect, useState } from "react";
import { useDebouncedValue } from "./use-debounced-value";

interface UseSearchFieldOptions {
  /** The committed value (typically from the URL, e.g. `?search=`). */
  value: string;
  /** Commits a value to the URL/state after the debounce settles. */
  onCommit: (value: string) => void;
  debounceMs?: number;
}

export interface SearchField {
  /** The text shown in the input (immediate, while typing). */
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
}

/**
 * Owns the visible text of a URL-backed search box, so a page only has to
 * render `<input value={field.value} onChange={...} />` and never hand-roll
 * the draft/debounce/URL-sync plumbing.
 *
 * - `value`/`onChange` drive the input immediately (local draft).
 * - After typing pauses for `debounceMs`, the settled draft is committed via
 *   `onCommit` (normally `setSearch`, which writes the URL). A stale pending
 *   draft is never committed after a clear (guarded by comparing to `draft`).
 * - External URL changes (deep links / back-forward) flow back into the
 *   draft via a render-phase adjustment — not an effect, so no cascading
 *   renders (this also clears the draft when `value` is reset, e.g. via the
 *   search box's Clear button).
 */
export function useSearchField({
  value,
  onCommit,
  debounceMs = 400,
}: UseSearchFieldOptions): SearchField {
  const [draft, setDraft] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setDraft(value);
  }

  const debouncedDraft = useDebouncedValue(draft, debounceMs);

  useEffect(() => {
    if (debouncedDraft === draft && debouncedDraft !== value) {
      onCommit(debouncedDraft);
    }
  }, [debouncedDraft, draft, value, onCommit]);

  const clear = () => {
    setDraft("");
    onCommit("");
  };

  return {
    value: draft,
    onChange: setDraft,
    clear,
  };
}