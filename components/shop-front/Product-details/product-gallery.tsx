"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductDetailsImageDto } from "@/types/product";

interface ProductGalleryProps {
  images: ProductDetailsImageDto[];
  selectedColorId?: string | null;
}

export default function ProductGallery({
  images,
  selectedColorId,
}: ProductGalleryProps) {
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      if (a.colorId == null && b.colorId == null) return 0;
      if (a.colorId == null) return -1;
      if (b.colorId == null) return 1;
      if (a.colorId < b.colorId) return -1;
      if (a.colorId > b.colorId) return 1;
      return 0;
    });
  }, [images]);

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (selectedColorId) {
      const index = sortedImages.findIndex(
        (img) => img.colorId === selectedColorId
      );
      if (index >= 0) {
        return index;
      }
    }
    const primaryIndex = sortedImages.findIndex((img) => img.isPrimary);
    return primaryIndex >= 0 ? primaryIndex : 0;
  });

  const [hasFailed, setHasFailed] = useState(false);

  const currentImage = sortedImages[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
    setHasFailed(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
    setHasFailed(false);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setHasFailed(false);
  };

  if (!currentImage || sortedImages.length === 0) {
    return (
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-muted">
        <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageOff className="size-8" />
          <span className="text-sm">No image</span>
        </div>
      </div>
    );
  }

  const showImage = !!currentImage.imageUrl && !hasFailed;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-muted group">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentImage.imageUrl}
            alt={currentImage.altText || "Product image"}
            onError={() => setHasFailed(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-8" />
            <span className="text-sm">Image unavailable</span>
          </div>
        )}

        {sortedImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-lg backdrop-blur transition-opacity hover:bg-background opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-lg backdrop-blur transition-opacity hover:bg-background opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sortedImages.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                index === currentIndex
                  ? "border-foreground"
                  : "border-transparent hover:border-border"
              )}
              aria-label={`View image ${index + 1}`}
            >
              {image.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image.imageUrl}
                  alt={image.altText || `Product thumbnail ${index + 1}`}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-muted">
                  <ImageOff className="size-4 text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
