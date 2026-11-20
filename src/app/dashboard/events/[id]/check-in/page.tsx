import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMyEventById, ApiError } from "@/lib/api";
import { Scanner } from "@/components/checkin/scanner";
import { ManualSearch } from "@/components/checkin/manual-search";

interface Props {
    params: Promise<{ id: string }>;
}

async function CheckInContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let event;
    try {
        event = await getMyEventById(id);
    } catch (err) {
        if (err instanceof ApiError && err.status === 404) notFound();
        throw err;
    }

    return (
        <div>
            <div className="mb-8">
                <Link href={`/dashboard/events/${id}`} className="label-caps text-stone-text hover:text-ink">
                    ← {event.title}
                </Link>
                <h1 className="heading-3 mt-2">Check-in</h1>
                <p className="mt-1 text-sm text-stone-text">
                    {event.registeredCount} registered · {event.spotsLeft} spots left
                </p>
            </div>

            <div className="grid gap-10 md:grid-cols-2">
                {/* QR Scanner */}
                <div>
                    <h2 className="label-caps mb-4 text-stone-text">Scan QR code</h2>
                    <Scanner eventId={event.id} />
                </div>

                {/* Manual search */}
                <div>
                    <h2 className="label-caps mb-4 text-stone-text">Manual search</h2>
                    <ManualSearch eventId={event.id} />
                </div>
            </div>
        </div>
    );
}

export default function CheckInPage({ params }: Props) {
    return (
        <Suspense fallback={<div className="animate-pulse h-32 bg-ink/5" />}>
            <CheckInContent params={params} />
        </Suspense>
    );
}
