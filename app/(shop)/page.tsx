import { Hero } from "@/components/shop-front/hero";
import ValueTicker from "@/components/shop-front/home/value-ticker";
import FeaturedProductsSection from "@/components/shop-front/home/featured-products-section";
import CollectionsSpotlight from "@/components/shop-front/home/collections-spotlight";
import BrandStoryBanner from "@/components/shop-front/home/brand-story-banner";
import CategoryGrid from "@/components/shop-front/home/category-grid";
import FeaturesBreakdown from "@/components/shop-front/home/features-breakdown";
import CommunitySection from "@/components/shop-front/home/community-section";
import NewsletterSection from "@/components/shop-front/home/newsletter-section";

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center justify-start bg-background text-foreground">
      {/* ── 01. HERO WITH EMBLA CAROUSEL & PRIMARY CTAs ── */}
      <Hero /> 

      {/* ── 02. ANCHOR & CORE SECTIONS ── */}
      <div id="shop-sections" className="w-full flex flex-col items-center">
        {/* Brand Value Propositions / Trust Strip */}
        <ValueTicker />

        {/* Featured Products / New Battle-Ready Essentials */}
        <FeaturedProductsSection />

        {/* Curated Drops / Signature Collections Spotlight */}
        <CollectionsSpotlight />

        {/* The Warrior Story & Heritage Banner */}
        <BrandStoryBanner />

        {/* Shop By Category Visual Navigator */}
        <CategoryGrid />

        {/* Garment Engineering & Technical Fabric Breakdown */}
        <FeaturesBreakdown />

        {/* Community Proof & Athlete Testimonials */}
        {/* <CommunitySection /> */}

        {/* VIP Early Access & Newsletter Lead Capture */}
        <NewsletterSection />
      </div>
    </main>
  );
}
