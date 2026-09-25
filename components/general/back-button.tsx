import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function BackButton() {
  return (
    <Button
      render={<Link href="/" />}
      variant="outline"
      size="lg"
      aria-label="Back to shop"
      className="min-h-11 min-w-11 shrink-0"
    >
      <ChevronLeft className="size-4" aria-hidden="true" />
      Back
    </Button>
  );
}
