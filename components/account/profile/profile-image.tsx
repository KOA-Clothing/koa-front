"use client";

import { useUser } from "@clerk/nextjs";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { CropImageDialog } from "./modals/image-crop/crop-image-modal";

interface ProfileImageProps {
  profileImageUrl?: string | null;
  initials?: string;
}

export default function ProfileImage(props: ProfileImageProps) {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setIsCropDialogOpen(true);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeDialogAndCleanup = () => {
    setIsCropDialogOpen(false);
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
    }
  };

  const handleUploadCroppedImage = async (file: File) => {
    if (!user) return;
    try {
      await user.setProfileImage({ file });
      closeDialogAndCleanup();
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw error;
    }
  };

  const handleRemoveImage = async () => {
    if (!user) return;
    try {
      setIsRemoving(true);
      await user.setProfileImage({ file: null });
    } catch (error) {
      console.error("Failed to remove profile image:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Avatar className="size-16 shrink-0">
          <AvatarImage
            src={user?.imageUrl ?? props.profileImageUrl ?? undefined}
            alt="Profile photo"
          />
          <AvatarFallback className="bg-muted text-lg">
            {props.initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <input
            type="file"
            accept="image/jpeg, image/png, image/gif"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="min-h-11 gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isRemoving || !user}
            >
              <Camera className="size-3.5" aria-hidden="true" />
              Change photo
            </Button>

            {user?.hasImage && (
              <Button
                variant="ghost"
                size="sm"
                className="min-h-11 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleRemoveImage}
                disabled={isRemoving}
              >
                {isRemoving ? (
                  <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" />
                ) : (
                  <Trash2 className="size-3.5" aria-hidden="true" />
                )}
                {isRemoving ? "Removing..." : "Remove"}
              </Button>
            )}
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            JPG, PNG or GIF. Max 2MB.
          </p>
        </div>
      </div>

      <CropImageDialog
        isOpen={isCropDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialogAndCleanup();
        }}
        selectedImage={selectedImage}
        onSave={handleUploadCroppedImage}
      />
    </>
  );
}
