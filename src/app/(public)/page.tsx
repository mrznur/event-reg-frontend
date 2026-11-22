import { Suspense } from "react";
import { HashScroll } from "@/components/shared/hash-scroll";
import { UpcomingEvents, UpcomingEventsFallback } from "@/components/home/upcoming-events";
import { ImpactStats, ImpactStatsFallback } from "@/components/home/impact-stats";
import { About } from "@/components/home/about";
import { Activities } from "@/components/home/activities";
import { WhyJoin } from "@/components/home/why-join";
import { Contact } from "@/components/home/contact";

export default function Home() {
    return (
        <>
            <HashScroll />

            {/* 1 — Full-screen event carousel */}
            <Suspense fallback={<UpcomingEventsFallback />}>
                <UpcomingEvents />
            </Suspense>

            {/* 2 — About BUCC */}
            <About />

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
