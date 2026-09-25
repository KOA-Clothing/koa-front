import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImagePlus, X } from "lucide-react";
import { type ComponentPropsWithoutRef, type RefObject, useId } from "react";

interface KoaImageInputProps extends Omit<ComponentPropsWithoutRef<"input">, "type" | "onChange"> {
  label: string;
  file: File | null;
  /** Blob URL of the newly picked file, or the URL of an existing uploaded image. */
  previewUrl: string | null;
  /** Existing uploaded image shown when no new file is picked. */
  existingUrl?: string | null;
  error?: string | null;
  maxSizeMB?: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
  
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  containerClassName?: string;
}

export default function KoaImageInput({
  label,
  file,
  previewUrl,
  existingUrl = null,
  error,
  maxSizeMB = 10,
  fileInputRef,
  onChange,
  onRemove,
  containerClassName = "flex flex-col gap-2",
  ...inputProps
}: KoaImageInputProps) {
  const generatedId = useId();
  const inputId = inputProps.id ?? generatedId;
  const errorId = `${inputId}-error`;
  const describedBy =
    [inputProps["aria-describedby"], error ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={containerClassName}>
      <Label htmlFor={inputId} className="text-sm font-medium leading-none">
        {label}
      </Label>
      <input
        {...inputProps}
        ref={fileInputRef}
        id={inputId}
        type="file"
        className="hidden"
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />

      {!file && !existingUrl ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex min-h-11 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input px-4 py-8 text-sm text-muted-foreground transition-colors outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ImagePlus className="size-6" aria-hidden="true" />
          <span>Click to upload {label.toLowerCase()}</span>
          <span className="text-xs">
            JPG, PNG, WEBP or GIF. Max {maxSizeMB}MB.
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-input p-3">
          {previewUrl && (
            // Blob and already-uploaded URLs are not optimizable by next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={`${label} preview`}
              className="size-12 rounded-md object-cover"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            {file ? (
              <>
                <span className="truncate text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </>
            ) : (
              <span className="truncate text-sm font-medium">
                Current {label.toLowerCase()}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            className="min-h-11 min-w-11"
            onClick={onRemove}
            title={`Remove ${label.toLowerCase()}`}
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Remove {label.toLowerCase()}</span>
          </Button>
        </div>
      )}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}