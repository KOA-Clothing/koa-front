import { Users } from "lucide-react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/admin/page-header";

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Customers"
        description="Review customer accounts and account activity."
        icon={<Users />}
      />
      <AdminEmptyState
        title="No customers to display"
        description="Customer records will appear here when customer data is available."
        icon={<Users className="size-5" />}
      />
    </div>
  );
}
