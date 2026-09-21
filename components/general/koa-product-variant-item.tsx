import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ColorSwatch from "@/components/general/koa-color-badge";
import KoaEnumBadge from "@/components/general/koa-enum-badge";
import { KoaSwitch } from "@/components/general/koa-switch";
import { clothingSizeBadgeStyles } from "@/lib/configs/enum-badge-styles";
import { clothingSizeLabels } from "@/types/enum-labels";
import { ProductVariantDto } from "@/types/product-variant";

// Import the new shadcn/ui item components
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
    // Added `items-center` here to align all children vertically along the horizontal axis
    <Item variant="outline" className="items-center rounded-xl p-4">
      {/* 1. Media (Left side) */}
      <ItemMedia>
        <ColorSwatch color={variant.color} className="size-8" />
      </ItemMedia>

      {/* 2. Content (Middle) */}
      <ItemContent>
        <ItemTitle>{variant.color.name}</ItemTitle>
        <ItemDescription className="mt-1 flex items-center gap-1.5">
          <KoaEnumBadge
            labels={clothingSizeLabels}
            value={variant.size}
            styles={clothingSizeBadgeStyles}
          />
          <code className="font-mono text-xs text-muted-foreground">
            {variant.sku}
          </code>
        </ItemDescription>
      </ItemContent>

      {/* 3. Actions (Right side) */}
      <ItemActions className="flex items-center gap-5">
        <div className="flex flex-col items-end gap-1.5">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            Active status
            <KoaSwitch
              checked={variant.isActive}
              onCheckedChange={() => onToggleActive(variant)}
            />
          </span>
          <span className="text-xs text-muted-foreground">
            Created {new Date(variant.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(variant)}
          title="Remove variant"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="size-3.5" />
          <span className="sr-only">Remove Variant</span>
        </Button>
      </ItemActions>
    </Item>
  );
}