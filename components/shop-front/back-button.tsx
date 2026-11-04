"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface BackButtonProps extends React.ComponentProps<typeof Button> {
  fallbackUrl?: string;
  label?: string;
}

export function BackButton({
  fallbackUrl = PAGE_ROUTES.SHOP.SEARCH,
  label = "Go Back",
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={cn(
        "-ml-2 mb-6 w-fit gap-2 text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      <ArrowLeft className="size-3.5" />
      <span>{label}</span>
    </Button>
  );
}