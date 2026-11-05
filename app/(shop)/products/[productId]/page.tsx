import type { Metadata } from "next";
import ProductPageClient from "./page-client";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  // const { productId } = await params;
  return {
    title: "Product | KOA Clothing",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  return <ProductPageClient productId={productId} />;
}
