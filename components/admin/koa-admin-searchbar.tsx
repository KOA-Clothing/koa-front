import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item, ItemContent } from "@/components/ui/item";
import { RotateCcw } from "lucide-react";

interface SearchFieldState {
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
}

interface KoaSearchBarProps {
  searchField: SearchFieldState;
  placeholder?: string;
  label?: string;
  containerClassName?: string;
}

export default function KoaAdminSearchBar({
  searchField,
  placeholder = "Search...",
  label = "Search",
  containerClassName = "flex flex-col gap-3",
}: KoaSearchBarProps) {
  return (
    <div className={containerClassName}>
      <Item variant="outline" className="rounded-xl bg-background text-foreground">
        <ItemContent className="flex flex-row items-center gap-2">
          <span>{label}</span>
          <Input
            id="search"
            type="text"
            placeholder={placeholder}
            value={searchField.value}
            onChange={(e) => searchField.onChange(e.target.value)}
          />
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={searchField.clear}
          >
            <RotateCcw className="size-4" />
            Clear
          </Button>
        </ItemContent>
      </Item>
    </div>
  );
}