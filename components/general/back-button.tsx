import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2 h-9 text-muted-foreground font-medium shadow-none hover:text-foreground hover:bg-muted/50">
      <Link href="/" className="flex flex-row gap-2">
        <ChevronLeft className="size-4" />
      </Link>
    </Button>
  )
}