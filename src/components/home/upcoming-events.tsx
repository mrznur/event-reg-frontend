import { getUpcomingEvents, type Event } from "@/lib/api";
import { EventsCarousel } from "./events-carousel";

export function UpcomingEventsFallback() {
  return (
    <section aria-hidden="true" className="h-screen w-full animate-pulse bg-ink/5" />
  );
}

export async function UpcomingEvents() {
  let events: Event[] = [];
  let failed = false;

  try {
    events = (await getUpcomingEvents()).slice(0, 3);
  } catch {
    failed = true;
  }

  if (failed) {
    return (
      <section className="px-4 py-8 md:px-6 lg:px-8">
        <p className="text-stone-text">
          Events could not be loaded right now. Please try again shortly.
        </p>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="px-4 py-8 md:px-6 lg:px-8">
        <p className="text-stone-text">No upcoming events yet. Check back soon.</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="upcoming-heading">
      <h2 id="upcoming-heading" className="sr-only">Upcoming events</h2>
      <EventsCarousel events={events} />
    </section>
  );
}
