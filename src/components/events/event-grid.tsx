import type { Event } from "@/lib/api";
import { EventCard } from "./event-card";

interface Props {
    events: Event[];
}

export function EventGrid({ events }: Props) {
    if (events.length === 0) {
        return (
            <div className="py-20 text-center">
                <p className="heading-3 text-stone-text">No events found</p>
                <p className="mt-2 text-sm text-stone-text">
                    Try a different category or check back soon.
                </p>
            </div>
        );
    }

    return (
        <ul className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
                <li
                    key={event.id}
                    className="fade-up flex"
                    style={{ animationDelay: `${i * 80}ms` }}
                >
                    <EventCard event={event} />
                </li>
            ))}
        </ul>
    );
}
