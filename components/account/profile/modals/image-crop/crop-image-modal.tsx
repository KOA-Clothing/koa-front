"use client";

import { useRef, useState } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import getCroppedImg from "./crop-image-canvas";

interface CropImageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImage: string | null;
  onSave: (file: File) => Promise<void>;
}

export function CropImageDialog({
  isOpen,
  onOpenChange,
  selectedImage,
  onSave,
}: CropImageDialogProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        { unit: "%", width: 80 },
        1, // 1:1 Aspect Ratio
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const handleSave = async () => {
    if (!imageRef.current || !crop) return;

    try {
      setError(null);
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(imageRef.current, crop);
      await onSave(croppedFile);
    } catch (cropError) {
      console.error("Failed to crop image:", cropError);
      setError("We could not save this image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop profile picture</DialogTitle>
          <DialogDescription>
            Adjust the framing before saving your profile image.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 flex max-h-96 items-center justify-center overflow-hidden rounded-md bg-muted p-2">
          {selectedImage && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={1}
              circularCrop
              keepSelection
            >
              {/* react-image-crop requires a native image element and ref. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={selectedImage}
                onLoad={onImageLoad}
                alt="Profile image crop preview"
                className="max-h-80 w-auto object-contain"
              />
            </ReactCrop>
          )}
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-control border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="min-h-11"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="min-h-11"
            disabled={isProcessing || !crop}
          >
            {isProcessing && (
              <Loader2 className="mr-2 size-4 animate-spin motion-reduce:animate-none" />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}