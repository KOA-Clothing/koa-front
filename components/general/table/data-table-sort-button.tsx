"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";

export type SortDirection = "asc" | "desc" | null;

interface DataTableSortButtonProps {
  /** Current sort direction of the column being rendered. */
  sortDir: SortDirection;
  /**
   * Called on click with the click event; cycles asc -> desc -> off.
   * The event is forwarded to TanStack's toggle handler (its default
   * `isMultiSortEvent` inspects `event.shiftKey`).
   */
  onToggleSort: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

/**
 * Presentational clickable header for a sortable column. Rendering the
 * column's header label via <KoaTable />'s `table.FlexRender` and passing
 * it through here keeps this component free of TanStack types, matching the
 * plain-prop pattern of DataTablePagination.
 */
export function DataTableSortButton({
  sortDir,
  onToggleSort,
  children,
}: DataTableSortButtonProps) {
  const SortIcon =
    sortDir === "asc" ? ArrowUp : sortDir === "desc" ? ArrowDown : ChevronsUpDown;

  return (
    <button
      type="button"
      onClick={onToggleSort}
      className="group inline-flex cursor-pointer items-center gap-1 text-xs font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
    >
      {children}
      <SortIcon
        className={
          sortDir
            ? "size-3.5"
            : "size-3.5 text-muted-foreground/40 group-hover:text-muted-foreground"
        }
      />
    </button>
  );
}