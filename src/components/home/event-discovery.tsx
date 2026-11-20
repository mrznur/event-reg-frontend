import Link from "next/link";
import { getUpcomingEvents, type Event } from "@/lib/api";
import { FeaturedEvent } from "./featured-event";
import { EventGrid } from "@/components/events/event-grid";

export function EventDiscoveryFallback() {
    return (
        <section aria-hidden="true" className="border-t border-ink/10">
            <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
                <div className="mb-10 h-10 w-72 animate-pulse bg-ink/10" />
                <div className="mb-8 h-56 w-full animate-pulse bg-ink/5" />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-72 animate-pulse bg-ink/5" />
                    ))}
                </div>
            </div>
        </section>
    );
}

export async function EventDiscovery() {
    let events: Event[] = [];
    let failed = false;

    try {
        events = await getUpcomingEvents();
    } catch {
        failed = true;
        events = [];
    }

    const featured = events[0] ?? null;
    const rest = events.slice(1, 4);

    return (
        <section aria-labelledby="discovery-heading" className="border-t border-ink/10">
            <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
                {/* Header */}
                <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="label-caps text-stone-text">Upcoming events</p>
                        <h2 id="discovery-heading" className="heading-2 mt-2">
                            Find Your Next{" "}
                            <span className="text-stone-text">Experience.</span>
                        </h2>
                    </div>
                    <p className="max-w-lg text-base leading-relaxed text-stone-text">
                        Discover upcoming opportunities to learn, compete, connect, and experience
                        technology with the BUCC community.
                    </p>
                </div>

                {failed ? (
                    <p className="text-stone-text">
                        Events could not be loaded right now. Please try again shortly.
                    </p>
                ) : events.length === 0 ? (
                    <p className="text-stone-text">No upcoming events yet. Check back soon.</p>
                ) : (
                    <div className="flex flex-col gap-10">
                        {/* Featured event */}
                        {featured && <FeaturedEvent event={featured} />}

                        {/* Rest of events */}
                        {rest.length > 0 && <EventGrid events={rest} />}
                    </div>
                )}

                {/* View all */}
                <div className="mt-10">
                    <Link
                        href="/events"
                        className="group label-caps relative isolate block w-fit overflow-hidden rounded px-4 py-2.5"
                    >
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-lime transition-transform duration-300 ease-out group-hover:scale-y-100"
                        />
                        View all events
                    </Link>
                </div>
            </div>
        </section>
    );
}
