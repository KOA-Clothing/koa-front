import { Switch } from "@/components/ui/switch";
import { cn } from "cn";

function KoaSwitch({
  className,
  ...props
}: React.ComponentProps<typeof Switch>) {
  return (
    <Switch
      className={cn("data-checked:bg-success data-unchecked:bg-input", className)}
      {...props}
    />
  );
}

export { KoaSwitch };
