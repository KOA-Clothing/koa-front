import { cn } from "@/lib/utils";
import { ColorDto } from "@/types/color";

// Omit the native 'color' attribute to avoid conflicts with your ColorDto object
interface ColorSwatchProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  color: ColorDto;
}

export default function ColorSwatch({
  color,
  className,
  style,
  ...props
}: ColorSwatchProps) {
  return (
    <span
      className={cn(
        "size-5 shrink-0 rounded-full border border-border bg-cover bg-center",
        className
      )}
      style={{
        backgroundColor: color.hexCode
          ? `#${color.hexCode}`
          : "var(--color-muted-foreground)",
        backgroundImage: color.swatchImageUrl
          ? `url(${color.swatchImageUrl})`
          : undefined,
        ...style,
      }}
      {...props}
    />
  );
}