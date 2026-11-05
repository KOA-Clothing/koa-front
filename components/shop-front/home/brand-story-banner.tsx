import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import warriorLogo from "@/public/logo/black/warrior-face.png";

export default function BrandStoryBanner() {
  return (
    <section className="w-full border-t border-border bg-card py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Narrative */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1 text-xs font-mono text-muted-foreground uppercase tracking-[0.18em]">
              <ShieldCheck className="size-3.5 text-primary" />
              The Warrior Ethos · Origins
            </div>

            <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Dressed for the battle.
              <br />
              <span className="text-muted-foreground">Engineered to endure.</span>
            </h2>

            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                The name <strong className="font-semibold text-foreground">KOA</strong> comes from the Hawaiian word for warrior. We chose it deliberately.
              </p>
              <p>
                KOA began on the garment manufacturing floor in Sri Lanka. No investor hype, no shortcuts — just heavyweight fabrics, athletic cuts, and consistent craftsmanship that athletes and teams kept coming back for.
              </p>
              <p>
                Every cut, weight, and stitch is tested for dynamic physical movement. Whether on the platform, the mat, or the street — KOA moves with you.
              </p>
            </div>

            {/* Proof Points */}
            <div className="grid grid-cols-3 gap-4 border-y border-border py-6">
              <div>
                <p className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  100%
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Athletic Form
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  0%
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Middleman Markup
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  SL
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Heritage Craft
                </p>
              </div>
            </div>

            <div>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-background transition-transform duration-200 hover:scale-105 active:scale-95 shadow-md"
              >
                Read The Full Story
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Frame */}
          <div className="relative flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-border bg-linear-to-br from-muted/80 to-muted/20 p-8 flex flex-col items-center justify-center shadow-inner">
              {/* Subtle background radial pattern */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-border)_1px,transparent_1px)] bg-size-[16px_16px] opacity-40"
              />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative size-44 md:size-52 transition-transform duration-500 hover:scale-105">
                  <Image
                    src={warriorLogo}
                    alt="KOA Warrior Emblem"
                    fill
                    sizes="(max-width: 768px) 176px, 208px"
                    className="object-contain drop-shadow-md"
                    priority
                  />
                </div>

                <div className="mt-6 flex flex-col items-center gap-1.5">
                  <span className="font-mono text-xs font-bold tracking-[0.25em] text-foreground uppercase">
                    KOA Clothing
                  </span>
                  <span className="text-[11px] tracking-wider text-muted-foreground uppercase font-medium">
                    Built In Sri Lanka · For Men Who Move
                  </span>
                </div>
              </div>

              {/* Decorative Corner Accents */}
              <div className="absolute top-4 left-4 size-3 border-t-2 border-l-2 border-primary/40" />
              <div className="absolute top-4 right-4 size-3 border-t-2 border-r-2 border-primary/40" />
              <div className="absolute bottom-4 left-4 size-3 border-b-2 border-l-2 border-primary/40" />
              <div className="absolute bottom-4 right-4 size-3 border-b-2 border-r-2 border-primary/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
