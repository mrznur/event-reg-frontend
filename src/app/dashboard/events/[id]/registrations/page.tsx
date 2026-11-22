import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMyEventById, getRegistrations, ApiError } from "@/lib/api";
import { RegistrationsTable } from "@/components/dashboard/registrations-table";

export const metadata: Metadata = {
    title: "Registrations",
};

interface Props {
    params: Promise<{ id: string }>;
}

async function RegistrationsContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let event, registrations;
    try {
        [event, registrations] = await Promise.all([
            getMyEventById(id),
            getRegistrations(id),
        ]);
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
                <h1 className="heading-3 mt-2">Registrations</h1>
            </div>
            <RegistrationsTable registrations={registrations} eventTitle={event.title} />
        </div>
    );
}

export default function RegistrationsPage({ params }: Props) {
    return (
        <Suspense fallback={<div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-ink/5" />)}</div>}>
            <RegistrationsContent params={params} />
        </Suspense>
    );
}
