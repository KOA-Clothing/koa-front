import { Switch } from "@/components/ui/switch";
import { cn } from "cn";

function KoaSwitch({
  className,
  ...props
}: React.ComponentProps<typeof Switch>) {
  return (
    <Switch
      className={cn("data-checked:bg-emerald-600 data-unchecked:bg-red-600", className)}
      {...props}
    />
  );
}

export { KoaSwitch };
