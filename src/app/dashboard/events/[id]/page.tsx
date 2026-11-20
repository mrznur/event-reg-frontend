import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { getMyEventById, ApiError } from "@/lib/api";
import { formatDateLong } from "@/lib/events";
import { EventStatusActions } from "@/components/dashboard/event-status-actions";

interface Props {
    params: Promise<{ id: string }>;
}

async function EventManage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let event;
    try {
        event = await getMyEventById(id);
    } catch (err) {
        if (err instanceof ApiError && err.status === 404) notFound();
        throw err;
    }

    const spotsUsed = event.capacity - event.spotsLeft;

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <Link href="/dashboard" className="label-caps text-stone-text hover:text-ink">
                        ← All events
                    </Link>
                    <h1 className="heading-3 mt-2">{event.title}</h1>
                    <Link
                        href={`/events/${event.slug}`}
                        target="_blank"
                        className="mt-1 inline-flex items-center gap-1 text-sm text-stone-text hover:text-ink"
                    >
                        Public page <ExternalLink aria-hidden className="size-3" />
                    </Link>
                </div>
                <EventStatusActions event={event} />
            </div>

            {/* Counters */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                    { label: "Registered", value: event.registeredCount },
                    { label: "Checked in", value: spotsUsed },
                    { label: "Spots left", value: event.spotsLeft },
                ].map((c) => (
                    <div key={c.label} className="border border-ink/10 p-5">
                        <p className="label-caps text-stone-text">{c.label}</p>
                        <p className="mt-1 text-3xl font-bold">{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Event details */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
                <div className="border border-ink/10 p-6">
                    <h2 className="label-caps mb-4 text-stone-text">Details</h2>
                    <dl className="flex flex-col gap-3 text-sm">
                        <dd className="flex items-start gap-2 text-stone-text">
                            <Calendar aria-hidden className="mt-0.5 size-4 shrink-0" />
                            <div>
                                <span className="block font-medium text-ink">Starts</span>
                                {formatDateLong(event.startsAt, event.timezone)}
                                <span className="mt-1 block font-medium text-ink">Ends</span>
                                {formatDateLong(event.endsAt, event.timezone)}
                            </div>
                        </dd>
                        <dd className="flex items-center gap-2 text-stone-text">
                            <MapPin aria-hidden className="size-4 shrink-0" />
                            {event.venue}
                        </dd>
                        <dd className="flex items-center gap-2 text-stone-text">
                            <Users aria-hidden className="size-4 shrink-0" />
                            Capacity: {event.capacity}
                        </dd>
                    </dl>
                </div>

                <div className="border border-ink/10 p-6">
                    <h2 className="label-caps mb-4 text-stone-text">Description</h2>
                    <p className="text-sm leading-relaxed text-stone-text">{event.description}</p>
                </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-3">
                <Link
                    href={`/dashboard/events/${event.id}/registrations`}
                    className="label-caps border border-ink/20 px-5 py-3 text-ink hover:bg-ink/5 transition-colors"
                >
                    View registrations
                </Link>
                <Link
                    href={`/dashboard/events/${event.id}/check-in`}
                    className="label-caps bg-lime px-5 py-3 text-ink hover:bg-lime-400 transition-colors"
                >
                    Start check-in
                </Link>
                <Link
                    href={`/dashboard/events/${event.id}/edit`}
                    className="label-caps border border-ink/20 px-5 py-3 text-ink hover:bg-ink/5 transition-colors"
                >
                    Edit event
                </Link>
            </div>
        </div>
    );
}

export default function EventManagePage({ params }: Props) {
    return (
        <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-8 w-64 bg-ink/5" /><div className="h-32 bg-ink/5" /></div>}>
            <EventManage params={params} />
        </Suspense>
    );
}
