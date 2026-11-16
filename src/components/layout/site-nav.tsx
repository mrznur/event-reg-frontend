"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { CtaLink } from "@/components/shared/cta-link";
import { MobileMenu } from "./mobile-menu";

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
          className="text-2xl font-extrabold uppercase tracking-tighter"
        >
          {SITE_NAME}
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => {
            const active = link.href === pathname;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`label-caps underline-offset-8 hover:underline ${
                    active ? "underline" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/login"
            className="label-caps underline-offset-8 hover:underline"
          >
            Organizer login
          </Link>
          <CtaLink href="/events">Register</CtaLink>
        </div>

        <MobileMenu links={NAV_LINKS} />
      </nav>
    </header>
  );
}
