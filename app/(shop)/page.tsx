import { Hero } from "@/components/shop-front/hero";
import ValueTicker from "@/components/shop-front/home/value-ticker";
import FeaturedProductsFeed from "@/components/shop-front/home/featured-products-feed";
import DiscountedProductsFeed from "@/components/shop-front/home/discounted-products-feed";
import CollectionsSpotlight from "@/components/shop-front/home/collections-spotlight";
import BrandStoryBanner from "@/components/shop-front/home/brand-story-banner";
import CategoryGrid from "@/components/shop-front/home/category-grid";
import FeaturesBreakdown from "@/components/shop-front/home/features-breakdown";
import CommunitySection from "@/components/shop-front/home/community-section";
import NewsletterSection from "@/components/shop-front/home/newsletter-section";

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center justify-start bg-background text-foreground">
      <Hero /> 

      <div id="shop-sections" className="w-full flex flex-col items-center">
        {/* <ValueTicker /> */}

        <CategoryGrid />
        
        {/* <FeaturedProductsFeed /> */}

        {/* <DiscountedProductsFeed /> */}

        {/* <CollectionsSpotlight /> */}

        {/* <BrandStoryBanner /> */}

        {/* <FeaturesBreakdown />

        <CommunitySection />

        <NewsletterSection /> */}
      </div>
    </main>
  );
}
