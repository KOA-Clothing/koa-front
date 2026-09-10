import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { ComponentPropsWithoutRef, RefObject } from "react";

interface KoaImageInputProps extends Omit<ComponentPropsWithoutRef<"input">, "type" | "onChange"> {
  label: string;
  file: File | null;
  previewUrl: string | null;
  error?: string | null;
  maxSizeMB?: number;
  
  // Update this line to include | null
  fileInputRef: RefObject<HTMLInputElement | null>; 
  
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  containerClassName?: string;
}

export default function KoaImageInput({
  label,
  file,
  previewUrl,
  error,
  maxSizeMB = 10,
  fileInputRef,
  onChange,
  onRemove,
  containerClassName = "flex flex-col gap-2",
  ...inputProps
}: KoaImageInputProps) {
  return (
    <div className={containerClassName}>
      <span className="text-sm leading-none font-medium">{label}</span>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={onChange}
        {...inputProps}
      />

      {!file ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input px-4 py-8 text-sm text-muted-foreground transition-colors outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ImagePlus className="size-6" />
          <span>Click to upload {label.toLowerCase()}</span>
          <span className="text-xs">
            JPG, PNG, WEBP or GIF. Max {maxSizeMB}MB.
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-input p-3">
          {previewUrl && (
            <img
              src={previewUrl}
              alt={`${label} preview`}
              className="size-12 rounded-md object-cover"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            onClick={onRemove}
            title={`Remove ${label.toLowerCase()}`}
          >
            <X className="size-4" />
            <span className="sr-only">Remove {label.toLowerCase()}</span>
          </Button>
        </div>
      )}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}