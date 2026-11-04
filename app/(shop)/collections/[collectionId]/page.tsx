import type { Metadata } from "next";
import { Suspense } from "react";
import CollectionItemsPageClient from "./page-client";

interface CollectionItemsPageProps {
  params: Promise<{ collectionId: string }>;
}

export async function generateMetadata({
  params,
}: CollectionItemsPageProps): Promise<Metadata> {
  const { collectionId } = await params;
  return {
    title: "Collection Products | KOA Clothing",
    description: `Shop products from this KOA Clothing curated collection (${collectionId}).`,
  };
}

export default async function CollectionItemsPage({
  params,
}: CollectionItemsPageProps) {
  const { collectionId } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CollectionItemsPageClient collectionId={collectionId} />
    </Suspense>
  );
}
