"use client";

import { useRef, useState } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(imageRef.current, crop);
      await onSave(croppedFile);
    } catch (error) {
      console.error("Failed to crop image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center items-center max-h-[400px] bg-black/5 rounded-md overflow-hidden my-4 p-2">
          {selectedImage && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={1}
              circularCrop
              keepSelection
            >
              <img
                ref={imageRef}
                src={selectedImage}
                onLoad={onImageLoad}
                alt="Crop preview"
                className="max-h-[350px] w-auto object-contain"
              />
            </ReactCrop>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}