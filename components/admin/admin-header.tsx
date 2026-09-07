"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "../ui/sidebar";

export default function AdminHeader() {
  return (
    <header className="h-13 flex items-center justify-between border-b px-4 bg-background">
      <SidebarTrigger />
      <div className="flex flex-row gap-4">
        <Show when="signed-in">
          <div className="h-10 p-2 bg-muted hover:bg-accent rounded-lg transition duration-300 flex items-center justify-center">
            <UserButton />
          </div>
        </Show>
      </div>
    </header>
  )
}