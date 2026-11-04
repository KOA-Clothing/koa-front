"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ruler } from "lucide-react";

interface SizeGuideProps {
  sizeGuide?: string | null;
  categorySizeGuideUrl?: string | null;
}

export default function SizeGuide({ sizeGuide, categorySizeGuideUrl }: SizeGuideProps) {
  const guideUrl = sizeGuide || categorySizeGuideUrl;
  const [hasFailed, setHasFailed] = useState(false);

  if (!guideUrl) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="link" className="px-0 h-auto">
          <Ruler className="mr-2 size-4" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
          {!hasFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={guideUrl}
              alt="Size guide"
              onError={() => setHasFailed(true)}
              className="size-full object-contain"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              Unable to load size guide
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
