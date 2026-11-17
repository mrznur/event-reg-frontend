
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

async function FooterYear() {
  await connection();
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="on-ink bg-ink text-paper">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 md:grid-cols-12 md:px-6 lg:px-8">
        <div className="md:col-span-7">
          <p className="display-l">{SITE_NAME}</p>
          <p className="mt-4 max-w-md text-stone">
            Big ideas. Real people. Unforgettable experiences.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="label-caps text-stone">Explore</p>
          <ul className="mt-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="underline-offset-8 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <p className="label-caps text-stone">For Organizers</p>
          <ul className="mt-4 space-y-3">
            <li>
              <Link
                href="/login"
                className="underline-offset-8 hover:underline"
              >
                Organizer Login
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="underline-offset-8 hover:underline"
              >
                Organizer Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/15">
        <p className="mx-auto max-w-[1440px] px-4 py-6 text-sm text-stone md:px-6 lg:px-8">
          ©{" "}
          <Suspense fallback="2026">
            <FooterYear />
          </Suspense>{" "}
          {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}