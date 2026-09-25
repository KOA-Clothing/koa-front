import Link from "next/link";

interface NavItemProps {
  href: string;
  text: string;
  isActive?: boolean;
}

export default function NavItem({ href, text, isActive = false }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`inline-flex min-h-11 items-center border-b-2 px-1 text-sm font-medium outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action ${
        isActive
          ? "border-action text-ink-strong"
          : "border-transparent text-graphite hover:text-ink-strong"
      }`}
    >
      {text}
    </Link>
  );
}
