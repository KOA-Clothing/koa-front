"use client"

import * as React from "react"

import { NavSub } from "@/components/admin/sidebar/nav-sub"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TerminalSquareIcon, Columns3Cog, Shirt, Palette, DraftingCompass } from "lucide-react"
import { CompanyHeader } from "./company-header"
import { NavSingle } from "./nav-single"

// This is sample data.
const data = {
  SingleItems: [
    {
      name: "Analytics",
      url: "/admin/analytics",
      icon: (
        <TerminalSquareIcon/>
      )
    }
  ],
  SubItems: [
    {
      title: "Facets",
      url: "/admin/facets/category",
      icon: (
        <Columns3Cog/>
      ),
      isActive: true,
      items: [
        {
          title: "Category",
          url: "/admin/facets/category",
          icon: (<Shirt/>)
        },
        {
          title: "Design",
          url: "/admin/facets/design",
          icon: (<DraftingCompass/>)
        },
        {
          title: "Color",
          url: "/admin/facets/color",
          icon: (<Palette/>)
        }
      ],
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavSingle projects={data.SingleItems} />
        <NavSub items={data.SubItems} />
      </SidebarContent>

      <SidebarFooter> </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
