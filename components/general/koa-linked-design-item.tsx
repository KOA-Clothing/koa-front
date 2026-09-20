import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { DesignDto } from "@/types/design";

interface KoaLinkedDesignItemProps {
  design: DesignDto;
  onRemove: (design: DesignDto) => void;
}

export default function KoaLinkedDesignItem({
  design,
  onRemove,
}: KoaLinkedDesignItemProps) {
  return (
    <Item variant="outline" size="sm">
      <ItemContent>
        <ItemTitle>{design.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(design)}
          title={`Unlink ${design.name}`}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="size-3.5" />
          <span className="sr-only">Unlink {design.name}</span>
        </Button>
      </ItemActions>
    </Item>
  );
}