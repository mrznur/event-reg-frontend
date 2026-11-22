"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { SlideIn } from "@/components/motion/reveal";
import { ArrowRight, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { MEMBER_PHOTOS } from "@/lib/members";

const BENEFITS = [
    {
        title: "Build Real-World Experience",
        body: "Apply technical knowledge through practical projects, competitions, and hands-on experiences that go beyond the classroom.",
    },
    {
        title: "Connect With Like-Minded People",
        body: "Meet students who share an interest in technology, innovation, and problem-solving. Build meaningful connections and collaborate with people who share your passion.",
    },
    {
        title: "Participate in Competitions",
        body: "Challenge yourself through hackathons, programming contests, and other technical competitions. Put your skills to the test and learn from every experience.",
    },
    {
        title: "Develop Leadership Skills",
        body: "Take responsibility, collaborate with teams, organize initiatives, and develop communication and leadership skills through real experiences.",
    },
    {
        title: "Explore New Technologies",
        body: "Discover emerging technologies and develop knowledge beyond the traditional academic curriculum. Stay curious and explore what's next in technology.",
    },
] as const;

const CLUB_IMAGES = MEMBER_PHOTOS;

export function WhyJoin() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [selected, setSelected] = useState(0);

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true },
        [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelected(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        onSelect();
        return () => { emblaApi.off("select", onSelect); };
    }, [emblaApi, onSelect]);

    function toggle(i: number) {
        setOpenIndex((prev) => (prev === i ? null : i));
    }

    return (
        <section
            aria-labelledby="why-join-heading"
            id="why-join"
            className="scroll-mt-16 border-t border-ink/10 bg-ink text-paper on-ink md:scroll-mt-20"
        >
            <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-6 md:py-20 lg:px-8">
                <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">

                    {/* LEFT — intro + accordion */}
                    <div className="flex flex-col">
                        <div>
                            <SlideIn>
                                <p className="label-caps text-paper/60">Why Join BUCC</p>
                            </SlideIn>
                            <h2 id="why-join-heading" className="heading-2 mt-2">
                                <SlideIn>More Than a Club.</SlideIn>{" "}
                                <SlideIn delay={150}>
                                    <span className="text-paper/50">A Community to Grow With.</span>
                                </SlideIn>
                            </h2>
                        </div>

                        <SlideIn delay={200}>
                            <p className="mt-5 max-w-lg text-sm leading-relaxed text-paper/65 md:text-base">
                                BUCC brings together curious minds who want to explore technology,
                                develop their skills, collaborate on meaningful projects, and grow
                                beyond the classroom.
                            </p>
                        </SlideIn>

                        {/* Accordion */}
                        <div className="mt-8">
                            <p className="label-caps mb-3 text-paper/40">What you gain</p>
                            <ul className="flex flex-col divide-y divide-paper/10">
                                {BENEFITS.map((benefit, i) => {
                                    const isOpen = openIndex === i;
                                    return (
                                        <li key={benefit.title}>
                                            <button
                                                type="button"
                                                onClick={() => toggle(i)}
                                                aria-expanded={isOpen}
                                                className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left"
                                            >
                                                <div className="flex min-w-0 items-center gap-4">
                                                    <span className="label-caps shrink-0 text-lime/70">
                                                        {String(i + 1).padStart(2, "0")}
                                                    </span>
                                                    <span className="text-sm font-medium text-paper md:text-base">
                                                        {benefit.title}
                                                    </span>
                                                </div>
                                                <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border border-paper/20 text-paper/60 transition-all duration-300 ${
                                                    isOpen ? "border-lime bg-lime text-ink rotate-45" : "hover:border-lime hover:bg-lime hover:text-ink"
                                                }`}>
                                                    <Plus aria-hidden className="size-3.5" />
                                                </span>
                                            </button>

                                            {/* Expandable body */}
                                            <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "max-h-40 pb-4" : "max-h-0"}`}>
                                                <p className="pl-10 text-sm leading-relaxed text-paper/60">
                                                    {benefit.body}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT — carousel + CTA */}
                    <div className="flex flex-col">
                        <div className="relative">
                            <div ref={emblaRef} className="overflow-hidden rounded-sm">
                                <div className="flex">
                                    {CLUB_IMAGES.map((image, i) => (
                                        <div
                                            key={image.src}
                                            className="relative aspect-[4/3] min-w-0 max-h-[380px] flex-[0_0_100%] overflow-hidden"
                                        >
                                            <Image
                                                src={image.src}
                                                alt={image.alt}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                priority={i === 0}
                                                className="object-cover transition-transform duration-700 hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-6">
                                                <div>
                                                    <p className="label-caps text-lime">BUCC Community</p>
                                                    <p className="mt-1 text-lg font-semibold text-paper">{image.caption}</p>
                                                </div>
                                                <span className="label-caps text-paper/70">
                                                    {String(i + 1).padStart(2, "0")} / {String(CLUB_IMAGES.length).padStart(2, "0")}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {CLUB_IMAGES.map((image, i) => (
                                        <button
                                            key={image.src}
                                            type="button"
                                            aria-label={`Go to image ${i + 1}`}
                                            aria-current={i === selected}
                                            onClick={() => emblaApi?.scrollTo(i)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                i === selected ? "w-7 bg-lime" : "w-1.5 bg-paper/30 hover:bg-paper/60"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        aria-label="Previous image"
                                        onClick={() => emblaApi?.scrollPrev()}
                                        className="flex size-9 items-center justify-center border border-paper/20 text-paper/70 transition-colors hover:border-lime hover:bg-lime hover:text-ink"
                                    >
                                        <ChevronLeft className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next image"
                                        onClick={() => emblaApi?.scrollNext()}
                                        className="flex size-9 items-center justify-center border border-paper/20 text-paper/70 transition-colors hover:border-lime hover:bg-lime hover:text-ink"
                                    >
                                        <ChevronRight className="size-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-7 flex items-center justify-between gap-4 border-t border-paper/15 pt-5">
                            <div>
                                <p className="text-sm font-semibold text-paper">Ready to be part of something bigger?</p>
                                <p className="mt-1 text-xs text-paper/50">Start your journey with BUCC.</p>
                            </div>
                            <Link
                                href="/register"
                                className="group inline-flex shrink-0 rounded-sm items-center gap-3 bg-lime px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink transition duration-300 hover:bg-lime-400"
                            >
                                Become a Member
                                <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
