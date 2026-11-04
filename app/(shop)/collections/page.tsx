import type { Metadata } from "next";
import { Suspense } from "react";
import CollectionsPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Collections | KOA Clothing",
  description:
    "Shop KOA Clothing by collection — denim, activewear, streetwear, and everyday essentials, each curated around a single idea.",
};

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CollectionsPageClient />
    </Suspense>
  );
}
