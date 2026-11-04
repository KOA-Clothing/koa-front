"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";
import ProductDetailsClient from "@/components/shop-front/Product-details/product-details-client";
import ProductReviews from "@/components/shop-front/Product-details/product-reviews";
import { Button } from "@/components/ui/button";
import { useProductDetails } from "@/features/catalogue/hooks/use-product-details";
import { getErrorMessage } from "@/lib/api/errors";
import { useRouter } from "next/navigation";

interface ProductPageClientProps {
  productId: string;
}

export default function ProductPageClient({ productId }: ProductPageClientProps) {
  const router = useRouter();
  const { data: product, isLoading, isError, error } = useProductDetails(productId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
          <Link href={PAGE_ROUTES.SHOP.SEARCH}>
            <Button variant="ghost" size="sm" className="-ml-2 mb-6 w-fit gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-3.5" /> Back to shop
            </Button>
          </Link>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 animate-pulse">
            <div className="aspect-4/5 rounded-2xl bg-muted" />
            <div className="flex flex-col gap-4">
              <div className="h-8 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-12 w-1/3 rounded bg-muted" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
          <Link href={PAGE_ROUTES.SHOP.SEARCH}>
            <Button variant="ghost" size="sm" className="-ml-2 mb-6 w-fit gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-3.5" /> Back to shop
            </Button>
          </Link>
          <div className="py-20 text-center text-muted-foreground">
            {isError ? getErrorMessage(error) : `Product not found`}
          </div>
        </div>
      </main>
    );
  }

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push(PAGE_ROUTES.SHOP.SEARCH);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="-ml-2 mb-6 w-fit gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Go Back
        </Button>
        <ProductDetailsClient product={product} />

        <div className="mt-16">
          <ProductReviews />
        </div>
      </div>
    </main>
  );
}
