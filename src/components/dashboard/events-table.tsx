import Link from "next/link";
import type { OrganizerEvent } from "@/lib/api";
import { formatDate } from "@/lib/events";

const STATUS_STYLES: Record<string, string> = {
    DRAFT: "bg-ink/10 text-stone-text",
    PUBLISHED: "bg-lime text-ink",
    CANCELLED: "bg-error/10 text-error",
};

interface Props {
    events: OrganizerEvent[];
}

export function DashboardEventsTable({ events }: Props) {
    if (events.length === 0) {
        return (
            <div className="border border-ink/10 p-10 text-center">
                <p className="text-stone-text">No events yet.</p>
                <Link
                    href="/dashboard/events/new"
                    className="mt-4 inline-block label-caps underline underline-offset-4 hover:text-stone-text"
                >
                    Create your first event
                </Link>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-ink/10 text-left">
                        <th className="label-caps pb-3 pr-4 text-stone-text font-normal">Event</th>
                        <th className="label-caps pb-3 pr-4 text-stone-text font-normal hidden md:table-cell">Date</th>
                        <th className="label-caps pb-3 pr-4 text-stone-text font-normal hidden sm:table-cell">Registered</th>
                        <th className="label-caps pb-3 pr-4 text-stone-text font-normal">Status</th>
                        <th className="label-caps pb-3 text-stone-text font-normal">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                    {events.map((event) => (
                        <tr key={event.id} className="group">
                            <td className="py-4 pr-4">
                                <Link
                                    href={`/dashboard/events/${event.id}`}
                                    className="font-medium hover:underline underline-offset-4"
                                >
                                    {event.title}
                                </Link>
                                <p className="text-stone-text text-xs mt-0.5">{event.venue}</p>
                            </td>
                            <td className="py-4 pr-4 text-stone-text hidden md:table-cell whitespace-nowrap">
                                <time dateTime={event.startsAt}>
                                    {formatDate(event.startsAt, event.timezone)}
                                </time>
                            </td>
                            <td className="py-4 pr-4 hidden sm:table-cell">
                                <span className="font-medium">{event.registeredCount}</span>
                                <span className="text-stone-text"> / {event.capacity}</span>
                            </td>
                            <td className="py-4 pr-4">
                                <span className={`label-caps rounded-sm px-2 py-1 ${STATUS_STYLES[event.status] ?? "bg-ink/10 text-stone-text"}`}>
                                    {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
                                </span>
                            </td>
                            <td className="py-4">
                                <div className="flex items-center gap-3 text-xs">
                                    <Link
                                        href={`/dashboard/events/${event.id}`}
                                        className="label-caps text-stone-text hover:text-ink"
                                    >
                                        Manage
                                    </Link>
                                    <Link
                                        href={`/dashboard/events/${event.id}/check-in`}
                                        className="label-caps text-stone-text hover:text-ink"
                                    >
                                        Check-in
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
