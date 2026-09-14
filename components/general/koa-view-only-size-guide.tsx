"use client";

import { cn } from "@/lib/utils";

interface KoaViewOnlySizeGuideProps {
  /** Product-level size guide URL. Takes precedence over the category's. */
  productSizeGuide?: string | null;
  /** Category-level size guide URL, used when the product has none. */
  categorySizeGuide?: string | null;
  className?: string;
}

export default function KoaViewOnlySizeGuide({
  productSizeGuide,
  categorySizeGuide,
  className,
}: KoaViewOnlySizeGuideProps) {
  const src = productSizeGuide || categorySizeGuide;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Size guide
      </span>
      {src ? (
        <div className="flex min-h-40 items-center justify-center rounded-lg border border-input p-3">
          <img
            src={src}
            alt="Size guide"
            className="max-h-72 w-auto rounded-md object-contain"
          />
        </div>
      ) : (
        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-input px-4 py-8 text-center text-sm text-muted-foreground">
          No size guide available for this product or its category.
        </div>
      )}
    </div>
  );
}