"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { CtaLink } from "@/components/shared/cta-link";
import { useSession } from "@/components/auth/session-provider";
import { SITE_NAME } from "@/lib/constants";
import { usePathname, useRouter } from "next/navigation";

type NavLink = { href: string; label: string };

export function MobileMenu({ links }: { links: readonly NavLink[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, logout } = useSession();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState(false);
  const [hydratedPathname, setHydratedPathname] = useState<string | null>(null);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateLocation = () => {
      setHydratedPathname(pathname);
      setHash(window.location.hash);
    };

    updateLocation();

    window.addEventListener("hashchange", updateLocation);

    return () => {
      window.removeEventListener("hashchange", updateLocation);
    };
  }, [pathname]);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const isActive = (href: string) => {
    if (!hydratedPathname) return false;

    // Handle homepage anchor links.
    if (href.startsWith("/#")) {
      return hydratedPathname === "/" && hash === href.slice(1);
    }

    // Handle Home.
    if (href === "/") {
      return hydratedPathname === "/" && !hash;
    }

    // Handle regular and nested routes.
    return hydratedPathname === href || hydratedPathname.startsWith(`${href}/`);
  };

  async function handleLogout() {
    setPending(true);

    try {
      await logout();
    } catch {
      // The session is cleared locally either way.
    }

    setPending(false);
    close();
    router.push("/");
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={open}
        aria-label="Open menu"
        className="flex size-11 cursor-pointer items-center justify-center"
      >
        <Menu aria-hidden className="size-7 text-paper" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="on-ink menu-overlay fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-paper backdrop:bg-transparent"
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-2xl font-extrabold uppercase tracking-tighter">
            {SITE_NAME}
          </span>

          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex size-11 cursor-pointer items-center justify-center"
          >
            <X
              aria-hidden
              className="size-7 text-lime transition-colors hover:text-white"
            />
          </button>
        </div>

        {/* Navigation links */}
        <ul className="flex flex-col gap-2 px-4 pt-10">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={`heading-2 block py-2 transition-colors duration-200 hover:text-lime-400 active:text-lime ${
                    active ? "text-lime" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Authentication actions */}
        <div className="flex flex-col items-start gap-8 px-4 pt-10">
          {status !== "authenticated" && (
            <CtaLink href="/events" size="lg" onClick={close}>
              Event Registration
            </CtaLink>
          )}

          {status === "authenticated" && (
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                onClick={close}
                aria-current={isActive("/dashboard") ? "page" : undefined}
                className="label-caps underline underline-offset-8 hover:text-lime-400"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={pending}
                className="label-caps cursor-pointer underline underline-offset-8 hover:text-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Logging out..." : "Log out"}
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
