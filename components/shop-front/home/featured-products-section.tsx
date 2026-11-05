"use client";

import ProductShowcaseSection, {
  type ProductShowcaseSectionProps,
  type ShowcaseSectionContent,
} from "./product-showcase-section";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";

/** Anchor used by the feed's pager to bring the new page into view. */
export const FEATURED_PRODUCTS_SECTION_ID = "featured-products";

const featuredContent = {
  eyebrow: "Battle-Ready Gear · 2026 Release",
  title: "Featured Products",
  description:
    "Built for high exertion and timeless aesthetics. Heavyweight cottons, technical 4-way stretch, and zero shortcuts.",
  cta: {
    label: "Explore Full Catalogue",
    href: PAGE_ROUTES.SHOP.SEARCH,
  },
} as const satisfies ShowcaseSectionContent;

type FeaturedProductsSectionProps = Omit<
  ProductShowcaseSectionProps,
  "sectionId" | "content" | "tone"
>;

/**
 * Landing-page "Featured Products" preset.
 *
 * Presentational by design: the feed container (`featured-products-feed.tsx`)
 * owns the query, the page index, and the decision to render this section at
 * all. Only the copy that makes this showcase distinct lives here.
 */
export default function FeaturedProductsSection(
  props: FeaturedProductsSectionProps
) {
  return (
    <ProductShowcaseSection
      sectionId={FEATURED_PRODUCTS_SECTION_ID}
      content={featuredContent}
      {...props}
    />
  );
}
