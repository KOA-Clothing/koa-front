import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { ProductDetailsDtoSchema } from "@/types/product";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";
import ProductDetailsClient from "@/components/shop-front/Product-details/product-details-client";
import ProductReviews from "@/components/shop-front/Product-details/product-reviews";
import { Button } from "@/components/ui/button";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

async function fetchProduct(productId: string) {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5261";
    const response = await fetch(
      `${baseURL}${API_ROUTES.CATALOGUE.PRODUCT_BY_ID(productId)}`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    try {
      return ProductDetailsDtoSchema.parse(data);
    } catch (e) {
      console.error("Schema parse failed:", e);
      return data as any;
    }
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await fetchProduct(productId);

  if (!product) {
    return {
      title: "Product Not Found | KOA Clothing",
    };
  }

  return {
    title: product.metaTitle || `${product.name} | KOA Clothing`,
    description: product.metaDescription || product.description || undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = await fetchProduct(productId);

  if (!product) {
    return <div>NOT FOUND - {productId}</div>;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <Link href={PAGE_ROUTES.SHOP.SEARCH}>
          <Button variant="ghost" size="sm" className="-ml-2 mb-6 w-fit gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" /> Back to shop
          </Button>
        </Link>
        <ProductDetailsClient product={product} />

        <div className="mt-16">
          <ProductReviews />
        </div>
      </div>
    </main>
  );
}
