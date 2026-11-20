import { Suspense } from "react";
import { CtaLink } from "@/components/shared/cta-link";
import { SlideIn } from "@/components/motion/reveal";
import { HashScroll } from "@/components/shared/hash-scroll";
import {
    UpcomingEvents,
    UpcomingEventsFallback,
} from "@/components/home/upcoming-events";
import {
    ImpactStats,
    ImpactStatsFallback,
} from "@/components/home/impact-stats";
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
            <section
                id="about"
                aria-labelledby="about-heading"
                className="relative isolate scroll-mt-16 overflow-hidden md:scroll-mt-20"
            >
                {/* Asteroid decoration — kept as-is */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -right-12 top-12 h-52 w-52 rounded-full bg-gradient-to-br from-lime/50 via-lime/20 to-transparent blur-[2px] md:right-24 md:top-16 md:h-72 md:w-72" />
                    <div className="asteroid-field">
                        <span className="asteroid-fragment fragment-1" />
                        <span className="asteroid-fragment fragment-2" />
                        <span className="asteroid-fragment fragment-3" />
                        <span className="asteroid-fragment fragment-4" />
                        <span className="asteroid-fragment fragment-5" />
                        <span className="asteroid-fragment fragment-6" />
                        <span className="asteroid-fragment fragment-7" />
                        <span className="asteroid-fragment fragment-8" />
                        <span className="asteroid-fragment fragment-9" />
                        <span className="asteroid-fragment fragment-10" />
                        <span className="asteroid-fragment fragment-11" />
                        <span className="asteroid-fragment fragment-12" />
                    </div>
                    <div className="absolute bottom-16 left-[38%] h-12 w-12 rounded-full bg-gradient-to-br from-lime/50 to-green-900/50 blur-[1px] md:bottom-24 md:h-16 md:w-16" />
                    <div className="absolute left-[45%] top-[18%] h-1.5 w-1.5 rounded-full bg-lime" />
                    <div className="absolute right-[35%] top-[65%] h-1 w-1 rounded-full bg-lime/70" />
                    <div className="absolute left-[8%] bottom-[20%] h-2 w-2 rounded-full bg-lime/60" />
                    <div className="absolute right-[5%] top-[45%] h-1.5 w-1.5 rounded-full bg-lime" />
                </div>

                <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-6 md:py-36 lg:px-8">
                    <SlideIn><p className="label-caps text-stone-text">BUCC</p></SlideIn>
                    <h2 id="about-heading" className="heading-2 relative mt-4 max-w-5xl">
                        <SlideIn>Empowering the</SlideIn>{" "}
                        <SlideIn delay={150}>Tech Leaders</SlideIn>{" "}
                        <SlideIn delay={300}>of Tomorrow.</SlideIn>
                    </h2>

                    {/* Two blocks side by side, same height */}
                    <div className="mt-16 grid items-stretch gap-6 md:grid-cols-2">
                        <SlideIn delay={100} className="h-full">
                            <div className="flex h-full border border-ink/10 p-6">
                                <p className="text-lg leading-relaxed text-stone-text md:text-xl">
                                    The BRAC University Computer Club (BUCC) is the premier student
                                    organisation dedicated to fostering innovation, technical excellence,
                                    and professional growth in a rapidly evolving digital landscape.
                                </p>
                            </div>
                        </SlideIn>
                        <SlideIn delay={200} className="h-full">
                            <div className="flex h-full flex-col gap-6 border border-ink/10 p-6">
                                <div>
                                    <h3 className="label-caps mb-3 text-ink">Our Mission</h3>
                                    <p className="text-base leading-relaxed text-stone-text">
                                        Bridge the gap between academic theory and industry practice —
                                        giving students a platform to build real skills, ship real
                                        projects, and grow a real professional network.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="label-caps mb-3 text-ink">Our Vision</h3>
                                    <p className="text-base leading-relaxed text-stone-text">
                                        To be the leading tech incubator and student community in the
                                        nation, nurturing engineers and creators who shape the future
                                        of technology.
                                    </p>
                                </div>
                            </div>
                        </SlideIn>
                    </div>

                    {/* Value cards below */}
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { title: "Innovation", body: "Pushing boundaries and embracing new technologies to solve complex problems.", delay: 0 },
                            { title: "Collaboration", body: "Great things are never built alone — we share knowledge and support each other.", delay: 100 },
                            { title: "Excellence", body: "From code quality to event execution, we hold ourselves to the highest standards.", delay: 200 },
                            { title: "Integrity", body: "Transparency, accountability, and respect for peers, university, and community.", delay: 300 },
                        ].map((v) => (
                            <SlideIn key={v.title} delay={v.delay}>
                                <div className="border border-ink/10 p-6">
                                    <h3 className="label-caps mb-3 text-ink">{v.title}</h3>
                                    <p className="text-base leading-relaxed text-stone-text">{v.body}</p>
                                </div>
                            </SlideIn>
                        ))}
                    </div>

                    <div className="mt-12">
                        <CtaLink href="/events">Explore Events</CtaLink>
                    </div>
                </div>
            </section>

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
