import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { getEventBySlug, ApiError } from "@/lib/api";
import { canRegister, categoryLabel, formatDateLong, isAllowedImageHost } from "@/lib/events";
import { AvailabilityChip } from "@/components/events/availability-chip";
import { RegistrationForm } from "@/components/events/registration-form";

interface Props {
    params: Promise<{ slug: string }>;
}

async function RegisterContent({ params }: { params: Promise<{ slug: string }> }) {
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

    // Closed / full — don't show the form
    if (!canRegister(event)) {
        return (
            <div className="mx-auto max-w-2xl">
                <Link
                    href={`/events/${event.slug}`}
                    className="group label-caps mb-8 inline-flex items-center gap-2 text-stone-text hover:text-ink"
                >
                    <ArrowLeft aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    Back to event
                </Link>

                <div className="border border-ink/10 p-8 text-center">
                    <AvailabilityChip event={event} showSpots />
                    <p className="mt-4 text-base text-stone-text">
                        {event.spotsLeft === 0
                            ? "This event is fully booked."
                            : "Registrations for this event are closed."}
                    </p>
                    <Link
                        href={`/events/${event.slug}`}
                        className="label-caps mt-6 inline-block underline underline-offset-8 hover:text-stone-text"
                    >
                        View event details
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl">
            {/* Back link */}
            <Link
                href={`/events/${event.slug}`}
                className="group label-caps mb-8 inline-flex items-center gap-2 text-stone-text hover:text-ink"
            >
                <ArrowLeft aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to event
            </Link>

            <div className="grid gap-8 md:grid-cols-[1fr_360px]">
                {/* Left — event summary */}
                <div>
                    {/* Cover image */}
                    <div className="relative mb-6 aspect-[3/2] overflow-hidden bg-stone/10">
                        {isPicsumHost ? (
                            <Image
                                src={event.coverImage}
                                alt={event.title}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 360px"
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
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="label-caps text-stone-text">
                            {categoryLabel(event.category)}
                        </span>
                        <AvailabilityChip event={event} showSpots />
                    </div>

                    {/* Title */}
                    <h1 className="heading-3 mb-4">{event.title}</h1>

                    {/* Meta */}
                    <div className="flex flex-col gap-2 text-sm text-stone-text">
                        <span className="flex items-center gap-2">
                            <Calendar aria-hidden className="size-4 shrink-0" />
                            <time dateTime={event.startsAt}>
                                {formatDateLong(event.startsAt, event.timezone)}
                            </time>
                        </span>
                        <span className="flex items-center gap-2">
                            <MapPin aria-hidden className="size-4 shrink-0" />
                            <span>{event.venue}</span>
                        </span>
                    </div>
                </div>

                {/* Right — registration form */}
                <div className="h-fit border border-ink/10 bg-paper p-6 md:sticky md:top-24">
                    <RegistrationForm slug={event.slug} />
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage({ params }: Props) {
    return (
        <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
            <Suspense
                fallback={
                    <div className="mx-auto max-w-2xl animate-pulse space-y-6">
                        <div className="h-5 w-32 rounded-sm bg-stone/10" />
                        <div className="aspect-[3/2] w-full rounded-sm bg-stone/10" />
                        <div className="h-8 w-2/3 rounded-sm bg-stone/10" />
                        <div className="h-40 rounded-sm bg-stone/10" />
                    </div>
                }
            >
                <RegisterContent params={params} />
            </Suspense>
        </div>
    );
}
