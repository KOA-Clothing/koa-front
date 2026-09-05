import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface ProfileImageProps {
  profileImageUrl?: string | null;
  initials?: string
}

export default function ProfileImage(props : ProfileImageProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        <AvatarImage src={props.profileImageUrl ?? undefined} alt="Profile Photo" />
        <AvatarFallback className="text-lg bg-muted">
          {props.initials}
        </AvatarFallback>
      </Avatar>
      
      <div>
        <Button variant="outline" size="sm" className="gap-2">
          <Camera className="size-3.5" />
          Change photo
        </Button>
        <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
      </div>
    </div>
  )
}