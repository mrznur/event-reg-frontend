"use client";

import { useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { CtaLink } from "@/components/shared/cta-link";
import { SITE_NAME } from "@/lib/constants";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };

export function MobileMenu({ links }: { links: readonly NavLink[] }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={open}
        aria-label="Open menu"
        className="flex size-11 items-center justify-center"
      >
        <Menu aria-hidden className="size-7 hover:cursor-pointer" />
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
            <X aria-hidden className="size-7 text-lime hover:text-white" />
          </button>
        </div>

        <ul className="flex flex-col gap-2 px-4 pt-10">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={close}
                aria-current={link.href === pathname ? "page" : undefined}
                className={`heading-2 block py-2 transition-colors duration-200 active:text-lime hover:text-lime-400 ${
                  link.href === pathname ? "text-lime" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-start gap-8 px-4 pt-10">
          <CtaLink href="/events" size="lg" onClick={close}>
            Register
          </CtaLink>
          <Link
            href="/login"
            onClick={close}
            className="label-caps underline underline-offset-8 hover:text-lime-400"
          >
            Organizer login
          </Link>
        </div>
      </dialog>
    </div>
  );
}
