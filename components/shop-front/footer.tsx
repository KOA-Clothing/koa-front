import Image from "next/image";
import Link from "next/link";

import logo from "@/public/logo/white/koa-logo.png";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/#collection", label: "Collection" },
  { href: "/#story", label: "Our story" },
  { href: "/#principles", label: "Our standard" },
] as const;

const accountLinks = [
  { href: "/account", label: "Account" },
  { href: "/auth/signin", label: "Sign in" },
  { href: "/about", label: "About KOA" },
] as const;

function FooterLinks({ links }: { links: readonly { href: string; label: string }[] }) {
  return (
    <ul className="space-y-1">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="inline-flex min-h-11 items-center text-sm text-on-carbon/75 outline-none transition-colors hover:text-on-carbon focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action-on-dark"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-carbon text-on-carbon">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.5fr)_1fr_1fr] md:gap-10">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="KOA home"
              className="inline-flex min-h-11 items-center rounded-control outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action-on-dark"
            >
              <Image
                src={logo}
                alt=""
                width={180}
                height={67}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-on-carbon/70">
              Sri Lankan menswear and activewear, shaped by purpose, clean
              lines, and movement.
            </p>
          </div>

          <nav aria-label="Explore KOA">
            <h2 className="text-sm font-semibold text-on-carbon">Explore</h2>
            <div className="mt-3">
              <FooterLinks links={exploreLinks} />
            </div>
          </nav>

          <nav aria-label="Account and company">
            <h2 className="text-sm font-semibold text-on-carbon">KOA</h2>
            <div className="mt-3">
              <FooterLinks links={accountLinks} />
            </div>
          </nav>
        </div>

        <div className="mt-12 border-t border-on-carbon/15 pt-6 text-sm text-on-carbon/60">
          © {new Date().getFullYear()} KOA Clothing. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
