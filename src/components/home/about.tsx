
"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { SlideIn } from "@/components/motion/reveal";
import { AsteroidBg } from "@/components/shared/asteroid-bg";
import { CtaLink } from "@/components/shared/cta-link";

const SECTIONS = [
    {
        id: "philosophy",
        label: "WHO WE ARE",
        title: "Our philosophy",
        body: "The BRAC University Computer Club (BUCC) is the premier student organisation dedicated to fostering innovation, technical excellence, and professional growth in a rapidly evolving digital landscape.",
        position: "lg:col-start-1 lg:row-start-1",
    },
    {
        id: "mission",
        label: "OUR PURPOSE",
        title: "Our mission",
        body: "Bridge the gap between academic theory and industry practice — giving students a platform to build real skills, ship real projects, and grow a real professional network.",
        position: "lg:col-start-3 lg:row-start-1",
    },
    {
        id: "vision",
        label: "OUR DIRECTION",
        title: "Our vision",
        body: "To be the leading tech incubator and student community in the nation, nurturing engineers and creators who shape the future of technology.",
        position: "lg:col-start-2 lg:row-start-2",
    },
    {
        id: "values",
        label: "WHAT GUIDES US",
        title: "Our values",
        position: "lg:col-start-4 lg:row-start-2",
    },
] as const;

const VALUES = [
    {
        title: "Innovation",
        body: "Pushing boundaries and embracing new technologies to solve complex problems.",
    },
    {
        title: "Collaboration",
        body: "Great things are never built alone — we share knowledge and support each other.",
    },
    {
        title: "Excellence",
        body: "From code quality to event execution, we hold ourselves to the highest standards.",
    },
    {
        title: "Integrity",
        body: "Transparency, accountability, and respect for peers, university, and community.",
    },
] as const;

export function About() {
    const [activeSection, setActiveSection] = useState("philosophy");

    return (
        <section
            id="about"
            aria-labelledby="about-heading"
            className="relative isolate scroll-mt-16 overflow-hidden md:scroll-mt-20"
        >
            <AsteroidBg />

            <div className="mx-auto max-w-[1440px] px-4 py-24 md:px-6 md:py-36 lg:px-8">

                {/* Section header */}
                <div className="grid gap-3 border-b border-ink/10 pb-4 sm:grid-cols-[auto_auto_1fr] sm:items-end sm:gap-8">
                    <SlideIn>
                        <p className="label-caps text-stone-text">
                            BUCC
                        </p>
                    </SlideIn>

                    <SlideIn delay={100}>
                        <p className="label-caps text-stone-text">
                            About us
                        </p>
                    </SlideIn>

                    <SlideIn delay={200}>
                        <h2
                            id="about-heading"
                            className="heading-3 text-ink sm:text-right"
                        >
                            Empowering the Tech Leaders of Tomorrow.
                        </h2>
                    </SlideIn>
                </div>

                {/* Interactive asymmetric grid */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[minmax(286px,auto)_minmax(286px,auto)] lg:gap-0">
                    {SECTIONS.map((section, index) => {
                        const isActive = activeSection === section.id;

                        return (
                            <SlideIn
                                key={section.id}
                                delay={index * 100}
                                className={`h-full ${section.position}`}
                            >
                                <button
                                    type="button"
                                    aria-expanded={isActive}
                                    aria-controls={`about-content-${section.id}`}
                                    onClick={() =>
                                        setActiveSection(
                                            isActive ? "" : section.id
                                        )
                                    }
                                    className={`group flex h-full min-h-[250px] w-full flex-col items-start border p-6 text-left transition-colors duration-300 md:p-7 ${isActive
                                        ? "border-ink bg-ink text-paper"
                                        : "border-ink/10 bg-paper/70 text-ink hover:border-lime/60"
                                        }`}
                                >
                                    <div className="w-full">
                                        <p
                                            className={`label-caps mb-2 ${isActive
                                                ? "text-paper/50"
                                                : "text-stone-text"
                                                }`}
                                        >
                                            {section.label}
                                        </p>

                                        <h3
                                            className={`heading-3 ${isActive
                                                ? "text-paper"
                                                : "text-ink"
                                                }`}
                                        >
                                            {section.title}
                                        </h3>
                                    </div>

                                    <div
                                        id={`about-content-${section.id}`}
                                        hidden={!isActive}
                                        className="mt-4 w-full"
                                    >
                                        {section.id === "values" ? (
                                            <div className="space-y-3">
                                                {VALUES.map((value) => (
                                                    <div key={value.title}>
                                                        <h4 className="label-caps text-paper">
                                                            {value.title}
                                                        </h4>

                                                        <p className="mt-1 text-xs leading-relaxed text-paper/70">
                                                            {value.body}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="max-w-sm text-sm leading-relaxed text-paper/80">
                                                {section.body}
                                            </p>
                                        )}
                                    </div>

                                    <span
                                        className={`mt-auto flex size-7 items-center justify-center ${isActive
                                            ? "text-lime"
                                            : "text-stone-text transition-colors group-hover:text-ink"
                                            }`}
                                        aria-hidden="true"
                                    >
                                        {isActive ? (
                                            <X className="size-5" strokeWidth={1} />
                                        ) : (
                                            <Plus className="size-5" strokeWidth={1} />
                                        )}
                                    </span>
                                </button>
                            </SlideIn>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="mt-12 flex justify-end">
                    <SlideIn>
                        <CtaLink href="/events">
                            Explore Events
                        </CtaLink>
                    </SlideIn>
                </div>
            </div>
        </section>
    );
}
