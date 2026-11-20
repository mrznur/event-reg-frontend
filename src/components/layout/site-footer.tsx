import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { SITE_CONFIG } from "@/lib/site-config";
import { Splash } from "@/components/shared/splash";

async function FooterYear() {
    await connection();
    return <>{new Date().getFullYear()}</>;
}

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" className="size-5">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" className="size-5">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

function GitHubIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" className="size-5">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    );
}

const SOCIAL_ICONS: Record<string, () => React.JSX.Element> = {
    facebook: FacebookIcon,
    linkedin: LinkedInIcon,
    github: GitHubIcon,
};

export function SiteFooter() {
    return (
        <footer className="on-ink bg-ink text-paper">
            <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 md:grid-cols-12 md:px-6 lg:px-8">
                {/* Brand */}
                <div className="md:col-span-5">
                    <Link
                        href="/"
                        aria-label={`${SITE_NAME} home`}
                        className="group relative isolate inline-block px-5 py-2 text-2xl font-extrabold uppercase tracking-tighter text-paper"
                    >
                        <Splash className="absolute left-1/2 top-1/2 -z-10 w-32 -translate-x-1/2 -translate-y-1/2 -rotate-3 text-paper/20 transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 md:w-36" />
                        {SITE_NAME}
                    </Link>
                    <p className="mt-4 max-w-md text-paper/60">
                        {SITE_CONFIG.description}
                    </p>
                    <div className="mt-6 flex gap-3">
                        {Object.entries(SITE_CONFIG.social).map(([platform, url]) => {
                            const Icon = SOCIAL_ICONS[platform];
                            return (
                                <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={platform}
                                    className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/60 transition-colors hover:border-paper/40 hover:text-paper"
                                >
                                    {Icon && <Icon />}
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Nav */}
                <nav aria-label="Footer" className="md:col-span-4">
                    <p className="label-caps text-paper/40">Explore</p>
                    <ul className="mt-4 space-y-3">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-paper/70 transition-colors hover:text-paper underline-offset-4 hover:underline">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Organizers */}
                <div className="md:col-span-3">
                    <p className="label-caps text-paper/40">For Organizers</p>
                    <ul className="mt-4 space-y-3">
                        <li>
                            <Link href="/organizer/login" className="text-paper/70 transition-colors hover:text-paper underline-offset-4 hover:underline">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link href="/organizer/signup" className="text-paper/70 transition-colors hover:text-paper underline-offset-4 hover:underline">
                                Sign Up
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-paper/10">
                <p className="mx-auto max-w-[1440px] px-4 py-6 text-sm text-paper/40 md:px-6 lg:px-8">
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
