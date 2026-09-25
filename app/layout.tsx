import type { Metadata } from "next";
import { Geist_Mono, Inter, Oswald } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/components/providers/query-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { koaClerkAppearance } from "@/lib/clerk-appearance";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KOA Clothing",
    template: "%s | KOA Clothing",
  },
  description:
    "Quiet, active menswear designed in Sri Lanka for movement with purpose.",
  applicationName: "KOA Clothing",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased font-sans",
        inter.variable,
        oswald.variable,
        geistMono.variable,
      )}
    >
      <QueryProvider>
        <ClerkProvider appearance={koaClerkAppearance}>
          <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ToasterProvider />
              {children}
            </ThemeProvider>
          </body>
        </ClerkProvider>
      </QueryProvider>
    </html>
  );
}
