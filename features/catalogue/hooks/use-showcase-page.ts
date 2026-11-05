"use client";

import { useCallback, useState } from "react";

interface UseShowcasePageOptions {
  /**
   * Whether to scroll the section into view after a page change. Bottom
   * pagers need it; side-mounted carousel arrows don't.
   */
  scroll?: boolean;
}

/**
 * Page state for a landing-page showcase.
 *
 * Keeps the 1-based index the feed passes to its query, and (optionally)
 * scrolls the section back into view after a page change.
 */
export function useShowcasePage(
  sectionId: string,
  { scroll = true }: UseShowcasePageOptions = {}
) {
  const [pageIndex, setPageIndex] = useState(1);

  const goToPage = useCallback(
    (nextPage: number) => {
      if (nextPage === pageIndex) return;

      setPageIndex(nextPage);

      if (!scroll) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      document.getElementById(sectionId)?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [pageIndex, sectionId, scroll]
  );

  return { pageIndex, goToPage };
}
