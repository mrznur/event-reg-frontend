"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MemberPhoto } from "@/lib/members";

interface Props {
    photos: MemberPhoto[];
}

export function MemberPhotoCarousel({ photos }: Props) {
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        onSelect(); // initialize selected index on mount
        return () => { emblaApi.off("select", onSelect); };
    }, [emblaApi, onSelect]);

    return (
        <div className="relative">
            <div ref={emblaRef} className="overflow-hidden rounded-sm">
                <div className="flex">
                    {photos.map((photo, i) => (
                        <div
                            key={photo.src}
                            className="relative aspect-[4/3] min-w-0 max-h-[380px] flex-[0_0_100%] overflow-hidden"
                        >
                            <Image
                                src={photo.src}
                                alt={photo.alt}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority={i === 0}
                                className="object-cover transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-6">
                                <div>
                                    <p className="label-caps text-lime">BUCC Community</p>
                                    <p className="mt-1 text-lg font-semibold text-paper">{photo.caption}</p>
                                </div>
                                <span className="label-caps text-paper/70">
                                    {String(i + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {photos.map((photo, i) => (
                        <button
                            key={photo.src}
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
    );
}
