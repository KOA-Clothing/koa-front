"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Camera } from "lucide-react";
import { Separator } from "../../ui/separator";
import { useState, ChangeEvent } from "react";
import { BasicProfileDto } from "@/types/user";
import KoaFormField from "@/components/general/koa-form-field";

interface Props {
  profile?: BasicProfileDto;
  onSave?: (profile: BasicProfileDto) => void;
}

export default function ProfileSection(props : Props) {
  const [profile, setProfile] = useState<BasicProfileDto>(
    props.profile ?? {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      profileImageUrl: "",
      createdAt: "",
      updatedAt: "",
    }
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (props.onSave) {
      props.onSave(profile);
    }
  };

  const firstInitial = profile.firstName?.charAt(0).toUpperCase() || "";
  const lastInitial = profile.lastName?.charAt(0).toUpperCase() || "";
  const initials = `${firstInitial}${lastInitial}` || "U";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your basic personal information.</CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={profile.profileImageUrl ?? undefined} alt="Profile Photo" />
            <AvatarFallback className="text-lg bg-muted">
              {initials}
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

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KoaFormField
            id="firstName"
            name="firstName"
            label="First name"
            value={profile.firstName || ""}
            onChange={handleChange}
          />
          
          <KoaFormField
            id="lastName"
            name="lastName"
            label="Last name"
            value={profile.lastName || ""}
            onChange={handleChange}
          />
          
          <KoaFormField
            id="email"
            name="email"
            type="email"
            label="Email address"
            value={profile.email || ""}
            onChange={handleChange}
            containerClassName="flex flex-col gap-2 sm:col-span-2"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}