import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import type { Event } from "@/lib/api";
import { categoryLabel, formatDate, isAllowedImageHost } from "@/lib/events";
import { AvailabilityChip } from "./availability-chip";

interface Props {
    event: Event;
}

export function EventCard({ event }: Props) {
    const isPicsumHost = isAllowedImageHost(event.coverImage);

    return (
        <article className="group relative flex flex-col overflow-hidden border border-ink/10 bg-paper transition-shadow duration-300 hover:shadow-lg">
            {/* Cover image */}
            <div className="relative aspect-[3/2] overflow-hidden bg-stone/10">
                {isPicsumHost ? (
                    <Image
                        src={event.coverImage}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={event.coverImage}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-3 p-5">
                {/* Category + chip row */}
                <div className="flex items-center justify-between gap-2">
                    <span className="label-caps text-stone-text">
                        {categoryLabel(event.category)}
                    </span>
                    <AvailabilityChip event={event} showSpots />
                </div>

                {/* Title — the single link that covers the whole card */}
                <h2 className="heading-3 line-clamp-2 text-[1.25rem]">
                    <Link
                        href={`/events/${event.slug}`}
                        className="after:absolute after:inset-0 focus-visible:underline"
                    >
                        {event.title}
                    </Link>
                </h2>

                {/* Description */}
                <p className="line-clamp-3 text-sm text-stone-text">
                    {event.description}
                </p>

                {/* Meta */}
                <div className="mt-auto flex flex-col gap-1.5 pt-2 text-sm text-stone-text">
                    <span className="flex items-center gap-2">
                        <Calendar aria-hidden className="size-4 shrink-0" />
                        <time dateTime={event.startsAt}>
                            {formatDate(event.startsAt, event.timezone)}
                        </time>
                    </span>
                    <span className="flex items-center gap-2">
                        <MapPin aria-hidden className="size-4 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                    </span>
                </div>
            </div>
        </article>
    );
}
