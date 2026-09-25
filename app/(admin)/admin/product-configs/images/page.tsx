import { Images } from "lucide-react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/admin/page-header";

export default function ProductImages() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Product images"
        description="Manage the imagery used across base products."
        icon={<Images />}
      />
      <AdminEmptyState
        title="Product image tools are not available yet"
        description="Image management will appear here when this workspace is available."
        icon={<Images className="size-5" />}
      />
    </div>
  );
}
