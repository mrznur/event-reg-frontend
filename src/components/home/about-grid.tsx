"use client";

import { useState } from "react";
import { isAllowedImageHost } from "@/lib/events";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { SlideIn } from "@/components/motion/reveal";
import type { AboutImages, AboutImageKey } from "@/lib/api";

const SECTIONS = [
    {
        id: "philosophy" as AboutImageKey,
        label: "WHO WE ARE",
        title: "Our philosophy",
        body: "The BRAC University Computer Club (BUCC) is the premier student organisation dedicated to fostering innovation, technical excellence, and professional growth in a rapidly evolving digital landscape.",
        position: "lg:col-start-1 lg:row-start-1",
        imageSlot: "lg:col-start-1 lg:row-start-2", // image appears below
    },
    {
        id: "mission" as AboutImageKey,
        label: "OUR PURPOSE",
        title: "Our mission",
        body: "Bridge the gap between academic theory and industry practice — giving students a platform to build real skills, ship real projects, and grow a real professional network.",
        position: "lg:col-start-3 lg:row-start-1",
        imageSlot: "lg:col-start-3 lg:row-start-2", // image appears below
    },
    {
        id: "vision" as AboutImageKey,
        label: "OUR DIRECTION",
        title: "Our vision",
        body: "To be the leading tech incubator and student community in the nation, nurturing engineers and creators who shape the future of technology.",
        position: "lg:col-start-2 lg:row-start-2",
        imageSlot: "lg:col-start-2 lg:row-start-1", // image appears above
    },
    {
        id: "values" as AboutImageKey,
        label: "WHAT GUIDES US",
        title: "Our values",
        body: "",
        position: "lg:col-start-4 lg:row-start-2",
        imageSlot: "lg:col-start-4 lg:row-start-1", // image appears above
    },
] as const;

const VALUES = [
    { title: "Innovation", body: "Pushing boundaries and embracing new technologies to solve complex problems." },
    { title: "Collaboration", body: "Great things are never built alone — we share knowledge and support each other." },
    { title: "Excellence", body: "From code quality to event execution, we hold ourselves to the highest standards." },
    { title: "Integrity", body: "Transparency, accountability, and respect for peers, university, and community." },
] as const;

interface Props {
    images: AboutImages | null;
}

function AboutImage({ image, visible }: { image: { url: string; alt: string } | undefined; visible: boolean }) {
    const isOptimized = image ? isAllowedImageHost(image.url) : false;
    return (
        <div
            className={`relative h-full min-h-[200px] overflow-hidden transition-all duration-500 ease-out ${
                visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.97] pointer-events-none"
            }`}
            aria-hidden={!visible}
        >
            {image ? (
                isOptimized ? (
                    <Image src={image.url} alt={image.alt} fill sizes="(max-width: 1024px) 100vw, 25vw" className="object-cover" />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
                )
            ) : (
                <div className="h-full w-full bg-ink/5" />
            )}
        </div>
    );
}

// ─── Mobile: sticky-scroll pairs ─────────────────────────────────────────────
// Each section gets a 200vh tall wrapper. The text card is sticky at the top,
// so it stays pinned while you scroll. The image then scrolls up over it,
// and once the wrapper exits the viewport the next pair begins.

function MobileAboutGrid({ images }: Props) {
    return (
        <div className="lg:hidden">
            {SECTIONS.map((section) => {
                const image = images?.[section.id];
                const isOptimized = image ? isAllowedImageHost(image.url) : false;

                return (
                    /*
                     * No fixed height — the wrapper is as tall as its contents
                     * (card + image) in normal flow. The sticky card pins to top-0
                     * on scroll, and the image (z-20) scrolls up over it.
                     * No overflow on this element — that would break sticky.
                     */
                    <div key={section.id} className="relative">
                        {/* Text card */}
                        <div className="sticky top-0 z-10 flex w-full flex-col justify-center border-b border-ink/10 bg-paper px-6 py-8">
                            <p className="label-caps mb-2 text-stone-text">{section.label}</p>
                            <h3 className="heading-3 text-ink">{section.title}</h3>
                            <div className="mt-4">
                                {section.id === "values" ? (
                                    <div className="space-y-3">
                                        {VALUES.map((v) => (
                                            <div key={v.title}>
                                                <h4 className="label-caps text-ink">{v.title}</h4>
                                                <p className="mt-1 text-xs leading-relaxed text-stone-text">{v.body}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm leading-relaxed text-stone-text">{section.body}</p>
                                )}
                            </div>
                        </div>

                        {/* Image — scrolls up over the sticky card */}
                        <div className="relative z-20 aspect-[16/9] w-full overflow-hidden bg-ink/5">
                            {image ? (
                                isOptimized ? (
                                    <Image src={image.url} alt={image.alt} fill sizes="100vw" className="object-cover" />
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
                                )
                            ) : (
                                <div className="h-full w-full animate-pulse bg-ink/10" />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


// ─── Desktop: click-to-reveal image grid ─────────────────────────────────────

function DesktopAboutGrid({ images }: Props) {
    const [activeId, setActiveId] = useState<AboutImageKey | null>(null);

    function toggle(id: AboutImageKey) {
        setActiveId((prev) => (prev === id ? null : id));
    }

    return (
        <div className="hidden lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-0">
            {SECTIONS.map((section, i) => {
                const isActive = activeId === section.id;
                const showImage = activeId === section.id;

                return (
                    <div key={section.id} className="contents">
                        {/* Card */}
                        <SlideIn delay={i * 100} className={`h-full ${section.position}`}>
                            <button
                                type="button"
                                aria-expanded={isActive}
                                aria-controls={`about-img-${section.id}`}
                                onClick={() => toggle(section.id)}
                                className={`group flex h-[286px] w-full flex-col items-start overflow-hidden border p-6 text-left transition-colors duration-300 md:p-7 ${
                                    isActive
                                        ? "border-ink bg-ink text-paper"
                                        : "border-ink/10 bg-paper/70 text-ink hover:border-lime/60"
                                }`}
                            >
                                <div className="w-full">
                                    <p className={`label-caps mb-2 ${isActive ? "text-paper/50" : "text-stone-text"}`}>{section.label}</p>
                                    <h3 className={`heading-3 ${isActive ? "text-paper" : "text-ink"}`}>{section.title}</h3>
                                </div>

                                <div hidden={!isActive} className="mt-4 w-full flex-1 overflow-y-auto custom-scroll">
                                    {section.id === "values" ? (
                                        <div className="space-y-3">
                                            {VALUES.map((v) => (
                                                <div key={v.title}>
                                                    <h4 className="label-caps text-paper">{v.title}</h4>
                                                    <p className="mt-1 text-xs leading-relaxed text-paper/70">{v.body}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="max-w-sm text-sm leading-relaxed text-paper/80">{section.body}</p>
                                    )}
                                </div>

                                <span className={`mt-auto flex size-7 items-center justify-center ${isActive ? "text-lime" : "text-stone-text group-hover:text-ink"}`} aria-hidden>
                                    {isActive ? <X className="size-5" strokeWidth={1} /> : <Plus className="size-5" strokeWidth={1} />}
                                </span>
                            </button>
                        </SlideIn>

                        {/* Image slot */}
                        <div
                            key={`img-${section.id}`}
                            id={`about-img-${section.id}`}
                            className={`${section.imageSlot} min-h-[286px] border border-ink/10`}
                        >
                            <AboutImage image={images?.[section.id]} visible={showImage} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function AboutGrid({ images }: Props) {
    return (
        <>
            <MobileAboutGrid images={images} />
            <DesktopAboutGrid images={images} />
        </>
    );
}
