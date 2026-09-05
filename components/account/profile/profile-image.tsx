"use client";

import { useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Trash2 } from "lucide-react";
import getCroppedImg from "./modals/image-crop/crop-image-canvas";
import CropImageModal from "./modals/image-crop/crop-image-modal";

interface ProfileImageProps {
  profileImageUrl?: string | null;
  initials?: string;
}

export default function ProfileImage(props: ProfileImageProps) {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);

  // 1. Intercept file selection and load into cropper
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setIsCropDialogOpen(true);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 2. Handle Modal Close & Cleanup
  const handleCloseModal = () => {
    setIsCropDialogOpen(false);
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
    }
  };

  // 3. Generate cropped file and send to Clerk
  const handleCropAndUpload = async (croppedAreaPixels: any) => {
    if (!selectedImage || !croppedAreaPixels || !user) return;

    try {
      setIsUploading(true);
      
      const croppedFile = await getCroppedImg(selectedImage, croppedAreaPixels);
      await user.setProfileImage({ file: croppedFile });
      
      handleCloseModal();
    } catch (error) {
      console.error("Failed to crop and upload image:", error);
    } finally {
      setIsUploading(false);
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
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage 
            src={user?.imageUrl ?? props.profileImageUrl ?? undefined} 
            alt="Profile Photo" 
          />
          <AvatarFallback className="text-lg bg-muted">
            {props.initials}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <input 
            type="file" 
            accept="image/jpeg, image/png, image/gif"
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect}
          />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isRemoving || !user}
            >
              {isUploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Camera className="size-3.5" />
              )}
              {isUploading ? "Uploading..." : "Change photo"}
            </Button>
            
            {user?.hasImage && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-destructive hover:bg-destructive/10"
                onClick={handleRemoveImage}
                disabled={isUploading || isRemoving}
              >
                {isRemoving ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                {isRemoving ? "Removing..." : "Remove"}
              </Button>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            JPG, PNG or GIF. Max 2MB.
          </p>
        </div>
      </div>

      <CropImageModal
        isOpen={isCropDialogOpen}
        onClose={handleCloseModal}
        selectedImage={selectedImage}
        isUploading={isUploading}
        onSave={handleCropAndUpload}
      />
    </>
  );
}