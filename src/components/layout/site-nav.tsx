"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useSession } from "@/components/auth/session-provider";
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
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-lime transition-transform duration-300 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />

      {children}

      {active && (
        <span
          aria-hidden="true"
          className="absolute inset-x-4 bottom-1 h-[3px] bg-ink"
        />
      )}
    </Link>
  );
}

function HoverButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group label-caps relative isolate block cursor-pointer overflow-hidden rounded px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-lime transition-transform duration-300 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      {children}
    </button>
  );
}

function RegisterLink() {
  const { status } = useSession();

  // Logged-out visitors can register.
  if (status === "authenticated") {
    return null;
  }

  return <CtaLink href="/events">Event Registration</CtaLink>;
}

function AuthLinks({ isActive }: { isActive: (href: string) => boolean }) {
  const router = useRouter();
  const { status, logout } = useSession();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);

    try {
      await logout();
    } catch {
      // The session is cleared locally either way.
    }

    setPending(false);
    router.push("/");
  }

  // Logged-out visitors see nothing here.
  if (status !== "authenticated") {
    return null;
  }

  return (
    <>
      <HoverLink href="/dashboard" active={isActive("/dashboard")}>
        Dashboard
      </HoverLink>

      <HoverButton onClick={handleLogout} disabled={pending}>
        {pending ? "Logging out..." : "Log out"}
      </HoverButton>
    </>
  );
}

export function SiteNav() {
  const pathname = usePathname();

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

  const links = [{ href: "/", label: "Home" }, ...NAV_LINKS];

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

  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-paper">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:h-20 md:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label={`${SITE_NAME} home`}
          className="group relative isolate px-5 py-2 text-2xl font-extrabold uppercase tracking-tighter text-paper"
        >
          <Splash className="absolute left-1/2 top-1/2 -z-10 w-32 -translate-x-1/2 -translate-y-1/2 -rotate-3 text-ink transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 md:w-36" />
          {SITE_NAME}
        </Link>

        {/* Main Navigation */}
        <ul className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <HoverLink href={link.href} active={isActive(link.href)}>
                {link.label}
              </HoverLink>
            </li>
          ))}
        </ul>

        {/* Right-side Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <AuthLinks isActive={isActive} />
          <RegisterLink />
        </div>

        {/* Mobile Navigation */}
        <MobileMenu links={links} />
      </nav>
    </header>
  );
}
