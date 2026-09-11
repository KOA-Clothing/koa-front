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
import { TerminalSquareIcon, Columns3Cog, Shirt, Palette, DraftingCompass, ShelvingUnit, ChartLine, ChartLineIcon, ChartSpline, StickyNote, PersonStanding, TimerReset, ScissorsLineDashed, Scissors, UserRound, Users, FileCode, FileCog, Bolt } from "lucide-react"
import { CompanyHeader } from "./company-header"
import { NavSingle } from "./nav-single"

// This is sample data.
const data = {
  TopSingle: [
    {
      name: "Analytics",
      url: "/admin/analytics",
      icon: (
        <ChartSpline/>
      )
    },
    {
      name: "Inventory",
      url: "/admin/inventory",
      icon: (
        <ShelvingUnit/>
      )
    }
  ],
  SubItems: [
    {
      title: "Product Configurations",
      url: "/admin/product-configs/products",
      icon: (
        <Bolt/>
      ),
      isActive: true,
      items: [
        {
          title: "Products",
          url: "/admin/product-configs/products",
          icon: (<Shirt/>)
        },
        {
          title: "Product Variants",
          url: "/admin/product-configs/variants",
          icon: (<ScissorsLineDashed/>)
        }
      ],
    },
    {
      title: "Facets",
      url: "/admin/facets/category",
      icon: (
        <Columns3Cog/>
      ),
      isActive: true,
      items: [
        {
          title: "Categories",
          url: "/admin/facets/category",
          icon: (<StickyNote/>)
        },
        {
          title: "Designs",
          url: "/admin/facets/design",
          icon: (<DraftingCompass/>)
        },
        {
          title: "Colors",
          url: "/admin/facets/color",
          icon: (<Palette/>)
        }
      ],
    }
  ],
  BottomSingle: [
    {
      name: "Customers",
      url: "/admin/customers",
      icon: (
        <Users/>
      )
    },
    {
      name: "Logs",
      url: "/admin/logs",
      icon: (
        <TimerReset/>
      )
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
        <NavSingle projects={data.TopSingle} />
        <NavSub items={data.SubItems} />
        <NavSingle projects={data.BottomSingle} />
      </SidebarContent>

      <SidebarFooter> </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
