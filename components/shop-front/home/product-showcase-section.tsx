"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeSectionHeader from "./home-section-header";
import ProductShowcaseGrid from "./product-showcase-grid";
import SectionPager from "./section-pager";
import { cn } from "@/lib/utils";
import type { ProductCardDto } from "@/types/product";

/** Copy and destination that differentiate one product showcase from another. */
export interface ShowcaseSectionContent {
  eyebrow: string;
  title: string;
  description: string;
  cta?: {
    label: string;
    href: string;
  };
}

export interface ProductShowcaseSectionProps {
  /** Anchor the feed's pager scrolls back to. */
  sectionId: string;
  content: ShowcaseSectionContent;
  products: ProductCardDto[];
  pageIndex: number;
  totalPages: number;
  onPageChange: (pageIndex: number) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  /** Tints the band so two adjacent showcases read as separate sections. */
  tone?: "default" | "muted";
}

/**
 * Presentational shell shared by the landing page's paginated product
 * showcases (featured, discounted, and any future feed).
 *
 * Owns layout only. The feed container supplies the data, page index and
 * callbacks, while each `*-section.tsx` preset supplies its copy.
 */
export default function ProductShowcaseSection({
  sectionId,
  content,
  products,
  pageIndex,
  totalPages,
  onPageChange,
  isLoading = false,
  isFetching = false,
  tone = "default",
}: ProductShowcaseSectionProps) {
  return (
    <section
      id={sectionId}
      aria-busy={isFetching}
      className={cn(
        "w-full scroll-mt-24 py-16 md:py-24",
        tone === "muted" && "border-y border-border bg-muted/30"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <HomeSectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <div className="mt-10">
          <ProductShowcaseGrid
            products={products}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </div>

        <SectionPager
          pageIndex={pageIndex}
          totalPages={totalPages}
          onPageChange={onPageChange}
          label={`${content.title} pages`}
        />

        {content.cta && (
          <div className="mt-14 flex justify-center">
            <Link
              href={content.cta.href}
              className="group flex items-center gap-2 rounded-full border border-border bg-card px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-foreground transition-all hover:border-foreground/40 hover:bg-muted hover:shadow-sm"
            >
              {content.cta.label}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
