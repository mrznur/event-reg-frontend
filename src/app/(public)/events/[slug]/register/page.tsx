
import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Clock,
    Users,
    ArrowUpRight,
} from "lucide-react";

import { getEventBySlug, ApiError } from "@/lib/api";
import {
    canRegister,
    categoryLabel,
    formatDateLong,
    isAllowedImageHost,
} from "@/lib/events";

import { AvailabilityChip } from "@/components/events/availability-chip";
import { RegistrationForm } from "@/components/events/registration-form";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const event = await getEventBySlug(slug);
        return { title: `Register — ${event.title}` };
    } catch {
        return { title: "Register for Event" };
    }
}

async function RegisterContent({
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

    // Render subsequent code at request time.
    // This allows canRegister() to safely evaluate the current date.
    await connection();

    const isPicsumHost = isAllowedImageHost(event.coverImage);
    const registrationOpen = canRegister(event);

    return (
        <div className="mx-auto max-w-6xl">
            {/* Back navigation */}
            <Link
                href={`/events/${event.slug}`}
                className="group mb-10 inline-flex items-center gap-2 label-caps text-stone-text transition-colors hover:text-ink"
            >
                <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to event
            </Link>

            {!registrationOpen ? (
                <div className="mx-auto max-w-2xl border border-ink/10 bg-paper">
                    <div className="border-b border-ink/10 bg-stone/5 px-6 py-8 text-center">
                        <AvailabilityChip event={event} showSpots />

                        <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink">
                            {event.spotsLeft === 0
                                ? "This event is fully booked."
                                : "Registration is currently closed."}
                        </h1>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-text">
                            {event.spotsLeft === 0
                                ? "All available spots for this event have been filled. You can still visit the event page for more details."
                                : "Registration for this event is no longer available. Visit the event page to check the event details."}
                        </p>
                    </div>

                    <div className="p-6 text-center">
                        <Link
                            href={`/events/${event.slug}`}
                            className="group inline-flex items-center gap-2 bg-ink px-6 py-3.5 label-caps text-paper transition-colors hover:bg-ink/80"
                        >
                            View event details
                            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    {/* Page heading */}
                    <div className="mb-10 max-w-2xl">
                        <p className="label-caps text-stone-text">
                            BUCC / Event registration
                        </p>

                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink md:text-5xl">
                            Save your spot.
                        </h1>

                        <p className="mt-4 max-w-lg text-sm leading-7 text-stone-text md:text-base">
                            Complete the registration form to secure your place
                            at this event. We&apos;ll send your confirmation and
                            ticket details to your email.
                        </p>
                    </div>

                    {/* Main layout */}
                    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12">
                        {/* Event information */}
                        <section className="min-w-0">
                            {/* Cover image */}
                            <div className="group relative aspect-[16/9] overflow-hidden bg-stone/10">
                                {isPicsumHost ? (
                                    <Image
                                        src={event.coverImage}
                                        alt={event.title}
                                        fill
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 60vw"
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

                                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />

                                <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
                                    <span className="bg-paper px-3 py-2 label-caps text-ink">
                                        {categoryLabel(event.category)}
                                    </span>

                                    <AvailabilityChip event={event} showSpots />
                                </div>
                            </div>

                            {/* Event details */}
                            <div className="border-b border-ink/10 py-7">
                                <p className="label-caps text-stone-text">
                                    You&apos;re registering for
                                </p>

                                <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink md:text-4xl">
                                    {event.title}
                                </h2>

                                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-start gap-3 border border-ink/10 bg-paper p-4">
                                        <div className="flex size-10 shrink-0 items-center justify-center bg-lime/20 text-ink">
                                            <Calendar className="size-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="label-caps text-stone-text">
                                                Date & time
                                            </p>

                                            <time
                                                dateTime={event.startsAt}
                                                className="mt-2 block text-sm font-medium leading-6 text-ink"
                                            >
                                                {formatDateLong(
                                                    event.startsAt,
                                                    event.timezone,
                                                )}
                                            </time>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 border border-ink/10 bg-paper p-4">
                                        <div className="flex size-10 shrink-0 items-center justify-center bg-lime/20 text-ink">
                                            <MapPin className="size-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="label-caps text-stone-text">
                                                Venue
                                            </p>

                                            <p className="mt-2 text-sm font-medium leading-6 text-ink">
                                                {event.venue}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Registration guidance */}
                            <div className="flex items-start gap-3 py-6">
                                <div className="flex size-9 shrink-0 items-center justify-center bg-ink text-lime">
                                    <Users className="size-4" />
                                </div>

                                <div>
                                    <p className="label-caps text-ink">
                                        Before you register
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-stone-text">
                                        Make sure your name, email address, and
                                        phone number are correct. Your ticket
                                        confirmation will be sent to the email
                                        address you provide.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Registration form */}
                        <aside className="min-w-0 lg:sticky lg:top-24">
                            <div className="border border-ink/10 bg-paper shadow-sm">
                                <div className="border-b border-ink/10 bg-ink px-6 py-5">
                                    <p className="label-caps text-lime">
                                        Registration
                                    </p>

                                    <h2 className="mt-2 text-xl font-bold text-paper">
                                        Get your event ticket
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-paper/60">
                                        Enter your details to reserve your spot.
                                    </p>
                                </div>

                                <div className="p-5 sm:p-6">
                                    <RegistrationForm slug={event.slug} />
                                </div>
                            </div>

                            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-stone-text">
                                <Clock className="size-3.5" />
                                Registration confirmation is sent by email.
                            </p>
                        </aside>
                    </div>
                </>
            )}
        </div>
    );
}

export default function RegisterPage({ params }: Props) {
    return (
        <main className="mx-auto max-w-[1440px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20">
            <Suspense
                fallback={
                    <div className="mx-auto max-w-6xl animate-pulse space-y-8">
                        <div className="h-4 w-32 bg-stone/10" />
                        <div className="h-12 w-2/3 bg-stone/10" />

                        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
                            <div className="space-y-5">
                                <div className="aspect-[16/9] bg-stone/10" />
                                <div className="h-10 w-3/4 bg-stone/10" />
                                <div className="h-24 bg-stone/10" />
                            </div>

                            <div className="h-[520px] bg-stone/10" />
                        </div>
                    </div>
                }
            >
                <RegisterContent params={params} />
            </Suspense>
        </main>
    );
}
