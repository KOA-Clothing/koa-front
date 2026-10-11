import { Button } from "@/components/ui/button";
import { Item, ItemContent } from "@/components/ui/item";
import { RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

interface KoaAdminFiltersBarProps {
  /**
   * This route's filter controls. The bar knows nothing about them — it only
   * supplies the label, the frame, and the Clear action — so any page can drop
   * in whatever controls it needs.
   */
  children: ReactNode;
  /** Drives the Clear button's disabled state. */
  hasActiveFilters: boolean;
  /**
   * Resets every filter on this page. Should not touch the `search` param —
   * the search box has its own Clear.
   */
  onClearAll: () => void;
  label?: string;
  clearLabel?: string;
  containerClassName?: string;
}

/**
 * Generic shell for a table's filter row, deliberately mirroring
 * <KoaAdminSearchBar />: the same bordered frame, a left-hand label, the
 * route's own controls, and a trailing Clear button.
 *
 * Deliberately filter-agnostic. It never sees a filter bag, a spec map, or a
 * chip — it takes `children` plus two plain values — so adding a filter to a
 * route is a change to that route's controls, never to this component.
 */
export default function KoaAdminFiltersBar({
  children,
  hasActiveFilters,
  onClearAll,
  label = "Filters",
  clearLabel = "Clear",
  containerClassName = "flex flex-col gap-3",
}: KoaAdminFiltersBarProps) {
  return (
    <div className={containerClassName}>
      <Item variant="outline" className="rounded-xl bg-background text-foreground">
        <ItemContent className="flex flex-row flex-wrap items-center gap-2">
          <span>{label} : </span>
          {children}
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onClearAll}
            disabled={!hasActiveFilters}
            className="ml-auto"
          >
            <RotateCcw className="size-4" />
            {clearLabel}
          </Button>
        </ItemContent>
      </Item>
    </div>
  );
}
