import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import heroImage from "@/public/hero-images/hero-1.jpg";

export function Hero() {
  return (
    <section className="relative isolate grid min-h-[clamp(34rem,72svh,50rem)] w-full overflow-hidden bg-carbon">
      <Image
        src={heroImage}
        alt="KOA campaign photograph"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-carbon/50"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-end px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="max-w-4xl text-on-carbon">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-on-carbon/80 sm:text-sm">
            Sri Lankan menswear and activewear
          </p>
          <h1 className="max-w-4xl font-display text-display-campaign font-bold uppercase text-balance">
            Quiet strength, built to move.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-carbon/85 sm:text-xl">
            A clear approach to clothing, shaped by purpose, clean lines, and
            the rhythm of everyday movement.
          </p>
          <Link
            href="/#collection"
            className={buttonVariants({
              variant: "storefront",
              size: "storefront",
              className: "mt-8 rounded-control",
            })}
          >
            View the collection
            <ArrowDown aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
