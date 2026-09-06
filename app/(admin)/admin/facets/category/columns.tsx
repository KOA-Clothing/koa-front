"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CategoryDto } from "@/types/category" // Adjust this import path to your Zod schema location
import { Badge } from "@/components/ui/badge" // Assuming you use shadcn badge, optional

// Cast to any for the first generic to bypass the strict feature-map typing enforced by TableWithPagination
export const columns: ColumnDef<any, CategoryDto, any>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description
      return description ? (
        <span className="truncate block max-w-50">{description}</span>
      ) : (
        <span className="text-muted-foreground italic">None</span>
      )
    }
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    }
  },
  {
    accessorKey: "sortOrder",
    header: "Sort Order",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString()
    }
  },
]