import type { Metadata } from "next";
import { Suspense } from "react";
import ProductSearchPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Search | KOA Clothing",
  description:
    "Search the KOA Clothing wardrobe — performance layers, denim, and everyday essentials built to move with you.",
};

export default async function ProductSearchPage({
  searchParams,
}: PageProps<"/products/search">) {
  const params = await searchParams;

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProductSearchPageClient searchParams={params} />
    </Suspense>
  );
}
