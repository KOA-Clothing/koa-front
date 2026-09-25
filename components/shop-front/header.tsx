"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import logo from "@/public/logo/black/koa-logo.png";
import AuthSection from "@/components/shop-front/auth-section";
import NavItem from "@/components/shop-front/nav-item";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/#collection", label: "Collection" },
  { href: "/#story", label: "Story" },
  { href: "/about", label: "About" },
] as const;

function Brand({ priority = false }: { priority?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="KOA home"
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action"
    >
      <Image
        src={logo}
        alt=""
        width={144}
        height={54}
        priority={priority}
        className="h-7 w-auto sm:h-8"
      />
    </Link>
  );
}

function isCurrentPath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/about") {
    return pathname === "/about";
  }

  return false;
}

export function Header() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-hairline bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:min-h-20 lg:px-10">
        <div className="hidden w-full items-center lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8">
          <Brand priority />

          <nav
            aria-label="Primary navigation"
            className="flex items-center justify-center gap-7"
          >
            {navigationItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                text={item.label}
                isActive={isCurrentPath(pathname, item.href)}
              />
            ))}
          </nav>

          <div className="flex justify-end">
            <AuthSection />
          </div>
        </div>

        <div className="flex w-full items-center gap-2 lg:hidden">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="min-h-11 min-w-11 rounded-control text-ink-strong hover:bg-cloud"
                />
              }
            >
              <Menu aria-hidden="true" />
              <span className="sr-only">Open navigation</span>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[88vw] max-w-sm gap-0 bg-background p-0 text-ink [&>button]:size-11 [&>button]:rounded-control"
            >
              <SheetHeader className="border-b border-hairline p-6 pr-16 text-left">
                <SheetTitle className="text-xl font-bold tracking-tight text-ink-strong">
                  Menu
                </SheetTitle>
                <SheetDescription className="text-sm text-pewter">
                  Explore KOA and your account.
                </SheetDescription>
              </SheetHeader>

              <nav
                aria-label="Mobile navigation"
                className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
              >
                {navigationItems.map((item) => {
                  const isActive = isCurrentPath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex min-h-14 items-center justify-between rounded-control px-4 text-base font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-action/40 ${
                        isActive
                          ? "bg-cloud text-ink-strong"
                          : "text-graphite hover:bg-cloud hover:text-ink-strong"
                      }`}
                    >
                      {item.label}
                      {isActive ? (
                        <span
                          aria-hidden="true"
                          className="size-2 rounded-full bg-action"
                        />
                      ) : null}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-hairline p-4">
                <AuthSection showSignUp fullWidth />
              </div>
            </SheetContent>
          </Sheet>

          <Brand />
          <AuthSection className="ml-auto" showSignUp={false} />
        </div>
      </div>
    </header>
  );
}
