"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { CtaLink } from "@/components/shared/cta-link";
import { Splash } from "@/components/shared/splash";
import { MobileMenu } from "./mobile-menu";

function HoverLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="group label-caps relative isolate block overflow-hidden rounded px-4 py-2.5"
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-lime transition-transform duration-300 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      {children}
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-4 bottom-1 h-[3px] bg-ink"
        />
      )}
    </Link>
  );
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-paper">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:h-20 md:px-6 lg:px-8"
      >
        <Link
          href="/"
          aria-label={`${SITE_NAME} home`}
          className="group relative isolate px-5 py-2 text-2xl font-extrabold uppercase tracking-tighter text-paper"
        >
          <Splash className="absolute left-1/2 top-1/2 -z-10 w-32 -translate-x-1/2 -translate-y-1/2 -rotate-3 text-ink transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 md:w-36" />
          {SITE_NAME}
        </Link>

        <ul className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <HoverLink href={link.href} active={link.href === pathname}>
                {link.label}
              </HoverLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <HoverLink href="/login" active={pathname === "/login"}>
            Organizer login
          </HoverLink>
          <CtaLink href="/events">Register</CtaLink>
        </div>

        <MobileMenu links={NAV_LINKS} />
      </nav>
    </header>
  );
}
