"use client";

interface ProductCareInfoProps {
  material?: string | null;
  careInstructions?: string | null;
}

export default function ProductCareInfo({
  material,
  careInstructions,
}: ProductCareInfoProps) {
  if (!material && !careInstructions) return null;

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-6">
      {material && (
        <div>
          <h3 className="text-sm font-semibold mb-1">Material</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {material}
          </p>
        </div>
      )}
      {careInstructions && (
        <div>
          <h3 className="text-sm font-semibold mb-1">Care Instructions</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {careInstructions}
          </p>
        </div>
      )}
    </div>
  );
}
