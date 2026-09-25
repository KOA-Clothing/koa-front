import { ChartSpline } from "lucide-react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PageHeader } from "@/components/admin/page-header";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Analytics"
        description="Monitor store performance and customer activity."
        icon={<ChartSpline />}
      />
      <AdminEmptyState
        title="No analytics to display"
        description="Performance insights will appear here when reporting is available."
        icon={<ChartSpline className="size-5" />}
      />
    </div>
  );
}
