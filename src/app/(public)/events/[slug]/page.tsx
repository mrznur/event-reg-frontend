import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { getEventBySlug, ApiError } from "@/lib/api";
import { canRegister, categoryLabel, formatDateLong, isAllowedImageHost } from "@/lib/events";
import { AvailabilityChip } from "@/components/events/availability-chip";

interface Props {
    params: Promise<{ slug: string }>;
}

async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let event;
    try {
        event = await getEventBySlug(slug);
    } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
            notFound();
        }
        throw err;
    }

    const isPicsumHost = isAllowedImageHost(event.coverImage);

    return (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Left column */}
            <div className="lg:order-first">
                {/* Cover image */}
                <div className="relative mb-8 aspect-[3/2] w-full overflow-hidden bg-stone/10">
                    {isPicsumHost ? (
                        <Image
                            src={event.coverImage}
                            alt={event.title}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, calc(100vw - 420px)"
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
                </div>

                {/* Category + chip */}
                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="label-caps text-stone-text">
                        {categoryLabel(event.category)}
                    </span>
                    <AvailabilityChip event={event} showSpots />
                </div>

                {/* Title */}
                <h1 className="heading-2 mb-6">{event.title}</h1>

                {/* Description */}
                <p className="max-w-2xl text-base leading-relaxed text-stone-text">
                    {event.description}
                </p>
            </div>

            {/* Right column — event details card, shown first on mobile */}
            <aside className="order-first h-fit border border-ink/10 bg-paper p-6 lg:order-last lg:sticky lg:top-24">
                <h2 className="label-caps mb-6 text-stone-text">Event details</h2>

                <dl className="flex flex-col gap-5">
                    <div className="flex gap-3">
                        <dt>
                            <Calendar aria-hidden className="mt-0.5 size-5 shrink-0 text-stone-text" />
                            <span className="sr-only">Date and time</span>
                        </dt>
                        <dd className="text-sm">
                            <span className="block font-semibold">Starts</span>
                            <time dateTime={event.startsAt} className="text-stone-text">
                                {formatDateLong(event.startsAt, event.timezone)}
                            </time>
                            <span className="mt-1 block font-semibold">Ends</span>
                            <time dateTime={event.endsAt} className="text-stone-text">
                                {formatDateLong(event.endsAt, event.timezone)}
                            </time>
                        </dd>
                    </div>

                    <div className="flex gap-3">
                        <dt>
                            <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-stone-text" />
                            <span className="sr-only">Venue</span>
                        </dt>
                        <dd className="text-sm text-stone-text">{event.venue}</dd>
                    </div>

                    <div className="flex gap-3">
                        <dt>
                            <Users aria-hidden className="mt-0.5 size-5 shrink-0 text-stone-text" />
                            <span className="sr-only">Capacity</span>
                        </dt>
                        <dd className="text-sm text-stone-text">
                            {event.registeredCount} / {event.capacity} registered
                        </dd>
                    </div>
                </dl>

                {/* Register CTA */}
                <div className="mt-8">
                    {canRegister(event) ? (
                        <Link
                            href={`/events/${event.slug}/register`}
                            className="group label-caps inline-flex w-full items-center justify-center gap-3 bg-lime px-6 py-3.5 text-ink transition duration-300 hover:bg-lime/80 active:translate-y-px"
                        >
                            Register now
                            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    ) : (
                        <div className="border border-ink/10 p-4 text-center">
                            <AvailabilityChip event={event} showSpots />
                            <p className="mt-2 text-sm text-stone-text">
                                {event.spotsLeft === 0
                                    ? "This event is fully booked."
                                    : "Registrations for this event are closed."}
                            </p>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}

export default function EventDetailPage({ params }: Props) {
    return (
        <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
            <Suspense
                fallback={
                    <div className="animate-pulse space-y-6">
                        <div className="aspect-[3/2] w-full rounded-sm bg-stone/10" />
                        <div className="h-8 w-2/3 rounded-sm bg-stone/10" />
                        <div className="h-4 w-full rounded-sm bg-stone/10" />
                        <div className="h-4 w-5/6 rounded-sm bg-stone/10" />
                    </div>
                }
            >
                <EventDetail params={params} />
            </Suspense>
        </div>
    );
}
