"use client";

import { useCallback, useState } from "react";

/**
 * Page state for a landing-page product showcase.
 *
 * Keeps the 1-based index the feed passes to its query, and scrolls the
 * section back into view after a page change — the pager sits below the grid,
 * so without this the next page would load off-screen above the shopper.
 */
export function useShowcasePage(sectionId: string) {
  const [pageIndex, setPageIndex] = useState(1);

  const goToPage = useCallback(
    (nextPage: number) => {
      if (nextPage === pageIndex) return;

      setPageIndex(nextPage);

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      document.getElementById(sectionId)?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [pageIndex, sectionId]
  );

  return { pageIndex, goToPage };
}
