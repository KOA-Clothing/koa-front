import { Shield, Layers, Globe, Zap } from "lucide-react";

interface ValueItem {
  index: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const VALUES: ValueItem[] = [
  {
    index: "01",
    title: "Crafted For Movement",
    description: "Athletic cuts, 4-way stretch, and dynamic shape retention. Designed for men who don't sit still.",
    icon: Zap,
  },
  {
    index: "02",
    title: "Honest Materials",
    description: "Heavyweight combed cotton, reinforced flatlock seams, and breathable weave. Zero shortcuts.",
    icon: Layers,
  },
  {
    index: "03",
    title: "Built In Sri Lanka",
    description: "Crafted directly in Sri Lanka's heritage garment manufacturing hub with uncompromised precision.",
    icon: Globe,
  },
  {
    index: "04",
    title: "Direct To Athlete",
    description: "No middlemen, distributor markups, or false hype. Exceptional activewear accessible to all.",
    icon: Shield,
  },
];

export default function ValueTicker() {
  return (
    <section className="w-full border-y border-border bg-card/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {VALUES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.index}
                className="group relative flex flex-col gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground transition-transform duration-300 group-hover:scale-105">
                    <Icon className="size-4" />
                  </div>
                  <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
                    {item.index}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
