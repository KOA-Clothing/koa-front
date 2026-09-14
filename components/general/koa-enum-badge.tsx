import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface KoaEnumBadgeProps<T extends string | number> {
  labels: Record<T, string>;
  value: T;
  styles?: Record<T, string>;
  className?: string;
}

export default function KoaEnumBadge<T extends string | number>({
  labels,
  value,
  styles,
  className,
}: KoaEnumBadgeProps<T>) {
  const style = styles?.[value];

  return (
    <Badge
      variant={style ? "outline" : "secondary"}
      className={cn(style, className)}
    >
      {labels[value] ?? String(value)}
    </Badge>
  );
}