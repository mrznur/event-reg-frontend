"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { CtaLink } from "@/components/shared/cta-link";
import { SITE_NAME } from "@/lib/constants";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };

export function MobileMenu({ links, scrolled }: { links: readonly NavLink[]; scrolled: boolean }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [hydratedPathname, setHydratedPathname] = useState<string | null>(null);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateLocation = () => {
      setHydratedPathname(pathname);
      setHash(window.location.hash);
    };
    updateLocation();
    window.addEventListener("hashchange", updateLocation);
    return () => window.removeEventListener("hashchange", updateLocation);
  }, [pathname]);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const isActive = (href: string) => {
    if (!hydratedPathname) return false;
    if (href.startsWith("/#")) return hydratedPathname === "/" && hash === href.slice(1);
    if (href === "/") return hydratedPathname === "/" && !hash;
    return hydratedPathname === href || hydratedPathname.startsWith(`${href}/`);
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={open}
        aria-label="Open menu"
        className="flex size-11 cursor-pointer items-center justify-center"
      >
        <Menu aria-hidden className={`size-7 transition-colors duration-300 ${scrolled ? "text-ink" : "text-paper"}`} />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="on-ink menu-overlay fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-paper backdrop:bg-transparent"
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-2xl font-extrabold uppercase tracking-tighter">{SITE_NAME}</span>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex size-11 cursor-pointer items-center justify-center"
          >
            <X aria-hidden className="size-7 text-lime transition-colors hover:text-white" />
          </button>
        </div>

        <ul className="flex flex-col gap-2 px-4 pt-10">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={close}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`heading-2 block py-2 transition-colors duration-200 hover:text-lime-400 active:text-lime ${
                  isActive(link.href) ? "text-lime" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6 px-4 pt-10">
          <Link
            href="/log-in"
            onClick={close}
            className="label-caps underline underline-offset-8 hover:text-lime-400"
          >
            Log In
          </Link>
          <CtaLink href="/register" size="lg" onClick={close}>
            Register
          </CtaLink>
        </div>
      </dialog>
    </div>
  );
}
