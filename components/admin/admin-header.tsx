"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "../ui/sidebar";

export default function AdminHeader() {
  return (
    <header className="h-13 flex items-center justify-between border-b px-4 bg-background">
      <SidebarTrigger />
      <div className="flex flex-row gap-4">
        <Show when="signed-in">
          <div className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-muted p-2 transition-colors hover:bg-accent">
            <UserButton />
          </div>
        </Show>
      </div>
    </header>
  )
}