import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface KoaIdFilterIndicatorProps {
  /** Field label, e.g. "Product". */
  label: string;
  /** The id taken from the URL. Renders nothing when this is empty. */
  id: string | undefined;
  /**
   * Human-readable value for the id (e.g. a resolved product name). Falls back
   * to the raw id when the record can't be resolved — which is also what makes
   * a stale deep link to a deleted record legible instead of silent.
   */
  displayValue?: string;
  onClear: () => void;
}

/**
 * Indicator for an id-shaped filter (`?productId=`, `?colorId=`, `?variantId=`).
 *
 * These filters are set by *navigation* — a link from another page that already
 * knows the id — not by browsing a list, so there's no meaningful control to
 * offer and no options endpoint to populate one. Instead the active id is shown
 * as a removable chip, so the admin can see the table is scoped to one record
 * and drop back to the full list.
 *
 * Generic on purpose: any route can drop this in for whatever id filter it
 * declares, without writing route-specific chrome.
 */
export default function KoaIdFilterIndicator({
  label,
  id,
  displayValue,
  onClear,
}: KoaIdFilterIndicatorProps) {
  if (!id) return null;

  const text = displayValue ?? id;
  const clearLabel = `Clear ${label} filter`;

  return (
    <Item variant="outline" size="xs" className="w-auto m-0 px-2 py-1">
      <ItemContent>
        <ItemTitle>
          <span className="text-muted-foreground">{label}:</span> {text}
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <Button
          variant="ghost"
          size="icon-xs"
          type="button"
          onClick={onClear}
          title={clearLabel}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="size-3.5" />
          <span className="sr-only">{clearLabel}</span>
        </Button>
      </ItemActions>
    </Item>
  );
}
