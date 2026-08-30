"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import logo from "@/public/logo/black/warrior-face.png"

export function CompanyHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="bg-neutral-200 hover:bg-neutral-300 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-colors duration-300"
        >
          <Image
            src={logo}
            alt="KOA Logo"
            width={32}
            height={32}
            className="aspect-square size-8 object-contain shrink-0"
          />
          
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">KOA</span>
            <span className="truncate text-xs text-muted-foreground">Admin Dashboard</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}