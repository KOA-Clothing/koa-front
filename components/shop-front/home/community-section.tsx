import Image from "next/image";
import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  discipline: string;
  location: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "The shoulder drop and neckline on the KOA 280 GSM tees are dialed in. Doesn't choke you when pressing and doesn't lose structure after washing.",
    author: "Kasun M.",
    discipline: "Competitive Powerlifter",
    location: "Colombo",
  },
  {
    quote: "Finally activewear born in Sri Lanka that competes directly with top tier brands in fit, stitch quality, and raw durability. Absolute staple.",
    author: "Dilshan P.",
    discipline: "MMA & Combat Athlete",
    location: "Kandy",
  },
  {
    quote: "Clean lines, honest weights. KOA moves seamlessly from morning conditioning sessions to the rest of the day. Pure purpose.",
    author: "Ryan T.",
    discipline: "Cross-Training & Functional Fitness",
    location: "Galle",
  },
];

export default function CommunitySection() {
  return (
    <section className="w-full border-t border-border bg-card py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground font-mono">
            The Brotherhood
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Worn By Warriors
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            From the iron room to the city streets. Real athletes who demand gear built to endure.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-border bg-muted/20 p-6 md:p-8"
            >
              <div>
                <Quote className="size-6 text-muted-foreground/40 mb-4" />
                <p className="text-sm leading-relaxed text-foreground/90 font-medium italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 border-t border-border pt-4">
                <p className="text-sm font-bold text-foreground">
                  {t.author}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-0.5">
                  <span>{t.discipline}</span>
                  <span className="font-mono text-[11px]">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Social Bar */}
        <div className="mt-14 rounded-2xl border border-border bg-muted/40 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold text-foreground">
              Tag @KOAClothing on Instagram &amp; TikTok
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Use <strong className="text-foreground">#BeKOA</strong> and <strong className="text-foreground">#DressedForTheBattle</strong> to be featured on the official warrior feed.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/koa"
              target="_blank"
              rel="noreferrer"
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card transition-transform hover:scale-110 hover:border-foreground/40"
              aria-label="KOA Instagram"
            >
              <Image
                src="/icons/social-media/instagram-black.svg"
                alt="Instagram"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://www.tiktok.com/koa"
              target="_blank"
              rel="noreferrer"
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card transition-transform hover:scale-110 hover:border-foreground/40"
              aria-label="KOA TikTok"
            >
              <Image
                src="/icons/social-media/tiktok-black.svg"
                alt="TikTok"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://www.facebook.com/koa"
              target="_blank"
              rel="noreferrer"
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card transition-transform hover:scale-110 hover:border-foreground/40"
              aria-label="KOA Facebook"
            >
              <Image
                src="/icons/social-media/facebook-black.svg"
                alt="Facebook"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://wa.me/koa"
              target="_blank"
              rel="noreferrer"
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card transition-transform hover:scale-110 hover:border-foreground/40"
              aria-label="KOA WhatsApp"
            >
              <Image
                src="/icons/social-media/whatsapp-black.svg"
                alt="WhatsApp"
                width={20}
                height={20}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
