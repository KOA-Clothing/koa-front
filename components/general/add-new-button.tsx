import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

interface AddNewButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  onClick: () => void;
}

export function AddNewButton({
  label = "Add New",
  onClick,
  className,
  ...props
}: AddNewButtonProps) {
  return (
    <Button onClick={onClick} className={className} {...props}>
      <Plus className="mr-2 size-4" />
      {label}
    </Button>
  );
}