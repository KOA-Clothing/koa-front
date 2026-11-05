"use client";

import ProductShowcaseSection, {
  type ProductShowcaseSectionProps,
  type ShowcaseSectionContent,
} from "./product-showcase-section";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";

/** Anchor used by the feed's pager to bring the new page into view. */
export const DISCOUNTED_PRODUCTS_SECTION_ID = "discounted-products";

const discountedContent = {
  eyebrow: "Last Call · Reduced While Stock Lasts",
  title: "Discounted Products",
  description:
    "Same construction, sharper price. Performance pieces from past drops, marked down until they're gone.",
  cta: {
    label: "Shop All Deals",
    href: PAGE_ROUTES.SHOP.SEARCH,
  },
} as const satisfies ShowcaseSectionContent;

type DiscountedProductsSectionProps = Omit<
  ProductShowcaseSectionProps,
  "sectionId" | "content" | "tone"
>;

/**
 * Landing-page "Discounted Products" preset.
 *
 * Same shell as the featured section, with its own copy and a muted band so
 * the two adjacent showcases read as separate sections. The feed container
 * owns the query and page state.
 */
export default function DiscountedProductsSection(
  props: DiscountedProductsSectionProps
) {
  return (
    <ProductShowcaseSection
      sectionId={DISCOUNTED_PRODUCTS_SECTION_ID}
      content={discountedContent}
      tone="muted"
      {...props}
    />
  );
}
