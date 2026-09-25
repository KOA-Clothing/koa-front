import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Hero } from "@/components/shop-front/hero";
import campaignImageOne from "@/public/hero-images/hero-2.jpg";
import campaignImageTwo from "@/public/hero-images/hero-3.jpg";

const collectionPillars = [
  {
    number: "01",
    title: "Movement",
    body: "Considered pieces for training, travel, and the pace of everyday life.",
  },
  {
    number: "02",
    title: "Restraint",
    body: "Clean lines and useful detail keep the garment, not the trend, in focus.",
  },
  {
    number: "03",
    title: "Local perspective",
    body: "Rooted in Sri Lanka and informed by practical garment-making experience.",
  },
];

const principles = [
  {
    title: "Purpose in the cut",
    body: "Every line should earn its place and support the way the garment is worn.",
  },
  {
    title: "Material first",
    body: "Honest materials and considered construction come before decoration.",
  },
  {
    title: "Made with perspective",
    body: "Practical knowledge from Sri Lanka shapes the brand's point of view.",
  },
  {
    title: "Direct focus",
    body: "A clear identity and a closer relationship with the people who wear KOA.",
  },
];

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="bg-background text-ink outline-none">
      <Hero />

      <section
        id="collection"
        aria-labelledby="collection-heading"
        className="scroll-mt-20 bg-surface py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pewter">
                The KOA collection
              </p>
              <h2
                id="collection-heading"
                className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink-strong sm:text-4xl"
              >
                A wardrobe for motion, focus, and everything between.
              </h2>
            </div>
            <Link
              href="/about"
              className="group inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-ink-strong outline-none transition-colors hover:text-action focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action"
            >
              Read our story
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-10 grid border-y border-hairline md:grid-cols-3">
            {collectionPillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className={`py-7 md:px-7 md:py-8 ${
                  index < collectionPillars.length - 1
                    ? "border-b border-hairline md:border-b-0 md:border-r"
                    : ""
                } ${index === 0 ? "md:pl-0" : ""}`}
              >
                <p className="font-mono text-xs font-medium tabular-nums text-pewter">
                  {pillar.number}
                </p>
                <h3 className="mt-5 text-lg font-semibold text-ink-strong">
                  {pillar.title}
                </h3>
                <p className="mt-2 max-w-sm text-base leading-relaxed text-pewter">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="story"
        aria-labelledby="story-heading"
        className="scroll-mt-20 bg-parchment py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10">
          <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr] sm:items-end">
            <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-product-stage">
              <Image
                src={campaignImageOne}
                alt="KOA campaign photograph"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 34vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-card bg-product-stage sm:mb-12">
              <Image
                src={campaignImageTwo}
                alt="KOA editorial campaign detail"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 22vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pewter">
              Our story
            </p>
            <h2
              id="story-heading"
              className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink-strong sm:text-4xl"
            >
              A brand built from craft, not noise.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-graphite sm:text-lg">
              <p>
                KOA grew out of a small garment operation in Sri Lanka, built
                around custom work and lasting relationships.
              </p>
              <p>
                That experience shaped a straightforward idea: make clothing
                with purpose, keep the details honest, and let the person
                wearing it lead.
              </p>
            </div>
            <Link
              href="/about"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-strong outline-none transition-colors hover:text-action focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action"
            >
              Meet KOA
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="principles"
        aria-labelledby="principles-heading"
        className="scroll-mt-20 bg-carbon py-16 text-on-carbon sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-carbon/70">
              Our standard
            </p>
            <h2
              id="principles-heading"
              className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl"
            >
              Quiet decisions, made consistently.
            </h2>
          </div>

          <div className="mt-10 grid border-y border-hairline sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle, index) => (
              <article
                key={principle.title}
                className={`py-7 sm:px-7 lg:min-h-56 lg:py-8 ${
                  index < principles.length - 1
                    ? "border-b border-hairline lg:border-b-0 lg:border-r"
                    : ""
                } ${index === 0 ? "lg:pl-0" : ""}`}
              >
                <h3 className="text-lg font-semibold">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-carbon/70 sm:text-base">
                  {principle.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="closing-heading"
        className="bg-surface py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pewter">
            Move with intention
          </p>
          <h2
            id="closing-heading"
            className="mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink-strong sm:text-5xl"
          >
            Clothing should support the day, not compete with it.
          </h2>
          <Link
            href="/about"
            className={buttonVariants({
              variant: "storefront",
              size: "storefront",
              className: "mt-8 rounded-control",
            })}
          >
            Discover the KOA story
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
