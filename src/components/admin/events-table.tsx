"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminCancelEvent, ApiError, type AdminEvent } from "@/lib/api";
import { formatDate } from "@/lib/events";

const STATUS_STYLES: Record<string, string> = {
    DRAFT: "bg-ink/10 text-stone-text",
    PUBLISHED: "bg-lime text-ink",
    CANCELLED: "bg-error/10 text-error",
};

interface Props {
    events: AdminEvent[];
}

export function AdminEventsTable({ events }: Props) {
    const router = useRouter();
    const [cancelling, setCancelling] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleCancel(id: string, title: string) {
        if (!confirm(`Cancel event "${title}"? This cannot be undone.`)) return;
        setCancelling(id);
        setError(null);
        try {
            await adminCancelEvent(id);
            router.refresh();
        } catch (err) {
            setError(err instanceof ApiError ? err.messages[0] : "Failed to cancel event.");
        }
        setCancelling(null);
    }

    if (events.length === 0) {
        return <p className="text-stone-text">No events found.</p>;
    }

    return (
        <div>
            {error && <p className="mb-4 text-sm text-error">{error}</p>}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-ink/10 text-left">
                            <th className="label-caps pb-3 pr-4 font-normal text-stone-text">Event</th>
                            <th className="label-caps pb-3 pr-4 font-normal text-stone-text hidden md:table-cell">Organizer</th>
                            <th className="label-caps pb-3 pr-4 font-normal text-stone-text hidden sm:table-cell">Date</th>
                            <th className="label-caps pb-3 pr-4 font-normal text-stone-text hidden sm:table-cell">Registered</th>
                            <th className="label-caps pb-3 pr-4 font-normal text-stone-text">Status</th>
                            <th className="label-caps pb-3 font-normal text-stone-text">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td className="py-3 pr-4">
                                    <Link
                                        href={`/events/${event.slug}`}
                                        target="_blank"
                                        className="font-medium hover:underline underline-offset-4"
                                    >
                                        {event.title}
                                    </Link>
                                </td>
                                <td className="py-3 pr-4 text-stone-text hidden md:table-cell">
                                    {event.organizer.name}
                                </td>
                                <td className="py-3 pr-4 text-stone-text hidden sm:table-cell whitespace-nowrap">
                                    <time dateTime={event.startsAt}>
                                        {formatDate(event.startsAt, event.timezone)}
                                    </time>
                                </td>
                                <td className="py-3 pr-4 hidden sm:table-cell">
                                    <span className="font-medium">{event.registeredCount}</span>
                                    <span className="text-stone-text"> / {event.capacity}</span>
                                </td>
                                <td className="py-3 pr-4">
                                    <span className={`label-caps rounded-sm px-2 py-1 ${STATUS_STYLES[event.status] ?? ""}`}>
                                        {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
                                    </span>
                                </td>
                                <td className="py-3">
                                    {event.status !== "CANCELLED" && (
                                        <button
                                            onClick={() => handleCancel(event.id, event.title)}
                                            disabled={cancelling === event.id}
                                            className="label-caps cursor-pointer text-error hover:underline underline-offset-4 disabled:opacity-60"
                                        >
                                            {cancelling === event.id ? "Cancelling…" : "Cancel"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
