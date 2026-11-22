
"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Event } from "@/lib/api";
import { isAllowedImageHost } from "@/lib/events";

interface Props {
    events: Event[];
}

export function EventsCarousel({ events }: Props) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true },
        [
            Autoplay({
                delay: 3500,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
            }),
        ]
    );

    const [selected, setSelected] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelected(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        emblaApi.on("select", onSelect);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        onSelect(); // initialize selected index on mount

        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    if (events.length === 0) return null;

    return (
        <div className="relative">
            {/* Viewport */}
            <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                    {events.map((event, i) => {
                        const isPicsum = isAllowedImageHost(event.coverImage);

                        return (
                            <div
                                key={event.id}
                                className="relative min-w-0 flex-[0_0_100%] h-[56vw] min-h-[420px] sm:h-screen"
                            >
                                {/* Cover image */}
                                {isPicsum ? (
                                    <Image
                                        src={event.coverImage}
                                        alt={event.title}
                                        fill
                                        sizes="100vw"
                                        priority={i === 0}
                                        className="object-cover"
                                    />
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={event.coverImage}
                                        alt={event.title}
                                        className="h-full w-full object-cover"
                                    />
                                )}

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-24 inset-x-0">
                                    <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
                                        <p className="label-caps mb-3 text-lime">
                                            {event.category.charAt(0) +
                                                event.category.slice(1).toLowerCase()}
                                        </p>

                                        <p className="mb-6 line-clamp-3 max-w-2xl text-2xl font-bold leading-tight text-paper md:text-4xl lg:text-5xl">
                                            {event.title}
                                        </p>

                                        {/* Action buttons */}
                                        <div className="flex flex-wrap items-center gap-4">
                                            <Link
                                                href={`/events/${event.slug}`}
                                                className="group inline-flex items-center gap-3 rounded-sm bg-lime px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink transition duration-300 hover:bg-lime-400 active:translate-y-px"
                                            >
                                                View event
                                                <ArrowRight
                                                    aria-hidden
                                                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                                />
                                            </Link>

                                            <Link
                                                href="/events"
                                                className="group label-caps relative isolate block overflow-hidden rounded px-6 py-3 text-paper"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-lime transition-transform duration-300 ease-out group-hover:scale-y-100"
                                                />
                                                <span className="transition-colors duration-300 group-hover:text-ink">
                                                    View all events
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom bar - slide indicators */}
            <div className="absolute bottom-6 inset-x-0">
                <div className="mx-auto flex max-w-[1440px] items-center justify-end px-4 md:px-6 lg:px-8">
                    {events.length > 1 && (
                        <div
                            role="tablist"
                            aria-label="Event slides"
                            className="flex gap-2.5"
                        >
                            {events.map((event, i) => (
                                <button
                                    key={event.id}
                                    role="tab"
                                    type="button"
                                    aria-selected={i === selected}
                                    aria-label={`Go to slide ${i + 1}`}
                                    onClick={() => emblaApi?.scrollTo(i)}
                                    className={`h-2 w-2 rounded-full transition-colors duration-300 ${i === selected
                                            ? "bg-lime"
                                            : "bg-paper/40 hover:bg-paper/70"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
