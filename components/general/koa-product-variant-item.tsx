import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ColorSwatch from "@/components/general/koa-color-badge";
import KoaEnumBadge from "@/components/general/koa-enum-badge";
import { KoaSwitch } from "@/components/general/koa-switch";
import { clothingSizeBadgeStyles } from "@/lib/configs/enum-badge-styles";
import { clothingSizeLabels } from "@/types/enum-labels";
import { ProductVariantDto } from "@/types/product-variant";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

interface ProductVariantItemProps {
  variant: ProductVariantDto;
  onToggleActive: (variant: ProductVariantDto) => void;
  onRemove: (variant: ProductVariantDto) => void;
}

export default function KoaProductVariantItem({
  variant,
  onToggleActive,
  onRemove,
}: ProductVariantItemProps) {
  return (
    <Item variant="outline" className="rounded-xl p-4">
      {/* Media: vertically center the swatch against the content block.
          `translate-y-0` cancels ItemMedia's description icon offset. */}
      <ItemMedia className="translate-y-0 self-center">
        <ColorSwatch color={variant.color} className="size-9" />
      </ItemMedia>

      {/* Content: min-w-0 lets long color names truncate via line-clamp. */}
      <ItemContent className="min-w-0">
        <ItemTitle>{variant.color.name}</ItemTitle>
        <ItemDescription className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <KoaEnumBadge
            labels={clothingSizeLabels}
            value={variant.size}
            styles={clothingSizeBadgeStyles}
          />
          <code className="font-mono text-xs text-muted-foreground">
            {variant.sku}
          </code>
          <span className="text-muted-foreground/60" aria-hidden="true">
            ·
          </span>
          <span className="text-xs text-muted-foreground">
            Created {new Date(variant.createdAt).toLocaleDateString()}
          </span>
        </ItemDescription>
      </ItemContent>

      {/* Actions: single compact control row with a divider before the
          destructive remove button. */}
      <ItemActions className="shrink-0 gap-3">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          Active
          <KoaSwitch
            checked={variant.isActive}
            onCheckedChange={() => onToggleActive(variant)}
            aria-label={`Toggle active status for ${variant.color.name} ${variant.sku}`}
          />
        </span>

        <span className="h-5 w-px shrink-0 bg-border" aria-hidden="true" />

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(variant)}
          title="Remove variant"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="size-3.5" />
          <span className="sr-only">Remove variant</span>
        </Button>
      </ItemActions>
    </Item>
  );
}