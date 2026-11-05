import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PAGE_ROUTES } from "@/lib/configs/page-routes";

interface CategoryItem {
  title: string;
  subtitle: string;
  tag: string;
  searchQuery: string;
  bgGradient: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    title: "Tees & Tops",
    subtitle: "Heavyweight 280 GSM combed cotton & dynamic athletic fits.",
    tag: "Everyday Core",
    searchQuery: "Tee",
    bgGradient: "from-neutral-900/90 via-neutral-900/70 to-neutral-950",
  },
  {
    title: "Hoodies & Fleece",
    subtitle: "450 GSM French Terry, double-layered hoods, drop shoulder drape.",
    tag: "Heavyweight Layering",
    searchQuery: "Hoodie",
    bgGradient: "from-neutral-900/90 via-neutral-900/70 to-neutral-950",
  },
  {
    title: "Shorts & Bottoms",
    subtitle: "Engineered 4-way mechanical stretch with zippered pocket utility.",
    tag: "Movement First",
    searchQuery: "Shorts",
    bgGradient: "from-neutral-900/90 via-neutral-900/70 to-neutral-950",
  },
  {
    title: "Activewear & Compression",
    subtitle: "Seamless second-skin base layers for maximum thermal regulation.",
    tag: "High Exertion",
    searchQuery: "Active",
    bgGradient: "from-neutral-900/90 via-neutral-900/70 to-neutral-950",
  },
];

export default function CategoryGrid() {
  return (
    <section className="w-full border-t border-border bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground font-mono">
              Wardrobe Essentials
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Shop By Category
            </h2>
          </div>
          <Link
            href={PAGE_ROUTES.SHOP.SEARCH}
            className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
          >
            All Products →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={`${PAGE_ROUTES.SHOP.SEARCH}?search=${encodeURIComponent(cat.searchQuery)}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {cat.tag}
                </span>
                <div className="flex size-8 items-center justify-center rounded-full border border-border bg-muted/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-foreground group-hover:text-background">
                  <ArrowUpRight className="size-4" />
                </div>
              </div>

              <div className="mt-16">
                <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:underline underline-offset-4">
                  {cat.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {cat.subtitle}
                </p>
              </div>

              {/* Subtle hover accent bar */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
