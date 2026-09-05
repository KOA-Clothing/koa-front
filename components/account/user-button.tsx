"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { Settings, LogOut, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "U";
  
  const fullName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "User";
  const primaryEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none cursor-pointer">
        <Avatar className="size-9">
          <AvatarImage
            src={user?.imageUrl ?? undefined}
            alt={fullName}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-[320px] p-0 rounded-xl shadow-lg border-border">
        {/* User Info Header */}
        <div className="px-5 pt-5 pb-4 flex items-center gap-4">
          <Avatar className="size-11">
            <AvatarImage
              src={user?.imageUrl ?? undefined}
              alt={fullName}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="font-medium text-[15px] leading-none text-foreground mb-1 truncate">
              {fullName}
            </span>
            <span className="text-[13px] text-muted-foreground truncate">
              {primaryEmail}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col px-5 pb-5 gap-2">
          <DropdownMenuItem className="p-0 flex-1 focus:bg-transparent">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2 h-9 text-muted-foreground font-medium shadow-none hover:text-foreground hover:bg-muted/50">
              <Link href="/account/profile" className="flex flex-row gap-2">
                <Settings className="size-4" />
                Manage account
              </Link>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 flex-1 focus:bg-transparent">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2 h-9 text-muted-foreground font-medium shadow-none hover:text-red-600 hover:bg-muted/50" 
              onClick={() => signOut(() => router.push("/"))}>
              <LogOut className="size-4 flex flex-row gap-2" />
              Sign out
            </Button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}