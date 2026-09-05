"use client"

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Camera, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { BasicProfileDto } from "@/types/user";
import KoaFormField from "@/components/general/koa-form-field";
import UpdateUserProfileModal from "./modals/update-user-profile";
import PasswordStatus from "./password-status";
import SsoAccounts from "./sso-accounts";
import ProfileImage from "./profile-image";

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
      passwordEnabled: false,
      profileImageUrl: "",
      createdAt: "",
      updatedAt: "",
      externalAccounts: []
    }
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (props.profile) {
      setProfile(props.profile);
    }
  }, [props.profile]);

  const firstInitial = profile.firstName?.charAt(0).toUpperCase() || "";
  const lastInitial = profile.lastName?.charAt(0).toUpperCase() || "";
  const initials = `${firstInitial}${lastInitial}` || "U";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your basic personal information.</CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsEditOpen(true)}
            aria-label="Edit profile"
          >
            <Pencil className="size-3.5" />
          </Button>
        </CardAction>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <ProfileImage profileImageUrl={profile.profileImageUrl} initials={initials} />
          <SsoAccounts providers={profile.externalAccounts.map(a => a.provider)} />
        </div>

        {/* <Separator /> */}

        <div className="relative flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <KoaFormField
              readOnly
              id="firstName"
              name="firstName"
              label="First name"
              value={profile.firstName || ""}
            />
            
            <KoaFormField
              readOnly
              id="lastName"
              name="lastName"
              label="Last name"
              value={profile.lastName || ""}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <KoaFormField
              readOnly
              id="email"
              name="email"
              type="email"
              label="Email address"
              value={profile.email || ""}
            />
            <PasswordStatus enabled={profile.passwordEnabled} />
          </div>
        </div>
      </CardContent>

      <UpdateUserProfileModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        profile={profile}
      />
    </Card>
  );
}