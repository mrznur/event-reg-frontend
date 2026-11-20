import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getMyEventById, ApiError } from "@/lib/api";
import { EventForm } from "@/components/dashboard/event-form";

interface Props {
    params: Promise<{ id: string }>;
}

async function EditContent({ params }: { params: Promise<{ id: string }> }) {
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
            <h1 className="heading-3 mb-8">Edit event</h1>
            <EventForm event={event} />
        </div>
    );
}

export default function EditEventPage({ params }: Props) {
    return (
        <Suspense fallback={<div className="animate-pulse h-64 bg-ink/5" />}>
            <EditContent params={params} />
        </Suspense>
    );
}
