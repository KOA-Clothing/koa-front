"use client"

import { PageHeader } from "@/components/admin/page-header";
import { AddNewButton } from "@/components/general/add-new-button";
import { LayoutGrid } from "lucide-react";

export default function Collection() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={"Product Collections"}
        description={
          "Stock levels per product variant, including reserved quantities and low-stock thresholds."
        }
        icon={<LayoutGrid />}
      />

      <div className="flex items-center justify-end gap-2">
        <AddNewButton onClick={() => console.log("test")} />
      </div>

      
    </div>
  )
}