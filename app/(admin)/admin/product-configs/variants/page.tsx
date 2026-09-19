"use client"

import KoaAdminSearchBar from "@/components/admin/koa-admin-searchbar";
import { PageHeader } from "@/components/admin/page-header";
import { useSearchField } from "@/hooks/use-search-field";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { ScissorsLineDashed } from "lucide-react";

export default function ProductVariantsPage() {
  const { pagination, setPagination, search, setSearch } = useServerTableParams();
  const searchField = useSearchField({ value: search, onCommit: setSearch });
  
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={"Product Variants"}
        description={"Product Variants Description"}
        icon={<ScissorsLineDashed />}
      />

      <div className="flex flex-col gap-3">
        <KoaAdminSearchBar
          searchField={searchField}
          placeholder="Search Products..."
        />

        {/* <div className="flex items-center justify-end gap-2">
          <AddNewButton onClick={() => setIsCreateOpen(true)} />
        </div> */}
      </div>
    </div>
  )
}