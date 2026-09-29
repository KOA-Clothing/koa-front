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
import { ShelvingUnit, ChartSpline, TimerReset, Users, BookImage, SwatchBook, FileCog, PaintBucket, File, SplinePointer } from "lucide-react"
import { CompanyHeader } from "./company-header"
import { NavSingle } from "./nav-single"
import { BaseShirtIcon } from "@/components/general/custom-icons/base-shirt-icon"
import { ShirtCogIcon } from "@/components/general/custom-icons/shirt-cog-icon"

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
        <ShirtCogIcon/>
      ),
      isActive: true,
      items: [
        {
          title: "Base Products",
          url: "/admin/product-configs/base-products",
          icon: (<BaseShirtIcon />)
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
        <FileCog />
      ),
      isActive: true,
      items: [
        {
          title: "Categories",
          url: "/admin/facets/category",
          icon: (<File />)
        },
        {
          title: "Designs",
          url: "/admin/facets/design",
          icon: (<SplinePointer/>)
        },
        {
          title: "Colors",
          url: "/admin/facets/color",
          icon: (<PaintBucket/>)
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
