"use client";

import { useState } from "react";
import { useServerTableParams } from "@/hooks/use-server-table-params";
import { useSearchField } from "@/hooks/use-search-field";
import { useDesigns } from "@/features/design/hooks/use-designs";
import { useDesignMutations } from "@/features/design/hooks/use-design-mutations";
import { getDesignColumns } from "./columns";
import { DesignDto } from "@/types/design";
import { KoaTable } from "@/components/general/table/koa-table";
import { RotateCcw, Palette } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Item, ItemContent } from "@/components/ui/item";
import { Button } from "@/components/ui/button";

export default function DesignsPage() {
  const { pagination, setPagination, search, setSearch } = useServerTableParams();
  const searchField = useSearchField({ value: search, onCommit: setSearch });

  const [designToEdit, setDesignToEdit] = useState<DesignDto | null>(null);
  const [designToDelete, setDesignToDelete] = useState<DesignDto | null>(null);

  const { data, isLoading } = useDesigns(pagination, search);
  const { toggleActiveStatus } = useDesignMutations();

  const handleToggleActiveStatus = (design: DesignDto) => {
    toggleActiveStatus.mutate(design.id);
  };

  console.log(searchField.value)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={"Design"}
        description={"The visual pattern, artwork, or print applied to a garment."}
        icon={<Palette />}
      />

      <div className="flex flex-col gap-3">
        <Item variant="outline" className="rounded-xl bg-background text-foreground">
          <ItemContent className="flex flex-row items-center gap-2">
            <span>Search </span>
            <Input
              id="search"
              type="text"
              placeholder="Search designs..."
              value={searchField.value}
              onChange={(e) => searchField.onChange(e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={searchField.clear}
            >
              <RotateCcw />
              Clear
            </Button>
          </ItemContent>
        </Item>
      </div>

      <KoaTable
        columns={getDesignColumns({
          onEdit: setDesignToEdit,
          onDelete: setDesignToDelete,
          toggleActiveStatus: handleToggleActiveStatus,
        })}
        data={data?.items ?? []}
        rowCount={data?.totalRecords ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
}