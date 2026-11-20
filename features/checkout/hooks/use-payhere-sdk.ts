"use client";

import { useCallback, useState } from "react";

/**
 * Tracks whether `window.payhere` is available. The script tag is rendered by
 * `<PayHereScript />`; `handleReady` is its `onReady` callback, which Next.js
 * fires on first load *and* on every later remount, so no mount effect is
 * needed to detect an already-loaded SDK.
 */
export function usePayHereSdk() {
  const [isReady, setIsReady] = useState(false);

  const handleReady = useCallback(() => setIsReady(true), []);

  return { isReady, handleReady };
}
