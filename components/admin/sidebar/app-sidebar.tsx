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
import {
  BookImage,
  ChartSpline,
  Columns3Cog,
  DraftingCompass,
  Palette,
  ScissorsLineDashed,
  ShelvingUnit,
  Shirt,
  StickyNote,
  SwatchBook,
  TimerReset,
  Users,
} from "lucide-react";
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
      url: "/admin/product-configs/base-products",
      icon: (
        <Shirt/>
      ),
      isActive: true,
      items: [
        {
          title: "Base Products",
          url: "/admin/product-configs/base-products",
          icon: (<ScissorsLineDashed/>)
        },
        {
          title: "Product Variants",
          url: "/admin/product-configs/variants",
          icon: (<SwatchBook/>)
        },
        {
          title: "Product Images",
          url: "/admin/product-configs/images",
          icon: (<BookImage/>)
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
