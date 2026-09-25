import Link from "next/link";

import Footer from "@/components/shop-front/footer";
import { Header } from "@/components/shop-front/header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-control bg-surface px-4 py-3 text-sm font-semibold text-ink-strong focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 items-center bg-parchment px-6 py-24 outline-none sm:py-32"
      >
        <div className="mx-auto w-full max-w-3xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-pewter">
            404
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
            This page has moved out of view.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-secondary">
            The address may be incorrect, or the page may no longer be available.
            Return home to continue exploring KOA.
          </p>
          <Button
            variant="storefront"
            size="storefront"
            className="mt-8"
            render={<Link href="/" />}
          >
            Return home
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
