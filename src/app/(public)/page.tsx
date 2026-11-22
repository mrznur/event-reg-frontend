import type { Metadata } from "next";
import { Suspense } from "react";
import { HashScroll } from "@/components/shared/hash-scroll";
import { UpcomingEvents, UpcomingEventsFallback } from "@/components/home/upcoming-events";
import { ImpactStats, ImpactStatsFallback } from "@/components/home/impact-stats";
import { About, AboutFallback } from "@/components/home/about";
import { Activities } from "@/components/home/activities";
import { WhyJoin } from "@/components/home/why-join";
import { Contact } from "@/components/home/contact";

export const metadata: Metadata = {
    title: {
        absolute: "BUCC",
    },
    description: "Big ideas. Real people. Unforgettable experiences.",
};

export default function Home() {
    return (
        <>
            <HashScroll />

            {/* 1 — Full-screen event carousel */}
            <Suspense fallback={<UpcomingEventsFallback />}>
                <UpcomingEvents />
            </Suspense>

            {/* 2 — About BUCC */}
            <Suspense fallback={<AboutFallback />}>
                <About />
            </Suspense>

            {/* 3 — Impact stats */}
            <Suspense fallback={<ImpactStatsFallback />}>
                <ImpactStats />
            </Suspense>

            {/* 4 — Activities */}
            <Activities />

            {/* 5 — Why Join */}
            <WhyJoin />

            {/* 6 — Contact */}
            <Contact />
        </>
    );
}
