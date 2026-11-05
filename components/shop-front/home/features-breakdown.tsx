import { Activity, Gauge, Sparkles, Feather } from "lucide-react";

interface SpecItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  metric: string;
  description: string;
}

const SPECS: SpecItem[] = [
  {
    icon: Activity,
    title: "4-Way Dynamic Stretch",
    metric: "360° Elastic Recovery",
    description: "Moves with your body without sagging or binding. Retains original compression and contour wash after wash.",
  },
  {
    icon: Gauge,
    title: "Thermal & Vapor Control",
    metric: "Fast-Evaporate Knit",
    description: "Advanced yarn channeling pulls moisture away from the skin, accelerating dry times during grueling training.",
  },
  {
    icon: Sparkles,
    title: "Zero-Chafe Flatlock Seams",
    metric: "High-Tensile Thread",
    description: "Low-profile stitch architecture eliminates contact friction, preventing skin abrasion under heavy load.",
  },
  {
    icon: Feather,
    title: "Optimal Fabric Density",
    metric: "280 - 450 GSM",
    description: "Calibrated weights provide substantial structural drape while maintaining active breathability.",
  },
];

export default function FeaturesBreakdown() {
  return (
    <section className="w-full border-t border-border bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground font-mono">
            Garment Engineering
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Engineered For The Battle
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We obsess over millimeter measurements, yarn density, and stress-point reinforcement so your gear holds up when you push your limits.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SPECS.map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.title}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs"
              >
                <div>
                  <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted/60 text-foreground">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-foreground">
                    {spec.title}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] font-semibold text-primary uppercase tracking-wider">
                    {spec.metric}
                  </p>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {spec.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
