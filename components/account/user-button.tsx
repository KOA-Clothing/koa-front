"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserButton() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
      "U"
    : "U";
  const fullName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "User";
  const primaryEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Open account menu for ${fullName}`}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar className="size-9">
          <AvatarImage src={user?.imageUrl ?? undefined} alt="" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 rounded-xl p-1.5"
      >
        <div className="flex items-center gap-3 px-3 pb-3 pt-2">
          <Avatar className="size-11 shrink-0">
            <AvatarImage src={user?.imageUrl ?? undefined} alt={fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-foreground">
              {fullName}
            </span>
            {primaryEmail ? (
              <span className="truncate text-xs text-muted-foreground">
                {primaryEmail}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-border pt-1.5">
          <DropdownMenuItem
            render={<Link href="/account/profile" />}
            className="min-h-11 gap-2 px-2 text-muted-foreground"
          >
            <Settings className="size-4" aria-hidden="true" />
            Manage account
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="min-h-11 gap-2 px-2"
            onClick={() => {
              void signOut(() => router.push("/"));
            }}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
