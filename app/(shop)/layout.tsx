import type { Metadata } from "next";

import Footer from "@/components/shop-front/footer";
import { Header } from "@/components/shop-front/header";

export const metadata: Metadata = {
  title: {
    default: "KOA Clothing",
    template: "%s | KOA Clothing",
  },
  description:
    "Sri Lankan menswear and activewear shaped by purpose, clean lines, and movement.",
};

export default function ShopFrontLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-ink">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-control bg-surface px-4 py-3 text-sm font-semibold text-ink-strong focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
