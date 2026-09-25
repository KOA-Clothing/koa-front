import { ShelvingUnit } from "lucide-react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/admin/page-header";

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Inventory"
        description="Track stock availability across products and variants."
        icon={<ShelvingUnit />}
      />
      <AdminEmptyState
        title="No inventory to display"
        description="Stock levels and availability will appear here when inventory data is available."
        icon={<ShelvingUnit className="size-5" />}
      />
    </div>
  );
}
