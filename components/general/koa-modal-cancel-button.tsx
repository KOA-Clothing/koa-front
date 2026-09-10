import { Button } from "@/components/ui/button";
import { ComponentPropsWithoutRef } from "react";

interface ModalCancelButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  onClick: () => void;
}

export default function KoaModalCancelButton({
  onClick,
  disabled,
  children = "Cancel",
  variant = "outline",
  type = "button",
  ...props
}: ModalCancelButtonProps) {
  return (
    <Button
      variant={variant}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
}