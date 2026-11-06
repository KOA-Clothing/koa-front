import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/components/providers/query-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KOA Clothing",
  description: "KOA Clothing is a Sri Lankan menswear and activewear brand built for men who move with purpose, clean lines, honest materials, built to last.",
  metadataBase: new URL("https://koaclothing.shop"),
  openGraph: {
    title: "KOA Clothing",
    description: "KOA Clothing is a Sri Lankan menswear and activewear brand built for men who move with purpose, clean lines, honest materials, built to last.",
    url: "https://koaclothing.shop",
    siteName: "KOA Clothing",
    images: [
      {
        url: "/public/logo/black/warrior-face.png",
        width: 400,
        height: 400,
        alt: "KOA Clothing Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-string", // Get this from Google Search Console
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <QueryProvider>
        <ClerkProvider>
          <body className="min-h-full flex flex-col">
            <ToasterProvider />
              <TooltipProvider> 
                {children}
              </TooltipProvider>
            <Analytics />
            <SpeedInsights />
          </body>
        </ClerkProvider>
      </QueryProvider>
    </html>
  );
}
