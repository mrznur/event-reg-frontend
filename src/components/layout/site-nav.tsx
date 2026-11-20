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
  transparent = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  transparent?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group label-caps relative isolate block overflow-hidden rounded px-4 py-2.5 transition-colors duration-300 ${
        transparent ? "text-paper/90" : "text-ink"
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-lime transition-transform duration-300 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span className="relative group-hover:text-ink transition-colors duration-300">
        {children}
      </span>
      {active && (
        <span
          aria-hidden="true"
          className={`absolute inset-x-4 bottom-1 h-[3px] ${transparent ? "bg-lime" : "bg-ink"}`}
        />
      )}
    </Link>
  );
}

function HoverButton({
  children,
  onClick,
  disabled = false,
  transparent = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  transparent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group label-caps relative isolate block cursor-pointer overflow-hidden rounded px-4 py-2.5 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
        transparent ? "text-paper/90" : "text-ink"
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-lime transition-transform duration-300 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span className="relative group-hover:text-ink transition-colors duration-300">
        {children}
      </span>
    </button>
  );
}

function AuthActions({ scrolled, isActive }: { scrolled: boolean; isActive: (href: string) => boolean }) {
  const { status } = useSession();
  const router = useRouter();
  const { logout } = useSession();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await logout();
    } catch {
      // session is cleared locally either way
    }
    setPending(false);
    router.push("/");
  }

  if (status === "authenticated") {
    return (
      <>
        <HoverLink href="/dashboard" active={isActive("/dashboard")} transparent={!scrolled}>
          Dashboard
        </HoverLink>
        <HoverButton onClick={handleLogout} disabled={pending} transparent={!scrolled}>
          {pending ? "Logging out..." : "Log out"}
        </HoverButton>
      </>
    );
  }

  return (
    <>
      <HoverLink href="/login" active={isActive("/login")} transparent={!scrolled}>
        Sign In
      </HoverLink>
      <CtaLink href="/signup" className={!scrolled ? "bg-lime/90" : ""}>
        Sign Up
      </CtaLink>
    </>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const [hydratedPathname, setHydratedPathname] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setHydratedPathname(window.location.pathname);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Watch anchor sections on the homepage
  useEffect(() => {
    if (window.location.pathname !== "/") return;

    const sectionIds = NAV_LINKS
      .filter((l) => l.href.startsWith("/#"))
      .map((l) => l.href.slice(2)); // "about", "impact"

    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    // When scrolled back to top, clear active section
    const onScroll = () => {
      if (window.scrollY < 100) setActiveSection("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  const links = [{ href: "/", label: "Home" }, ...NAV_LINKS];

  const isActive = (href: string) => {
    if (!hydratedPathname) return false;
    if (href.startsWith("/#")) {
      return hydratedPathname === "/" && activeSection === href.slice(2);
    }
    if (href === "/") return hydratedPathname === "/" && activeSection === "";
    return hydratedPathname === href || hydratedPathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`
        fixed left-0 right-0 top-0 z-40
        transition-all duration-300 ease-out
        ${scrolled
          ? "border-b border-ink/15 bg-paper/95 backdrop-blur-sm"
          : " border-transparent bg-gradient-to-b from-ink to-transparent backdrop-blur-none"
        }
      `}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:h-20 md:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label={`${SITE_NAME} home`}
          className={`group relative isolate px-5 py-2 text-2xl font-extrabold uppercase tracking-tighter transition-colors duration-300 ${
            scrolled ? "text-paper" : "text-paper"
          }`}
        >
          <Splash className={`absolute left-1/2 top-1/2 -z-10 w-32 -translate-x-1/2 -translate-y-1/2 -rotate-3 transition-all duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 md:w-36 ${
            scrolled ? "text-ink" : "text-white/20"
          }`} />
          {SITE_NAME}
        </Link>

        {/* Main Navigation */}
        <ul className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <HoverLink href={link.href} active={isActive(link.href)} transparent={!scrolled}>
                {link.label}
              </HoverLink>
            </li>
          ))}
        </ul>

        {/* Right-side Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <AuthActions scrolled={scrolled} isActive={isActive} />
        </div>

        {/* Mobile Navigation */}
        <MobileMenu links={links} scrolled={scrolled} />
      </nav>
    </header>
  );
}
