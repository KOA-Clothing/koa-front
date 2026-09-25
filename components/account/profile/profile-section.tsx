"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import KoaFormField from "@/components/general/koa-form-field";
import { BasicProfileDto } from "@/types/user";

import PasswordStatus from "./password-status";
import ProfileImage from "./profile-image";
import SsoAccounts from "./sso-accounts";
import UpdateUserProfileModal from "./modals/update-user-profile";

interface Props {
  profile?: BasicProfileDto;
  onSave?: (profile: BasicProfileDto) => void;
}

export default function ProfileSection(props: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const profile: BasicProfileDto = props.profile ?? {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    passwordEnabled: false,
    profileImageUrl: "",
    createdAt: "",
    updatedAt: "",
    externalAccounts: [],
  };

  const firstInitial = profile.firstName?.charAt(0).toUpperCase() || "";
  const lastInitial = profile.lastName?.charAt(0).toUpperCase() || "";
  const initials = `${firstInitial}${lastInitial}` || "U";

  return (
    <Card className="border border-border bg-card ring-0">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your basic personal information.</CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            className="min-h-11 min-w-11 text-muted-foreground hover:text-foreground"
            onClick={() => setIsEditOpen(true)}
            aria-label="Edit profile"
          >
            <Pencil className="size-3.5" aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <ProfileImage
            profileImageUrl={profile.profileImageUrl}
            initials={initials}
          />
          <SsoAccounts providers={profile.externalAccounts.map((a) => a.provider)} />
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 [&_input]:min-h-11">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
