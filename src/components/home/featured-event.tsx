import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import type { Event } from "@/lib/api";
import { AvailabilityChip } from "@/components/events/availability-chip";
import { categoryLabel, formatDateLong, isAllowedImageHost } from "@/lib/events";

interface Props {
    event: Event;
}

export function FeaturedEvent({ event }: Props) {
    const isPicsum = isAllowedImageHost(event.coverImage);

    return (
        <div className="grid gap-0 overflow-hidden border border-ink/10 md:grid-cols-[1fr_380px]">
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden bg-stone/10 md:aspect-auto">
                {isPicsum ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={event.coverImage}
                        alt={event.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={event.coverImage}
                        alt={event.title}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4 border-t border-ink/10 p-6 md:border-l md:border-t-0">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="label-caps text-stone-text">{categoryLabel(event.category)}</span>
                    <AvailabilityChip event={event} showSpots />
                </div>

                <h3 className="heading-3 text-[1.5rem] leading-tight">{event.title}</h3>
                <p className="text-sm leading-relaxed text-stone-text line-clamp-3">{event.description}</p>

                <dl className="flex flex-col gap-2 text-sm text-stone-text">
                    <dd className="flex items-center gap-2">
                        <Calendar aria-hidden className="size-4 shrink-0" />
                        <time dateTime={event.startsAt}>{formatDateLong(event.startsAt, event.timezone)}</time>
                    </dd>
                    <dd className="flex items-center gap-2">
                        <MapPin aria-hidden className="size-4 shrink-0" />
                        <span>{event.venue}</span>
                    </dd>
                </dl>

                <Link
                    href={`/events/${event.slug}`}
                    className="group mt-auto inline-flex items-center gap-2 font-semibold uppercase tracking-wider text-ink text-sm hover:text-stone-text transition-colors"
                >
                    View event
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}
