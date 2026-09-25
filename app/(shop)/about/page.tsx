import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import campaignImage from "@/public/hero-images/hero-1.jpg";
import founderImage from "@/public/others/user.png";
import timelineGraphic from "@/public/others/time-line.png";
import warriorFace from "@/public/logo/black/warrior-face.png";

export const metadata: Metadata = {
  title: "About KOA",
  description:
    "Learn about KOA, a Sri Lankan menswear and activewear brand shaped by garment-making experience and purposeful design.",
};

const values = [
  {
    label: "Purpose in the cut",
    body: "We consider the cut, weight, and stitch so each piece works beyond a single setting.",
  },
  {
    label: "Less, but better",
    body: "Clean lines and honest materials take priority over trends and extra detail.",
  },
  {
    label: "Sri Lankan perspective",
    body: "KOA grew from hands-on garment-making experience and a close connection to home.",
  },
  {
    label: "Direct focus",
    body: "We keep the brand clear, approachable, and close to the people who wear it.",
  },
];

const timeline = [
  {
    year: "2019",
    title: "The workshop begins",
    detail:
      "A small garment operation starts with custom orders and relationships built through referrals.",
  },
  {
    year: "2022",
    title: "Custom printing grows",
    detail:
      "Work for university clubs and corporate teams builds practical knowledge and a clearer point of view.",
  },
  {
    year: "2024",
    title: "KOA takes shape",
    detail:
      "The decision is made to launch an independent menswear and activewear label with a focused identity.",
  },
  {
    year: "2025",
    title: "The digital platform",
    detail:
      "The KOA storefront brings the brand online, creating a direct home for its clothing and story.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="bg-background text-ink outline-none">
      <section className="border-b border-hairline bg-surface py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pewter">
              About KOA
            </p>
            <h1 className="mt-5 font-display text-display-campaign font-bold uppercase text-ink-strong">
              Dressed for movement.
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-graphite sm:text-xl">
              KOA is a Sri Lankan menswear and activewear brand built from
              hands-on garment-making experience and a focus on purposeful,
              uncomplicated design.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-product-stage">
            <Image
              src={campaignImage}
              alt="KOA campaign photograph"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="origin-heading"
        className="border-b border-hairline bg-parchment py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-center lg:gap-16 lg:px-10">
          <figure className="mx-auto w-full max-w-sm rounded-card bg-product-stage p-8 sm:p-12">
            <Image
              src={warriorFace}
              alt=""
              width={320}
              height={320}
              className="h-auto w-full"
            />
          </figure>

          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pewter">
              The origin
            </p>
            <h2
              id="origin-heading"
              className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink-strong sm:text-4xl"
            >
              A name chosen for resolve.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-graphite sm:text-lg">
              <p>
                KOA comes from the Hawaiian word for warrior. The name reflects
                resilience, purpose, and the determination to keep moving
                forward.
              </p>
              <p>
                Before KOA was a standalone brand, Kalindu Dilranga built a
                small garment operation in Sri Lanka. Custom printing for
                clubs, teams, and businesses grew through word of mouth and
                repeat relationships.
              </p>
              <p>
                KOA Clothing grew from that practical foundation: a clear idea,
                an independent identity, and clothing designed around movement
                rather than noise.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="values-heading"
        className="border-b border-hairline bg-background py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pewter">
              What guides us
            </p>
            <h2
              id="values-heading"
              className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink-strong sm:text-4xl"
            >
              Quiet principles, clearly held.
            </h2>
          </div>

          <div className="mt-10 grid border-y border-hairline sm:grid-cols-2">
            {values.map((value, index) => (
              <article
                key={value.label}
                className={`py-7 sm:p-8 lg:min-h-56 ${
                  index < values.length - 1
                    ? "border-b border-hairline sm:border-b-0 sm:border-r"
                    : ""
                } ${index % 2 === 0 ? "sm:pl-0" : ""}`}
              >
                <h3 className="text-lg font-semibold text-ink-strong">
                  {value.label}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-pewter">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="timeline-heading"
        className="border-b border-hairline bg-surface py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] lg:gap-16 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pewter">
              The journey
            </p>
            <h2
              id="timeline-heading"
              className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink-strong sm:text-4xl"
            >
              Built one step at a time.
            </h2>
            <div className="mt-8 hidden max-w-xs rounded-card bg-product-stage p-8 sm:block">
              <Image
                src={timelineGraphic}
                alt=""
                width={256}
                height={256}
                className="h-auto w-full"
              />
            </div>
          </div>

          <ol className="border-t border-hairline">
            {timeline.map((entry) => (
              <li
                key={entry.year}
                className="grid gap-3 border-b border-hairline py-7 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-8"
              >
                <p className="font-mono text-sm font-medium tabular-nums text-pewter">
                  {entry.year}
                </p>
                <div>
                  <h3 className="text-lg font-semibold text-ink-strong">
                    {entry.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-pewter">
                    {entry.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="founder-heading"
        className="bg-parchment py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10">
          <figure>
            <div className="relative aspect-square overflow-hidden rounded-card bg-product-stage">
              <Image
                src={founderImage}
                alt="Kalindu Dilranga, founder of KOA"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 text-sm text-pewter">
              Kalindu Dilranga, founder of KOA Clothing
            </figcaption>
          </figure>

          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pewter">
              The founder
            </p>
            <h2
              id="founder-heading"
              className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink-strong sm:text-4xl"
            >
              Kalindu Dilranga
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-graphite sm:text-lg">
              <p>
                Kalindu built the earlier garment operation through referrals,
                repeat customers, and hands-on attention to the work.
              </p>
              <p>
                KOA carries that experience into an independent brand focused on
                material, cut, and a clear identity that people can recognize.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="about-cta-heading"
        className="bg-carbon py-20 text-on-carbon sm:py-24"
      >
        <div className="mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-carbon/70">
            The KOA point of view
          </p>
          <h2
            id="about-cta-heading"
            className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl"
          >
            Purpose in every detail. Movement in every line.
          </h2>
          <Link
            href="/#collection"
            className={buttonVariants({
              variant: "storefront",
              size: "storefront",
              className: "mt-8 rounded-control",
            })}
          >
            Explore the collection
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
