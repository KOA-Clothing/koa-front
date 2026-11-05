import Footer from "@/components/shop-front/footer";
import { Header } from "@/components/shop-front/header";
import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: "KOA Clothing | Dressed for the Battle",
  description:
    "KOA is a Sri Lankan menswear and activewear brand. Built for men who move with purpose — clean lines, honest materials, built to last.",
};

export default function ShopFrontLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-background text-foreground"> 
      <Header />
       
      <div className="flex flex-col w-full">
        {children}
      </div> 
      <Footer /> 
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} /> 
    </div>
  );
}
