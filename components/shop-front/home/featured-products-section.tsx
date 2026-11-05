"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Sparkles, Tag } from "lucide-react";
import ProductCard from "@/components/shop-front/product-card";
import { useSearchProducts } from "@/features/catalogue/hooks/use-search-products";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";
import { ProductStatusEnum } from "@/types/enums";
import type { ProductCardDto } from "@/types/product";

type FilterTab = "all" | "featured" | "sale";

// Curated preview items displayed if backend catalogue is empty or syncing
const FALLBACK_PRODUCTS: ProductCardDto[] = [
  {
    id: "koa-heavyweight-tee",
    name: "KOA Heavyweight Oversized Tee — 280 GSM",
    category: {
      id: "cat-tees",
      name: "Tees & Tops",
      code: "TEES",
      isActive: true,
      displayOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    coverImageUrl: "/hero-images/hero-1.jpg",
    sellingPrice: 42,
    discountPercentage: 0,
    isFeatured: true,
    status: ProductStatusEnum.Available,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "koa-pro-stretch-short",
    name: "KOA Pro-Movement Training Shorts 7\"",
    category: {
      id: "cat-shorts",
      name: "Bottoms",
      code: "SHORTS",
      isActive: true,
      displayOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    coverImageUrl: "/hero-images/hero-2.jpg",
    sellingPrice: 48,
    discountPercentage: 15,
    isFeatured: true,
    status: ProductStatusEnum.Available,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "koa-warrior-compression",
    name: "Warrior Seamless Second-Skin Rashguard",
    category: {
      id: "cat-active",
      name: "Activewear",
      code: "ACTIVE",
      isActive: true,
      displayOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    coverImageUrl: "/hero-images/hero-3.jpg",
    sellingPrice: 55,
    discountPercentage: 0,
    isFeatured: true,
    status: ProductStatusEnum.Available,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "koa-raw-fleece-hoodie",
    name: "Core Drop-Shoulder French Terry Hoodie — 450 GSM",
    category: {
      id: "cat-fleece",
      name: "Hoodies & Fleece",
      code: "FLEECE",
      isActive: true,
      displayOrder: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    coverImageUrl: "/hero-images/hero-1.jpg",
    sellingPrice: 78,
    discountPercentage: 20,
    isFeatured: false,
    status: ProductStatusEnum.Available,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function FeaturedProductsSection() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const { data, isLoading } = useSearchProducts({
    pageIndex: 1,
    pageSize: 8,
  });

  const liveItems = data?.items ?? [];
  const hasLiveItems = liveItems.length > 0;
  const itemsToDisplay = hasLiveItems ? liveItems : FALLBACK_PRODUCTS;

  const filteredItems = itemsToDisplay.filter((product) => {
    if (activeTab === "featured") return product.isFeatured;
    if (activeTab === "sale") return product.discountPercentage > 0;
    return true;
  });

  const displayList = filteredItems.length > 0 ? filteredItems : itemsToDisplay;

  return (
    <section id="featured-products" className="w-full scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-primary" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground font-mono">
                Battle-Ready Gear · 2026 Release
              </p>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Featured Essentials
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Built for high exertion and timeless aesthetics. Heavyweight cottons, technical 4-way stretch, and zero shortcuts.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                activeTab === "all"
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Sparkles className="size-3.5" />
              All Pieces
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("featured")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                activeTab === "featured"
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Flame className="size-3.5" />
              Featured
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sale")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                activeTab === "sale"
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Tag className="size-3.5" />
              Special Drops
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-4/5 w-full animate-pulse rounded-xl bg-muted" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {displayList.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* View All CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            href={PAGE_ROUTES.SHOP.SEARCH}
            className="group flex items-center gap-2 rounded-full border border-border bg-card px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-foreground transition-all hover:border-foreground/40 hover:bg-muted hover:shadow-sm"
          >
            Explore Full Catalogue
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
