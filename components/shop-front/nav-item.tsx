'use client'

import Link from "next/link";

interface NavItemProps {
  href: string;
  text: string;
  isSolidActive: boolean;
}

export default function NavItem({ href, text, isSolidActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`px-5 py-3 rounded-full text-sm font-medium transition duration-300 ${
        isSolidActive
          ? 'text-foreground hover:bg-foreground hover:text-background'
          : 'text-white hover:bg-black hover:text-white'
      }`}
    >
      {text}
    </Link>
  )
}