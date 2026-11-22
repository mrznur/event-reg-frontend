
import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import {
    Calendar,
    MapPin,
    Users,
    ArrowRight,
    Clock,
} from "lucide-react";

import { getEventBySlug, ApiError } from "@/lib/api";
import {
    canRegister,
    categoryLabel,
    formatDateLong,
    isAllowedImageHost,
} from "@/lib/events";

import { AvailabilityChip } from "@/components/events/availability-chip";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const event = await getEventBySlug(slug);
        return { title: event.title };
    } catch {
        return { title: "Event" };
    }
}

async function EventDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
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

    // Defer current-time-dependent rendering until request time.
    await connection();

    const isPicsumHost = isAllowedImageHost(event.coverImage);
    const registrationOpen = canRegister(event);

    const registrationProgress =
        event.capacity > 0
            ? Math.min(
                (event.registeredCount / event.capacity) * 100,
                100,
            )
            : 0;

    return (
        <>
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
                {/* Left column */}
                <div className="min-w-0 lg:order-first">
                    {/* Cover image */}
                    <div className="group relative mb-8 aspect-[16/9] w-full overflow-hidden bg-stone/10">
                        {isPicsumHost ? (
                            <Image
                                src={event.coverImage}
                                alt={event.title}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, calc(100vw - 420px)"
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={event.coverImage}
                                alt={event.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                    </div>

                    {/* Category and availability */}
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                        <span className="label-caps text-stone-text">
                            {categoryLabel(event.category)}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-stone/50" />

                        <AvailabilityChip event={event} showSpots />
                    </div>

                    {/* Title */}
                    <h1 className="heading-2 mb-6 max-w-4xl">
                        {event.title}
                    </h1>

                    {/* Description */}
                    <div className="max-w-3xl">
                        <p className="text-base leading-8 text-stone-text">
                            {event.description}
                        </p>
                    </div>

                    {/* Additional event information */}
                    <div className="mt-10 border-t border-ink/10 pt-7">
                        <h2 className="label-caps mb-5 text-stone-text">
                            About this event
                        </h2>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center bg-lime/20 text-ink">
                                    <Calendar className="size-5" />
                                </div>

                                <div className="min-w-0">
                                    <p className="label-caps text-stone-text">
                                        Event date
                                    </p>

                                    <time
                                        dateTime={event.startsAt}
                                        className="mt-1 block text-sm font-semibold leading-6 text-ink"
                                    >
                                        {formatDateLong(
                                            event.startsAt,
                                            event.timezone,
                                        )}
                                    </time>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center bg-lime/20 text-ink">
                                    <Clock className="size-5" />
                                </div>

                                <div className="min-w-0">
                                    <p className="label-caps text-stone-text">
                                        Event ends
                                    </p>

                                    <time
                                        dateTime={event.endsAt}
                                        className="mt-1 block text-sm font-semibold leading-6 text-ink"
                                    >
                                        {formatDateLong(
                                            event.endsAt,
                                            event.timezone,
                                        )}
                                    </time>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 sm:col-span-2">
                                <div className="flex size-10 shrink-0 items-center justify-center bg-lime/20 text-ink">
                                    <MapPin className="size-5" />
                                </div>

                                <div className="min-w-0">
                                    <p className="label-caps text-stone-text">
                                        Venue
                                    </p>

                                    <p className="mt-1 text-sm font-semibold leading-6 text-ink">
                                        {event.venue}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column: Event details card */}
                <aside className="order-first h-fit border border-ink/10 bg-paper lg:order-last lg:sticky lg:top-24">
                    <div className="border-b border-ink/10 p-6">
                        <p className="label-caps text-stone-text">
                            Event details
                        </p>

                        <h2 className="mt-2 text-xl font-bold tracking-tight text-ink">
                            Your event at a glance.
                        </h2>

                        <div className="mt-5">
                            <AvailabilityChip event={event} showSpots />
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Date */}
                        <div className="flex items-start gap-3">
                            <Calendar className="mt-0.5 size-5 shrink-0 text-stone-text" />

                            <div className="min-w-0">
                                <p className="label-caps text-stone-text">
                                    Starts
                                </p>

                                <time
                                    dateTime={event.startsAt}
                                    className="mt-1 block text-sm font-medium leading-6 text-ink"
                                >
                                    {formatDateLong(
                                        event.startsAt,
                                        event.timezone,
                                    )}
                                </time>

                                <p className="mt-3 label-caps text-stone-text">
                                    Ends
                                </p>

                                <time
                                    dateTime={event.endsAt}
                                    className="mt-1 block text-sm font-medium leading-6 text-ink"
                                >
                                    {formatDateLong(
                                        event.endsAt,
                                        event.timezone,
                                    )}
                                </time>
                            </div>
                        </div>

                        <div className="my-5 border-t border-ink/10" />

                        {/* Venue */}
                        <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 size-5 shrink-0 text-stone-text" />

                            <div className="min-w-0">
                                <p className="label-caps text-stone-text">
                                    Venue
                                </p>

                                <p className="mt-1 text-sm font-medium leading-6 text-ink">
                                    {event.venue}
                                </p>
                            </div>
                        </div>

                        <div className="my-5 border-t border-ink/10" />

                        {/* Capacity */}
                        <div className="flex items-start gap-3">
                            <Users className="mt-0.5 size-5 shrink-0 text-stone-text" />

                            <div className="min-w-0 flex-1">
                                <p className="label-caps text-stone-text">
                                    Registration
                                </p>

                                <div className="mt-1 flex items-baseline justify-between gap-2">
                                    <p className="text-sm font-semibold text-ink">
                                        {event.registeredCount}{" "}
                                        <span className="font-normal text-stone-text">
                                            / {event.capacity} registered
                                        </span>
                                    </p>

                                    <span className="text-xs font-medium tabular-nums text-stone-text">
                                        {Math.round(registrationProgress)}%
                                    </span>
                                </div>

                                <div
                                    className="mt-3 h-2 overflow-hidden rounded-full bg-stone/15"
                                    role="progressbar"
                                    aria-label="Event registration capacity"
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={Math.round(
                                        registrationProgress,
                                    )}
                                >
                                    <div
                                        className="h-full rounded-full bg-lime transition-all duration-500"
                                        style={{
                                            width: `${registrationProgress}%`,
                                        }}
                                    />
                                </div>

                                {registrationOpen &&
                                    event.spotsLeft > 0 && (
                                        <p className="mt-2 text-xs text-stone-text">
                                            {event.spotsLeft}{" "}
                                            {event.spotsLeft === 1
                                                ? "spot"
                                                : "spots"}{" "}
                                            remaining
                                        </p>
                                    )}
                            </div>
                        </div>

                        {/* Registration CTA */}
                        <div className="mt-8">
                            {registrationOpen ? (
                                <Link
                                    href={`/events/${event.slug}/register`}
                                    className="group label-caps inline-flex w-full items-center justify-center gap-3 bg-lime px-6 py-4 text-ink transition duration-300 hover:bg-lime/80 active:translate-y-px"
                                >
                                    Register now

                                    <ArrowRight
                                        aria-hidden
                                        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </Link>
                            ) : (
                                <div className="border border-ink/10 p-4 text-center">
                                    <AvailabilityChip
                                        event={event}
                                        showSpots
                                    />

                                    <p className="mt-2 text-sm text-stone-text">
                                        {event.spotsLeft === 0
                                            ? "This event is fully booked."
                                            : "Registrations for this event are closed."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-ink/10 bg-stone/5 px-6 py-4">
                        <p className="text-center text-xs leading-5 text-stone-text">
                            {registrationOpen
                                ? "Secure your spot by completing the registration form."
                                : "Check back for future events and opportunities."}
                        </p>
                    </div>
                </aside>
            </div>

            {/* Mobile sticky registration CTA */}
            {registrationOpen && (
                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
                    <Link
                        href={`/events/${event.slug}/register`}
                        className="group label-caps flex w-full items-center justify-center gap-3 bg-lime px-6 py-4 text-ink transition-colors hover:bg-lime/80"
                    >
                        Register now

                        <ArrowRight
                            aria-hidden
                            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </div>
            )}
        </>
    );
}

export default function EventDetailPage({ params }: Props) {
    return (
        <main className="mx-auto max-w-[1440px] px-4 py-12 pb-28 md:px-6 md:py-20 md:pb-32 lg:px-8 lg:pb-24">
            <Suspense
                fallback={
                    <div className="animate-pulse space-y-6">
                        <div className="aspect-[16/9] w-full bg-stone/10" />
                        <div className="h-8 w-2/3 bg-stone/10" />
                        <div className="h-4 w-full bg-stone/10" />
                        <div className="h-4 w-5/6 bg-stone/10" />
                    </div>
                }
            >
                <EventDetail params={params} />
            </Suspense>
        </main>
    );
}
