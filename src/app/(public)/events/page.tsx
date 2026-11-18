import { Suspense } from "react";
import { getUpcomingEvents, type EventCategory } from "@/lib/api";
import { CategoryFilter } from "@/components/events/category-filter";
import { EventGrid } from "@/components/events/event-grid";

interface Props {
    searchParams: Promise<{ category?: string }>;
}

const VALID_CATEGORIES: EventCategory[] = ["WORKSHOP", "HACKATHON", "TALK", "SOCIAL"];

async function EventsContent({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const { category } = await searchParams;
    const safeCategory = VALID_CATEGORIES.includes(category as EventCategory)
        ? (category as EventCategory)
        : undefined;
    const events = await getUpcomingEvents(safeCategory);
    return <EventGrid events={events} />;
}

export const metadata = {
    title: "Events | BUCC",
    description: "Browse and register for upcoming BUCC events.",
};

export default function EventsPage({ searchParams }: Props) {
    return (
        <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
            {/* Page header */}
            <header className="mb-10">
                <p className="label-caps text-stone-text">BUCC</p>
                <h1 className="heading-2 mt-2">Upcoming Events</h1>
            </header>

            {/* Filters — client component, reads/writes URL search params */}
            <div className="mb-8">
                <Suspense>
                    <CategoryFilter />
                </Suspense>
            </div>

            {/* Grid — awaits searchParams inside Suspense so the page shell stays static */}
            <Suspense
                fallback={
                    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <li
                                key={i}
                                className="aspect-[3/4] animate-pulse rounded-sm bg-stone/10"
                            />
                        ))}
                    </ul>
                }
            >
                <EventsContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
