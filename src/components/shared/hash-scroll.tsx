"use client";

import { useEffect } from "react";

/**
 * After the page mounts, scroll to the element matching window.location.hash.
 * Scrolls immediately when found, then re-scrolls after 800ms to correct
 * any layout shift caused by Suspense boundaries resolving.
 */
export function HashScroll() {
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (!hash) return;

        let done = false;

        const scrollTo = () => {
            const el = document.getElementById(hash);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                return true;
            }
            return false;
        };

        // Poll until found
        let attempts = 0;
        const poll = () => {
            if (scrollTo()) {
                done = true;
                // Re-scroll after content streams in and layout settles
                setTimeout(scrollTo, 800);
                return;
            }
            if (++attempts < 30) setTimeout(poll, 100); // up to 3s
        };

        poll();

        return () => { done = true; };
    }, []);

    return null;
}
