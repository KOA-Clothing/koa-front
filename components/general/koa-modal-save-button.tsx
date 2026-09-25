import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

interface ModalSaveButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  isPending?: boolean;
  isUploading?: boolean;
  label?: React.ReactNode;
  loadingLabel?: string;
  uploadingLabel?: string;
}

export default function KoaModalSaveButton({
  isPending = false,
  isUploading = false,
  label = "Save",
  loadingLabel = "Saving...",
  uploadingLabel = "Uploading...",
  type = "button",
  children,
  disabled,
  ...props
}: ModalSaveButtonProps) {
  
  const isBusy = isPending || isUploading;

  // Determine the display text based on priority of states.
  const renderText = () => {
    if (isUploading) return uploadingLabel;
    if (isPending) return loadingLabel;
    return children || label;
  };

  return (
    <Button
      type={type}
      aria-busy={isBusy}
      disabled={isBusy || disabled}
      {...props}
    >
      {isBusy && (
        <Loader2 className="mr-2 size-4 animate-spin motion-reduce:animate-none" />
      )}
      {renderText()}
    </Button>
  );
}