"use client";

import { useEffect, useState } from "react";

/**
 * Returns `value` after it has stayed unchanged for `delay` ms, to avoid
 * firing expensive work (e.g. a server search query) on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}